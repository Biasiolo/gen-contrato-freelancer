// src/pdf/generateProposalPDF.js
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

/* ─── Layout & cores ─────────────────────────────── */
const PAGE = [596, 842];          // A4 portrait, pontos
const M    = 40;                  // margem lateral

const COL  = [                    // x das colunas
  M,
  M + 230,
  M + 290,
  M + 360,
  M + 470,
];

const LH = 18;                    // line height

/* cores */
const C_GRAY   = rgb(0.92, 0.92, 0.94);
const C_BORDER = rgb(0.75, 0.75, 0.75);
const C_TEXT   = rgb(0.15, 0.15, 0.15);



/* helpers simples */
const fmt = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

function tx(page, text, { x, y, f, s = 10, c = C_TEXT, right = false }) {
  const t = String(text);
  const xx = right ? x - f.widthOfTextAtSize(t, s) : x;
  page.drawText(t, { x: xx, y, size: s, font: f, color: c });
}

const hLine = (page, y, c = C_BORDER) =>
  page.drawLine({ start: { x: M, y }, end: { x: PAGE[0] - M, y }, thickness: 0.3, color: c });

const rect = (page, { x, y, w, h, fill, r = 0 }) =>
  page.drawRectangle({ x, y, width: w, height: h, color: fill, borderRadius: r });

