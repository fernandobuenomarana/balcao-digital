// Cria a cobrança no Mercado Pago (Checkout Pro) e devolve o link de pagamento.
// Variáveis de ambiente (painel da Netlify > Site configuration > Environment variables):
//   MP_ACCESS_TOKEN   Access Token de PRODUÇÃO do Mercado Pago (APP_USR-...)
import { CATALOGO } from "../lib/catalogo.mjs";

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { "content-type": "application/json" } });
const digitos = (s) => String(s ?? "").replace(/\D/g, "");
const brl = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const centavos = (v) => Math.round(v * 100) / 100;

// Tipos de pagamento do Mercado Pago que ficam de fora em cada opção escolhida no site
const EXCLUIR = {
  PIX: ["credit_card", "debit_card", "ticket", "atm", "prepaid_card"],
  "Cartão": ["ticket", "bank_transfer", "atm"],
  Boleto: ["credit_card", "debit_card", "bank_transfer", "atm", "prepaid_card"],
};

export default async (req) => {
  if (req.method !== "POST") return json({ erro: "Método não permitido." }, 405);
  const token = process.env.MP_ACCESS_TOKEN;
  if (!token) return json({ erro: "Pagamento online ainda não configurado." }, 503);

  let d;
  try { d = await req.json(); } catch { return json({ erro: "Pedido inválido." }, 400); }

  // ---- cliente ----
  const nome = String(d.nome ?? "").trim().slice(0, 80);
  let telefone = digitos(d.telefone);
  if (telefone.length === 10 || telefone.length === 11) telefone = "55" + telefone;
  if (nome.length < 2) return json({ erro: "Informe seu nome." }, 400);
  if (!/^55\d{10,11}$/.test(telefone)) return json({ erro: "Informe seu WhatsApp com DDD." }, 400);

  const pagamento = Object.hasOwn(EXCLUIR, d.pagamento) ? d.pagamento : null;
  if (!pagamento) return json({ erro: "Escolha a forma de pagamento." }, 400);

  // ---- itens (preço sempre do catálogo) ----
  if (!Array.isArray(d.itens) || d.itens.length === 0 || d.itens.length > 20)
    return json({ erro: "Carrinho vazio." }, 400);
  const itens = [];
  for (const i of d.itens) {
    const linha = CATALOGO.linhas[i?.linha];
    const emb = linha?.embalagens[i?.emb];
    const cor = CATALOGO.cores[i?.cor];
    const q = Math.floor(Number(i?.q));
    if (!linha || !emb || !cor || !(q >= 1 && q <= 50))
      return json({ erro: "Há um produto inválido no carrinho." }, 400);
    if (!linha.vendaOnline)
      return json({ erro: `A ${linha.nome} está em pré-venda. Finalize pelo WhatsApp.`, whatsapp: true }, 400);
    itens.push({ id: `${i.linha}-${i.emb}-${i.cor}`, linha, emb, cor, q });
  }

  // ---- entrega ----
  let entrega = "Retirar na loja", endereco = "", frete = 0;
  if (d.entrega !== "loja") {
    const cep = digitos(d.cep);
    const numero = String(d.numero ?? "").trim().slice(0, 60);
    if (cep.length !== 8) return json({ erro: "Informe o CEP." }, 400);
    if (!numero) return json({ erro: "Informe o número do endereço." }, 400);
    let v = null;
    try { v = await (await fetch(`https://viacep.com.br/ws/${cep}/json/`)).json(); } catch {}
    if (!v || v.erro) return json({ erro: "CEP não encontrado." }, 400);
    if (v.uf !== "SP")
      return json({ erro: "Para fora de SP, o frete é combinado. Finalize pelo WhatsApp.", whatsapp: true }, 400);
    frete = CATALOGO.cidadesFreteGratis.includes(v.localidade) ? 0 : CATALOGO.freteSP;
    entrega = `Entrega em ${v.localidade}/${v.uf}`;
    endereco = `${v.logradouro}, ${numero} - ${v.bairro}, ${v.localidade}/${v.uf} - CEP ${cep.slice(0, 5)}-${cep.slice(5)}`;
  }

  // ---- valores ----
  const fator = pagamento === "PIX" ? 1 - CATALOGO.descontoPix : 1;
  const mpItens = itens.map((x) => ({
    id: x.id,
    title: `${x.linha.nome} ${x.emb.qtd} kg - ${x.cor}`,
    quantity: x.q,
    unit_price: centavos(x.emb.preco * fator),
    currency_id: "BRL",
  }));
  if (frete > 0) mpItens.push({ id: "frete", title: "Frete", quantity: 1, unit_price: frete, currency_id: "BRL" });
  const total = mpItens.reduce((s, i) => s + i.unit_price * i.quantity, 0);

  const pedido = "TA" + Date.now().toString(36).toUpperCase();
  const site = (process.env.URL || new URL(req.url).origin).replace(/\/$/, "");
  const volta = (r) => `${site}/?retorno=${r}&pedido=${pedido}`;

  const preferencia = {
    items: mpItens,
    payer: { name: nome },
    external_reference: pedido,
    statement_descriptor: "TELHADISTA ABC",
    notification_url: `${site}/api/mercadopago-webhook`,
    back_urls: { success: volta("aprovado"), pending: volta("pendente"), failure: volta("falhou") },
    auto_return: "approved",
    payment_methods: {
      excluded_payment_types: EXCLUIR[pagamento].map((id) => ({ id })),
      installments: pagamento === "Cartão" ? CATALOGO.parcelas : 1,
    },
    metadata: {
      pedido, nome, telefone, entrega, endereco, pagamento,
      itens: itens.map((x) => `${x.q}x ${x.linha.nome} ${x.emb.qtd} kg ${x.cor}`).join("; "),
      total: brl(total),
    },
  };

  const r = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "content-type": "application/json", "X-Idempotency-Key": pedido },
    body: JSON.stringify(preferencia),
  });
  const resp = await r.json().catch(() => ({}));
  if (!r.ok || !resp.init_point) {
    console.error("Mercado Pago recusou a preferência", r.status, resp);
    return json({ erro: "Não foi possível abrir o pagamento agora." }, 502);
  }
  return json({ url: resp.init_point, pedido });
};

export const config = { path: "/api/criar-pagamento" };
