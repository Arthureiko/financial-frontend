import { metadata } from "../layout";

describe("Layout Metadata", () => {
  it("deve ter o título correto", () => {
    expect(metadata.title).toBe("Finance Wallet - Seu Portal Financeiro");
  });

  it("deve ter a descrição correta", () => {
    expect(metadata.description).toBe(
      "Gerencie suas finanças de forma simples e eficiente. Realize transferências, depósitos e acompanhe seus gastos em um só lugar.",
    );
  });

  it("deve ter as palavras-chave corretas", () => {
    const expectedKeywords = [
      "finanças",
      "portal financeiro",
      "transferência",
      "depósito",
      "controle financeiro",
    ];

    expect(metadata.keywords).toEqual(expectedKeywords);
  });

  it("deve ter o autor correto", () => {
    expect(metadata.authors).toEqual([{ name: "Starbem" }]);
  });

  it("deve ter a configuração de viewport correta", () => {
    expect(metadata.viewport).toBe("width=device-width, initial-scale=1");
  });

  it("deve ter o ícone configurado corretamente", () => {
    expect(metadata.icons).toEqual({
      icon: "/favicon.ico",
    });
  });
});
