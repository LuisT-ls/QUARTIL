import { expect, test } from "@playwright/test";
import path from "node:path";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("calcula dados de exemplo e renderiza resultados, gráficos e tabelas", async ({ page }) => {
  await page.getByRole("button", { name: "Testar com dados de exemplo" }).click();

  await expect(page).toHaveTitle(/Calculadora de Quartil/);
  await expect(page.locator("#resumo-analise")).toContainText("10.50");
  await expect(page.locator("#resumo-analise")).toContainText("21.50");
  await expect(page.locator("#graficos")).toContainText("Histograma");
  await expect(page.locator("#graficos")).toContainText("Boxplot");
  await expect(page.locator("#tabela-frequencia")).toContainText("100.00%");
});

test("propaga as configurações estatísticas para os resultados", async ({ page }) => {
  await page.getByRole("button", { name: "Testar com dados de exemplo" }).click();
  await page.locator("summary").filter({ hasText: "Configurações estatísticas" }).click();

  const selects = page.locator("#entrada-dados select");
  await selects.nth(0).selectOption("median-halves");
  await selects.nth(1).selectOption("sample");

  await expect(page.locator("#quartis")).toContainText("mediana das metades (Tukey)");
  await expect(page.locator("#quartis")).toContainText("10.00");
  await expect(page.locator("#quartis")).toContainText("22.00");
  await expect(page.locator("#medidas-dispersao")).toContainText("7.95");
  await expect(selects.nth(0)).toHaveValue("median-halves");
  await expect(selects.nth(1)).toHaveValue("sample");
});

test("importa um CSV pelo modal e atualiza a análise", async ({ page }) => {
  await page.getByRole("button", { name: "Importar arquivo" }).click();
  const dialog = page.getByRole("dialog", { name: "Importar dados" });
  await expect(dialog).toBeVisible();

  await dialog.locator('input[type="file"]').setInputFiles(path.join(__dirname, "fixtures/sample.csv"));
  await expect(dialog).toContainText("4 número(s) válido(s)");
  await dialog.getByRole("button", { name: "Carregar na calculadora" }).click();

  await expect(dialog).toBeHidden();
  await expect(page.locator("#resumo-analise")).toContainText("4");
  await expect(page.locator("#entrada-dados")).toContainText("10");
});

test("salva e remove uma análise do histórico local", async ({ page }) => {
  await page.getByRole("button", { name: "Testar com dados de exemplo" }).click();
  await page.getByRole("button", { name: "Salvar análise" }).click();
  await expect(page.getByText("Minha análise", { exact: true })).toBeVisible();

  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Excluir Minha análise" }).click();
  await expect(page.getByText("Ainda não há análises salvas.")).toBeVisible();
});

test("copia o link do relatório e navega para o conteúdo educativo", async ({ page }) => {
  await page.getByRole("button", { name: "Testar com dados de exemplo" }).click();
  await page.getByRole("button", { name: "Compartilhar relatório" }).click();
  await expect(page.getByText("Link do relatório copiado.")).toBeVisible();

  await page.getByRole("link", { name: "Conteúdo educativo" }).first().click();
  await expect(page).toHaveURL(/\/aprender$/);
  await expect(page.getByRole("heading", { name: "Como Calcular Quartis e Estatística" })).toBeVisible();
});
