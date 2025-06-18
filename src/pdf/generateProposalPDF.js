// src/pdf/generateProposalPDF.js
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

/* ─── Layout & cores ─────────────────────────────── */
const PAGE = [596, 842];    // A4 portrait, em pontos
const M    = 40;            // margem lateral

const COL = [               // x de cada coluna
  M,
  M + 260,
  M + 320,
  M + 390,
  M + 500,
];

const LH        = 18;       // linha principal (nome, qty, etc.)
const DESC_FT   = 8;        // fonte da descrição
const DESC_LH   = 10;       // line-height da descrição

/* cores */
const C_GRAY   = rgb(0.92, 0.92, 0.94);
const C_BORDER = rgb(0.75, 0.75, 0.75);
const C_TEXT   = rgb(0.15, 0.15, 0.15);
const C_DESC   = rgb(0.30, 0.30, 0.30);

/*──────────────── helpers ——————————————————————————*/
const fmt = (v) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

function tx(page, text, { x, y, f, s = 10, c = C_TEXT, right = false }) {
  const t  = String(text);
  const xx = right ? x - f.widthOfTextAtSize(t, s) : x;
  page.drawText(t, { x: xx, y, size: s, font: f, color: c });
}

const hLine = (page, y, c = C_BORDER) =>
  page.drawLine({ start: { x: M, y }, end: { x: PAGE[0] - M, y },
                  thickness: 0.3, color: c });

const rect = (page, { x, y, w, h, fill, r = 0 }) =>
  page.drawRectangle({ x, y, width: w, height: h, color: fill, borderRadius: r });

/* quebra texto da descrição em várias linhas dentro de um width máximo */
function wrapText(text, font, size, maxWidth) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let   line  = '';

  words.forEach((w) => {
    const test = line ? `${line} ${w}` : w;
    if (font.widthOfTextAtSize(test, size) <= maxWidth) {
      line = test;
    } else {
      if (line) lines.push(line);
      line = w;
    }
  });
  if (line) lines.push(line);
  return lines;
}

