import { describe, expect, it } from "vitest";
import { parseNumberInput } from "../numberParser";

describe("parseNumberInput", () => {
  it("interpreta vírgulas como separadores de valores", () => {
    expect(parseNumberInput("10, 20, 30")).toEqual({
      values: [10, 20, 30],
      invalidTokens: [],
    });
  });

  it("aceita decimais brasileiros quando separados por ponto e vírgula", () => {
    expect(parseNumberInput("1,5; 2,75")).toEqual({
      values: [1.5, 2.75],
      invalidTokens: [],
    });
  });

  it("aceita dados em linhas ou colunas coladas do Excel", () => {
    expect(parseNumberInput("1,5\n2,75\n3,25")).toEqual({
      values: [1.5, 2.75, 3.25],
      invalidTokens: [],
    });
  });

  it("retorna tokens inválidos sem descartar o restante", () => {
    expect(parseNumberInput("10, abc, 20")).toEqual({
      values: [10, 20],
      invalidTokens: ["abc"],
    });
  });
});
