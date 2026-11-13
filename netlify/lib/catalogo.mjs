// Catálogo usado pelo servidor para calcular o valor cobrado.
// O servidor NÃO confia no preço que vem do navegador: o valor sai daqui.
// Mantenha estes preços iguais aos do bloco CONFIG em loja/index.html.

export const CATALOGO = {
  descontoPix: 0.05,          // 5% no PIX
  parcelas: 3,                // máximo de parcelas no cartão
  freteSP: 39.90,             // demais cidades do estado de SP
  cidadesFreteGratis: [
    "Santo André", "São Bernardo do Campo", "São Caetano do Sul", "Diadema",
    "Mauá", "Ribeirão Pires", "Rio Grande da Serra",
  ],
  cores: { terracota: "Terracota", cinza: "Cinza", branco: "Branco" },
  linhas: {
    tradicional: {
      nome: "Super Borracha Líquida",
      vendaOnline: true,
      embalagens: { t20: { rotulo: "Balde", qtd: 20, preco: 389.90 } },
    },
    premium: {
      nome: "Super Borracha Líquida Premium",
      vendaOnline: false,     // pré-venda: troque para true quando o balde novo chegar
      embalagens: { p20: { rotulo: "Balde", qtd: 20, preco: 489.90 } },
    },
  },
};
