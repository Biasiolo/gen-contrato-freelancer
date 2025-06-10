import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

/* ─── Layout & cores ─────────────────────────────── */
const PAGE   = [595, 842];
const M      = 40;
const COL    = [
  M,             // Serviço
  M + 230,       // Qtd
  M + 290,       // Prazo
  M + 360,       // Valor Unit.
  M + 470,       // Subtotal
];
const LH     = 18;

const C_TEAL   = rgb(0 / 255, 118 / 255, 110 / 255);
const C_GRAY   = rgb(0.92, 0.92, 0.94);
const C_BORDER = rgb(0.75, 0.75, 0.75);
const C_TEXT   = rgb(0.15, 0.15, 0.15);

/* util */
const fmt = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const str = (v) => String(v);

function tx(page, text, { x, y, f, s = 10, c = C_TEXT, right = false }) {
  const t = str(text);
  if (right) x -= f.widthOfTextAtSize(t, s);
  page.drawText(t, { x, y, size: s, font: f, color: c });
}
function hLine(page, y, color = C_BORDER) {
  page.drawLine({ start: { x: M, y }, end: { x: PAGE[0] - M, y }, thickness: 0.3, color });
}
function rect(page, { x, y, w, h, fill, r = 0 }) {
  page.drawRectangle({ x, y, width: w, height: h, color: fill, borderRadius: r });
}

