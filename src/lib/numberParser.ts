export interface ParsedNumberInput {
  values: number[];
  invalidTokens: string[];
}

const DECIMAL_COMMA_PATTERN = /^[+-]?\d+,\d+$/;
const NUMBER_PATTERN = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/;

function splitCommaSeparatedToken(token: string, allowDecimalComma: boolean): string[] {
  if (!token) return [];
  if (allowDecimalComma && DECIMAL_COMMA_PATTERN.test(token)) return [token];
  if (!token.includes(",")) return [token];

  return token
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

function tokenize(raw: string): string[] {
  // Comma is the default list separator. Decimal comma is unambiguous when
  // values are separated by semicolon, line break or tab (Excel columns).
  const allowDecimalComma = /[;\n\t]/.test(raw);

  return raw.split(/[;\n\t]+/).flatMap((segment) => {
    const trimmed = segment.trim();
    if (!trimmed) return [];

    return trimmed.split(/\s+/).flatMap((token) => {
      // A comma followed by whitespace is treated as a list separator:
      // "1, 2" becomes [1, 2]. For decimal comma, use "1,5; 2,75".
      const withoutTrailingSeparator = token.replace(/,$/, "");
      return splitCommaSeparatedToken(withoutTrailingSeparator, allowDecimalComma);
    });
  });
}

export function parseNumberInput(raw: string): ParsedNumberInput {
  const values: number[] = [];
  const invalidTokens: string[] = [];

  tokenize(raw).forEach((token) => {
    const normalized = DECIMAL_COMMA_PATTERN.test(token)
      ? token.replace(",", ".")
      : token;

    if (!NUMBER_PATTERN.test(normalized)) {
      invalidTokens.push(token);
      return;
    }

    const value = Number(normalized);
    if (!Number.isFinite(value)) {
      invalidTokens.push(token);
      return;
    }

    values.push(value);
  });

  return { values, invalidTokens };
}