/* ─── Função principal ───────────────────────────── */
export async function generateProposalPDF(data, template = '/MODELO-PROPOSTA.pdf') {
  /* 1. carrega template */
  const tmpl = await fetch(template).then((r) => r.arrayBuffer());
  const src  = await PDFDocument.load(tmpl);

  /* 2. cria novo PDF e copia capas (0-2) */
  const pdf  = await PDFDocument.create();
  const [cap0, cap1, cap2] = await pdf.copyPages(src, [0, 1, 2]);
  pdf.addPage(cap0); pdf.addPage(cap1); pdf.addPage(cap2);

  /* 3. fontes */
  const helv = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  /* 4. embute a marca-d’água UMA vez */
  const wmBytes = await fetch('/marca.png').then(r=>r.arrayBuffer());
  const wmImg   = await pdf.embedPng(wmBytes);
  const WM_SCALE = 0.3;                           // escala que você aprovou
  const wmW  = wmImg.width  * WM_SCALE;
  const wmH  = wmImg.height * WM_SCALE;
  const wmX  = (PAGE[0] - wmW) / 2;
  const wmY  = (PAGE[1] - wmH) / 8;

  /* helper desenha watermark em uma página */
  const drawWatermark = (p) => {
    p.drawImage(wmImg, {
      x: wmX,
      y: wmY,
      width:  wmW,
      height: wmH,
      opacity: 0.25,
    });
  };

  /* 5. filtra pacotes escolhidos */
  const packages = (Array.isArray(data.packages) ? data.packages : [])
    .filter((p) => p.items?.length);

  /* 6. cria página 4 (proposta comercial) */
  let page = pdf.addPage(PAGE);
  drawWatermark(page);            // ← fica no fundo
  let y = 780;

  /* cabeçalho */
  tx(page, 'Proposta Comercial', { x: M, y, f: helv, s: 32 }); y -= 32;
  tx(page, `Cliente: ${data.client.company}`, { x: M, y, f: helv, s: 14 }); y -= 14;
  tx(page, `ID: ${data.proposalId}    Data: ${data.today}`, { x: M, y, f: helv, s: 12 }); y -= 42;

  /* 7. blocos de pacotes ------------------------------------------------- */
  for (const pkg of packages) {
    tx(page, `${pkg.name} – Pacote: ${fmt(pkg.total)}`, { x: M, y, f: helv, s: 18 }); y -= 20;

    ['Serviço','Qtd','Prazo','Valor Unit.','Subtotal'].forEach((t,i)=>
      tx(page, t, { x: COL[i] + (i?2:0), y, f: bold, s: 9 }));
    hLine(page, y - 2); y -= LH;

    for (const item of pkg.items) {
      if (y < 100) {                       // quebra de página
        page = pdf.addPage(PAGE);
        drawWatermark(page);               // marca-d’água na nova página
        y = 780;
      }
      const prazo = item.isMonthly ? `${item.term} mês(es)` : 'Único';
      const cells = [
        { v: item.title,          x: COL[0] + 2,  r:false },
        { v: item.qty,            x: COL[1] + 15, r:true  },
        { v: prazo,               x: COL[2] + 32, r:true  },
        { v: fmt(item.unitValue), x: COL[3] + 50, r:true  },
        { v: fmt(item.subtotal),  x: COL[4] + 40, r:true  },
      ];
      cells.forEach(c => tx(page, c.v, { x:c.x, y, f: helv, s: 9, right:c.r }));
      hLine(page, y - 2, C_GRAY); y -= LH;
    }

    /* condições do pacote */
    const BOX = 32;
    rect(page, { x:M, y:y-BOX, w:PAGE[0]-M*2, h:BOX, fill:C_GRAY, r:6 });
    const txt = `Método: ${pkg.cond.method}   Entrada: ${fmt(pkg.cond.entry)}   ` +
                `Saldo: ${fmt(pkg.cond.saldo)}` +
                (pkg.cond.parcelas ? ` em ${pkg.cond.parcelas}x de ${fmt(pkg.cond.parcela)}` : '');
    tx(page, txt, { x:M+12, y:y-20, f: helv, s:9 });
    y -= BOX + 32;
  }

  /* 8. total geral */
  tx(page, `Total Geral: ${fmt(data.totals.overall)}`, { x:PAGE[0]-M, y, f:bold, s:16, right:true });
  y -= 32;

  /* 9. condições gerais + resumo + parcelas ------------------------------ */
  const title = 'Condições Gerais de Pagamento';
  rect(page, { x:M, y:y-24, w:PAGE[0]-M*2, h:24, fill: rgb(0,0,0), r:10 });
  const titleW = bold.widthOfTextAtSize(title, 12);
  tx(page, title, { x: PAGE[0]/2 - titleW/2, y:y-17, f:bold, s:14, c:rgb(1,1,1) });
  y -= 36;

  /* resumo */
  const RES_H = 26;
  rect(page, { x:M, y:y-RES_H, w:PAGE[0]-M*2, h:RES_H, fill:C_GRAY, r:6 });
  const resumo = `Entrada Total: ${fmt(data.entradaTotal)}   |   Parcelas Máx.: ${data.maxParcelas}`;
  const resumoW = helv.widthOfTextAtSize(resumo, 12);
  tx(page, resumo, { x: PAGE[0]/2 - resumoW/2, y:y-RES_H/2-3, f:helv, s:12 });
  y -= RES_H + 12;

  /* parcelas */
  data.parcelasAgrupadas.forEach(p=>{
    if (y < 60) {
      page = pdf.addPage(PAGE);
      drawWatermark(page);
      y = 780;
    }
    rect(page, { x:M, y:y-18, w:PAGE[0]-M*2, h:18, fill:C_GRAY, r:6 });
    const label = p.de===p.ate ? `Parcela ${p.de}` : `Da ${p.de}ª à ${p.ate}ª parcela`;
    tx(page, label, { x:M+12, y:y-12, f:helv, s:9 });
    tx(page, fmt(p.valor), { x:PAGE[0]-M-12, y:y-12, f:helv, s:9, right:true });
    y -= 26;
  });

  /* 10. rodapé largura total (na última página usada) */
  {
    const footBytes = await fetch('/rodape-proposta.png').then(r=>r.arrayBuffer());
    const footImg   = await pdf.embedPng(footBytes);
    const scale = PAGE[0] / footImg.width;
    page.drawImage(footImg, {
      x: 0,
      y: 0,
      width: PAGE[0],
      height: footImg.height * scale,
    });
  }

  /* 11. salva */
  const bytes = await pdf.save();
  return new Blob([bytes], { type: 'application/pdf' });
}