/* ─── Função principal ───────────────────────────── */
export async function generateProposalPDF(data, template = '/MODELO-PROPOSTA.pdf') {
  /* 1. template */
  const buf  = await fetch(template).then((r) => r.arrayBuffer());
  const src  = await PDFDocument.load(buf);
  const pdf  = await PDFDocument.create();

  /* 2. copia as 3 páginas originais */
  const [p0, p1, p2] = await pdf.copyPages(src, [0, 1, 2]);
  pdf.addPage(p0); pdf.addPage(p1); pdf.addPage(p2);

  /* 3. fontes */
  const helv = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  /* 4. pacotes com itens */
  const packages = (Array.isArray(data.packages) ? data.packages : []).filter(
    (p) => p.items && p.items.length,
  );

  /* 5. página da proposta comercial */
  let page = pdf.addPage(PAGE);
  let y    = 780;

  /* título + dados do cliente */
  tx(page, 'Proposta Comercial', { x: M, y, f: helv, s: 32 }); y -= 32;
  tx(page, `Cliente: ${data.client.company}`, { x: M, y, f: helv, s: 14 }); y -= 14;
  tx(page, `ID: ${data.proposalId}    Data: ${data.today}`, { x: M, y, f: helv, s: 12 }); y -= 42;

  /* 5.1 pacotes */
  for (const pkg of packages) {
    /* cabeçalho simples */
    tx(page, `${pkg.name} – Pacote: ${fmt(pkg.total)}`,
       { x: M, y, f: helv, s: 18 }); y -= 20;

    /* cabeçalho tabela */
    ['Serviço','Qtd','Prazo','Valor Unit.','Subtotal'].forEach((t,i)=>
  tx(page, t, { x: COL[i] + (i ? 2 : 0), y, f: bold, s: 9 }));
hLine(page, y - 2); y -= LH;

    /* linhas */
    for (const item of pkg.items) {
      if (y < 100) { page = pdf.addPage(PAGE); y = 780; }
      const prazo = item.isMonthly ? `${item.term} mês(es)` : 'Único';
      const cells = [
  { v: item.title,          x: COL[0] + 2,  right: false },
  { v: item.qty,            x: COL[1] + 15, right: true  }, // offset ↓
  { v: prazo,               x: COL[2] + 32, right: true  }, // offset ↓
  { v: fmt(item.unitValue), x: COL[3] + 50, right: true  }, // offset ↓
  { v: fmt(item.subtotal),  x: COL[4] + 40,  right: true  },
];
      cells.forEach(c => tx(page, c.v, { x: c.x, y, f: helv, s: 9, right: c.right }));
      hLine(page, y - 2, C_GRAY); y -= LH;
    }

    /* condições */
    const BOX = 32;
    rect(page, { x: M, y: y - BOX, w: PAGE[0] - M*2, h: BOX, fill: C_GRAY, r: 6 });
    const txt = `Método: ${pkg.cond.method}   Entrada: ${fmt(pkg.cond.entry)}   ` +
                `Saldo: ${fmt(pkg.cond.saldo)}` +
                (pkg.cond.parcelas ? ` em ${pkg.cond.parcelas}x de ${fmt(pkg.cond.parcela)}` : '');
    tx(page, txt, { x: M + 12, y: y - 20, f: helv, s: 9 });
    y -= BOX + 24;
  }

  /* 5.2 total geral */
  tx(page, `Total Geral: ${fmt(data.totals.overall)}`, { x: PAGE[0]-M, y, f: bold, s: 12, right: true });
  y -= 32;

  /* 5.3 condições gerais */
  const title = 'Condições Gerais de Pagamento';

/* fundo preto (ou aproveite C_TEAL se quiser) */
rect(page, {
  x: M,
  y: y - 24,             // 24 px de altura
  w: PAGE[0] - M * 2,
  h: 24,
  fill: rgb(0, 0, 0),    // PRETO
  r: 10,
});

/* largura do texto para centralizar */
const titleWidth = bold.widthOfTextAtSize(title, 12);
const centerX = PAGE[0] / 2 - titleWidth / 2;

/* texto em branco */
tx(page, title, {
  x: centerX,
  y: y - 17,             // 17 px desce p/ alinhar vertical
  f: bold,
  s: 14,
  c: rgb(1, 1, 1),
});

y -= 36;                 // espaço depois do cabeçalho

/* 5.3.1 resumo adicional — box centralizado ---------------- */
const RES_H = 26;                                     // altura do card
rect(page, {
  x: M,
  y: y - RES_H,
  w: PAGE[0] - M * 2,
  h: RES_H,
  fill: C_GRAY,
  r: 6,
});

const resumoTxt =
  `Entrada Total: ${fmt(data.entradaTotal)}   |   Parcelas Máx.: ${data.maxParcelas}`;

/* largura do texto para centralizar */
const resumoW = helv.widthOfTextAtSize(resumoTxt, 12);
const resumoX = PAGE[0] / 2 - resumoW / 2;

/* escreve texto em 12 pt, centralizado na vertical do box */
tx(page, resumoTxt, {
  x: resumoX,
  y: y - RES_H + (RES_H / 2) - 3,   // ajuste vertical
  f: helv,
  s: 12,
});

y -= RES_H + 12;    // espaço depois do card


  data.parcelasAgrupadas.forEach(p => {
    if (y < 60) { page = pdf.addPage(PAGE); y = 780; }
    rect(page, { x: M, y: y - 18, w: PAGE[0]-M*2, h: 18, fill: C_GRAY, r: 6 });
    const label = p.de === p.ate ? `Parcela ${p.de}` : `Da ${p.de}ª à ${p.ate}ª parcela`;
    tx(page, label,            { x: M + 12, y: y - 12, f: helv, s: 9 });
    tx(page, fmt(p.valor),     { x: PAGE[0]-M-12, y: y - 12, f: helv, s: 9, right: true });
    y -= 26;
  });

  const footerBytes = await fetch('/rodape-proposta.png').then(r => r.arrayBuffer());
const footerImg   = await pdf.embedPng(footerBytes);          // use embedJpg se for .jpg

/* ❷  Página final (a variável page já aponta para ela) */
const lastPage = page;                                        // page → último addPage

/* ❸  Calcula escala para ocupar a largura completa */
const scale    = PAGE[0] / footerImg.width;
const footH    = footerImg.height * scale;

/* ❹  Desenha alinhado na borda inferior, sem margem */
lastPage.drawImage(footerImg, {
  x: 0,
  y: 0,                     // fundo, sem margem
  width: PAGE[0],           // largura total
  height: footH,
});

  /* 6. salva */
  return new Blob([await pdf.save()], { type: 'application/pdf' });
}