/* ─── Função principal ───────────────────────────── */
export async function generateProposalPDF(data, template = '/MODELO-PROPOSTA.pdf') {
  /* 1. template base */
  const tmpl = await fetch(template).then((r) => r.arrayBuffer());
  const src  = await PDFDocument.load(tmpl);

  /* 2. novo PDF + capas do modelo */
  const pdf = await PDFDocument.create();
  const [cap0, cap1, cap2] = await pdf.copyPages(src, [0, 1, 2]);
  pdf.addPage(cap0); pdf.addPage(cap1); pdf.addPage(cap2);

  /* 3. fontes */
  const helv = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  /* 4. marca-d'água (reutilizável) */
  const wmBytes  = await fetch('/marca.png').then((r) => r.arrayBuffer());
  const wmImg    = await pdf.embedPng(wmBytes);
  const WM_SCALE = 0.3;
  const wmW      = wmImg.width  * WM_SCALE;
  const wmH      = wmImg.height * WM_SCALE;
  const wmX      = (PAGE[0] - wmW) / 2;
  const wmY      = (PAGE[1] - wmH) / 8;
  const drawWM = (p) =>
    p.drawImage(wmImg, { x: wmX, y: wmY, width: wmW, height: wmH, opacity: 0.25 });

  /* 5. pacotes escolhidos */
  const packages = (Array.isArray(data.packages) ? data.packages : [])
    .filter((p) => p.items?.length);

  /* 6. página da proposta (4ª) */
  let page = pdf.addPage(PAGE);
  drawWM(page);
  let y = 780;

  /* Cabeçalho principal */
  
  tx(page, 'Proposta Comercial', { x: M, y, f: bold, s: 32 }); y -= 32;


// Informações do cliente
tx(page, `Cliente: ${data.client.company}`, { x: M, y, f: helv, s: 13, });
y -= 16;

tx(page, `ID da Proposta: ${data.proposalId}`, { x: M, y, f: helv, s: 12,});
y -= 14;

tx(page, `Data de Emissão: ${data.today}`, { x: M, y, f: helv, s: 12, });
y -= 36;

  /* 7. blocos de pacotes ---------------------------------------------- */
  for (const pkg of packages) {
    tx(page, `${pkg.name}`, { x: M, y, f: bold, s: 18 }); y -= 20;

    /* CORREÇÃO: Títulos das colunas alinhados com o conteúdo */
    const headerCells = [
      { text: 'Serviço',      x: COL[0] + 15, right: false },
      { text: 'Valor Unit.',  x: COL[1] + 32, right: true  },
      { text: 'Qtd',          x: COL[2] + 50, right: true  },
      { text: 'Periodicidade',        x: COL[3] + 61, right: true  }
    ];

    headerCells.forEach((header) =>
      tx(page, header.text, { x: header.x, y, f: bold, s: 9, right: header.right }));
    
    hLine(page, y - 4); y -= LH;

    /* linhas de serviço + descrição */
    for (const item of pkg.items) {
      /* quebra de página automática */
      if (y < 100) {
        page = pdf.addPage(PAGE);
        drawWM(page);
        y = 780;
      }

      /* linha principal - mantém as mesmas posições */
      const prazo = item.isMonthly ? `Mensal` : 'Único';
      const cells = [
        { v: item.title,           x: COL[0] + 17,  r: false },
        { v: fmt(item.unitValue),  x: COL[1] + 32,  r: true  },
        { v: item.qty,             x: COL[2] + 48,  r: true  },
        { v: prazo,                x: COL[3] + 44,  r: true  },
      ];
      
      cells.forEach((c) =>
        tx(page, c.v, { x: c.x, y, f: helv, s: 9, right: c.r }));
      y -= 12;                        /* ↓ 12 pt – aproxima descrição */

      /* descrição (opcional) */
      if (item.description) {
        const maxW  = COL[4] - COL[0] - 10;
        const lines = wrapText(item.description, helv, DESC_FT, maxW);

        for (const line of lines) {
          if (y < 80) {
            page = pdf.addPage(PAGE);
            drawWM(page);
            y = 780;
          }
          tx(page, line, { x: COL[0] + 6, y, f: helv, s: DESC_FT, c: C_DESC });
          y -= DESC_LH;
        }
      }

      y -= 8;                         /* margem inferior do item */
      /* linha divisória entre itens */
      hLine(page, y + 4, C_GRAY);
      y -= 12;                         /* espaço extra pós-linha */
    }

    /* condições do pacote */
    const BOX = 30;
    rect(page, { x: M, y: y - BOX, w: PAGE[0] - M * 2, h: BOX, fill: C_GRAY, r: 6 });

    const txtCond =
      
      (pkg.cond.parcelas ? ` ${pkg.cond.parcelas}x de ${fmt(pkg.cond.parcela)}` : '');

    const fontSize = 8;
    const textWidth = helv.widthOfTextAtSize(txtCond, fontSize);
    const centerX = (PAGE[0] - textWidth) / 2;

    tx(page, txtCond, { x: centerX, y: y - 18, f: bold, s: fontSize });
    y -= BOX + 30;
  }


  /* 9. condições gerais + resumo + parcelas --------------------------- */
  const title = 'Condições Gerais de Pagamento';
rect(page, { x: M, y: y - 28, w: PAGE[0] - M * 2, h: 28, fill: rgb(0, 0, 0), r: 8 });
tx(page, title, {
  x: PAGE[0] / 2 - bold.widthOfTextAtSize(title, 13) / 2,
  y: y - 20,
  f: bold,
  s: 13,
  c: rgb(1, 1, 1)
});
y -= 40;

  /* resumo */
  const RES_H = 32;
rect(page, {
  x: M,
  y: y - RES_H,
  w: PAGE[0] - M * 2,
  h: RES_H,
  fill: C_GRAY,
  r: 8,
});
const resumo =
  `Entrada Total: ${fmt(data.entradaTotal)}   |   Parcelas: ${data.maxParcelas}`;
const resumoW = bold.widthOfTextAtSize(resumo, 11);
tx(page, resumo, {
  x: PAGE[0] / 2 - resumoW / 2,
  y: y - RES_H / 2 - 4,
  f: bold,
  s: 11,
  c: rgb(0.2, 0.2, 0.2),
});
y -= RES_H + 12;

  /* parcelas */
  data.parcelasAgrupadas.forEach((p) => {
    if (y < 60) {
      page = pdf.addPage(PAGE);
      drawWM(page);
      y = 780;
    }
    rect(page, { x: M, y: y - 18, w: PAGE[0] - M * 2, h: 22, fill: C_GRAY, r: 6 });
    const label =
      p.de === p.ate ? `Parcela ${p.de}` : `Da ${p.de}ª à ${p.ate}ª parcela`;
    tx(page, label, { x: M + 12, y: y - 12, f: bold, s: 12 });
    tx(page, fmt(p.valor),
       { x: PAGE[0] - M - 12, y: y - 12, f: bold, s: 12, right: true });
    y -= 32;
  });

  // 9.5 – Detalhes adicionais
if (data.details) {
  // Cálculo de altura estimada do bloco de detalhes
  const maxTextWidth = PAGE[0] - M * 2 - 20;
  const detailLines = wrapText(data.details, helv, 9, maxTextWidth);
  const blocoAltura = 36 + detailLines.length * 12 + 16;

  // Se faltar espaço, abre nova página
  if (y - blocoAltura < 80) {
    page = pdf.addPage(PAGE);
    drawWM(page);
    y = 780;
  }

  // Desenho do bloco de fundo
  rect(page, {
    x: M,
    y: y - blocoAltura,
    w: PAGE[0] - M * 2,
    h: blocoAltura,
    fill: rgb(0.98, 0.98, 0.98),
    r: 8
  });

  // Título centralizado
  const title = 'Detalhes Adicionais';
  const titleWidth = bold.widthOfTextAtSize(title, 12);
  tx(page, title, {
    x: PAGE[0] / 2 - titleWidth / 2,
    y: y - 20,
    f: bold,
    s: 12,
    c: C_TEXT
  });

  // Linhas de texto
  let lineY = y - 36;
  for (const line of detailLines) {
    tx(page, line, { x: M + 10, y: lineY, f: helv, s: 9, c: C_DESC });
    lineY -= 12;
  }

  y = lineY - 12;
}



  /* 10. rodapé (última página) ---------------------------------------- */
  const footBytes = await fetch('/rodape-proposta.png').then((r) => r.arrayBuffer());
  const footImg   = await pdf.embedPng(footBytes);
  const scale     = PAGE[0] / footImg.width;
  page.drawImage(footImg,
    { x: 0, y: 0, width: PAGE[0], height: footImg.height * scale });

  /* 11. salva PDF ------------------------------------------------------ */
  const bytes = await pdf.save();
  return new Blob([bytes], { type: 'application/pdf' });
}