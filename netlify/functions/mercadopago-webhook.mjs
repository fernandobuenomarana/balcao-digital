// Recebe o aviso do Mercado Pago, confere o pagamento direto na API dele
// e, se estiver aprovado, manda os dados do pedido para o BotConversa.
// Variáveis de ambiente:
//   MP_ACCESS_TOKEN          Access Token de produção do Mercado Pago
//   BOTCONVERSA_WEBHOOK_URL  URL do webhook de entrada criado no BotConversa

const ok = (t = "ok") => new Response(t, { status: 200 });

export default async (req) => {
  const url = new URL(req.url);
  let corpo = {};
  try { corpo = await req.json(); } catch {}
  const tipo = corpo.type || corpo.topic || url.searchParams.get("type") || url.searchParams.get("topic");
  const id = corpo?.data?.id || url.searchParams.get("data.id") || url.searchParams.get("id");
  if (tipo !== "payment" || !id) return ok("ignorado");

  const token = process.env.MP_ACCESS_TOKEN;
  if (!token) return new Response("sem token", { status: 500 });

  // Nunca confiamos no corpo do aviso: buscamos o pagamento na API do Mercado Pago.
  const r = await fetch(`https://api.mercadopago.com/v1/payments/${encodeURIComponent(id)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!r.ok) return ok("pagamento não encontrado");
  const p = await r.json();
  if (p.status !== "approved") return ok(`status ${p.status}`);

  const m = p.metadata || {};
  const dados = {
    evento: "pedido_pago",
    pedido: m.pedido || p.external_reference,
    nome: m.nome || "",
    telefone: m.telefone || "",          // formato 5511999999999
    entrega: m.entrega || "",
    endereco: m.endereco || "",
    itens: m.itens || "",
    pagamento: m.pagamento || "",
    total: (p.transaction_amount ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
    id_pagamento: String(p.id),
  };
  console.log("Pedido pago", dados);

  const hook = process.env.BOTCONVERSA_WEBHOOK_URL;
  if (hook) {
    try {
      const b = await fetch(hook, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(dados),
      });
      if (!b.ok) console.error("BotConversa respondeu", b.status);
    } catch (e) {
      console.error("Falha ao avisar o BotConversa", e);
    }
  }
  return ok();
};

export const config = { path: "/api/mercadopago-webhook" };
