import { calcularMediana } from "./mediana";

export interface PassoQuartil {
  titulo: string;
  formula: string;
  substituicao: string;
  resultado: string;
  explicacao?: string;
  /** LaTeX para renderização "como no papel" (frações, subscritos) */
  formulaLatex?: string;
  substituicaoLatex?: string;
}

export function obterPassosQuartis(array: number[]): {
  q1: PassoQuartil;
  q2: PassoQuartil;
  q3: PassoQuartil;
  iqr: PassoQuartil;
} | null {
  if (!array?.length) return null;
  const ordenado = [...array].sort((a, b) => a - b);
  const n = ordenado.length;

  const q1Result = passoQ1(ordenado, n);
  const q2Result = passoQ2(ordenado, n);
  const q3Result = passoQ3(ordenado, n);
  const iqrResult = passoIQR(
    parseFloat(q1Result.resultado),
    parseFloat(q3Result.resultado)
  );

  return { q1: q1Result, q2: q2Result, q3: q3Result, iqr: iqrResult };
}

function passoIQR(q1: number, q3: number): PassoQuartil {
  const iqr = q3 - q1;
  return {
    titulo: "Passo 4: Calcular Amplitude Interquartil (IQR)",
    formula: "IQR = Q₃ − Q₁",
    substituicao: `IQR = ${q3.toFixed(2)} − ${q1.toFixed(2)}`,
    resultado: iqr.toFixed(2),
    explicacao: "O IQR mede a dispersão dos 50% centrais dos dados. É usado na detecção de outliers.",
    formulaLatex: "IQR = Q_3 - Q_1",
    substituicaoLatex: `IQR = ${q3.toFixed(2)} - ${q1.toFixed(2)}`,
  };
}

function passoQ1(ordenado: number[], n: number): PassoQuartil {
  const percentil = 0.25;
  const posicao = percentil * (n - 1);
  const base = Math.floor(posicao);
  const resto = posicao - base;
  const valor = ordenado[base]! + resto * ((ordenado[base + 1] ?? ordenado[base]!) - ordenado[base]!);
  const idx = base + 1;
  const idx1 = base + 2;

  if (ordenado[base + 1] === undefined) {
    return {
      titulo: "Passo 1: Calcular Q1 (25º percentil)",
      formula: `Q₁ = x_${idx} (valor na posição ${idx})`,
      substituicao: `Q₁ = ${ordenado[base]}`,
      resultado: valor.toFixed(2),
      explicacao: `Posição = 0,25 × (n − 1) = ${posicao.toFixed(2)}. Último elemento.`,
      formulaLatex: `Q_1 = x_{${idx}} \\quad \\text{(valor na posição } ${idx}\\text{)}`,
      substituicaoLatex: `Q_1 = ${ordenado[base]}`,
    };
  }
  if (resto === 0) {
    return {
      titulo: "Passo 1: Calcular Q1 (25º percentil)",
      formula: `Q₁ = x_${idx} (valor na posição ${idx})`,
      substituicao: `Q₁ = ${ordenado[base]}`,
      resultado: valor.toFixed(2),
      explicacao: `Posição = 0,25 × (n − 1) = ${posicao.toFixed(2)}. Posição inteira.`,
      formulaLatex: `Q_1 = x_{${idx}}`,
      substituicaoLatex: `Q_1 = ${ordenado[base]}`,
    };
  }

  const v0 = ordenado[base]!;
  const v1 = ordenado[base + 1]!;
  const restoStr = resto % 1 === 0 ? resto.toString() : resto.toFixed(2);
  const interp = resto > 0 ? ` + ${restoStr} \\times (${v1} - ${v0})` : "";
  return {
    titulo: "Passo 1: Calcular Q1 (25º percentil)",
    formula: `Q₁ = x_${idx} + fração × (x_${idx1} − x_${idx})`,
    substituicao: `Q₁ = ${v0}${resto > 0 ? ` + ${resto.toFixed(2)} × (${v1} − ${v0})` : ""}`,
    resultado: valor.toFixed(2),
    explicacao: `Posição = 0,25 × (n − 1) = ${posicao.toFixed(2)}. Interpolação entre posições ${idx} e ${idx1}.`,
    formulaLatex: `Q_1 = x_{${idx}} + p \\times (x_{${idx1}} - x_{${idx}})`,
    substituicaoLatex: `Q_1 = ${v0}${interp}`,
  };
}

function passoQ2(ordenado: number[], n: number): PassoQuartil {
  const meio = Math.floor(n / 2);

  if (n % 2 === 0) {
    const i1 = meio - 1;
    const i2 = meio;
    const v1 = ordenado[i1]!;
    const v2 = ordenado[i2]!;
    const mediana = (v1 + v2) / 2;
    return {
      titulo: "Passo 2: Calcular Q2 (Mediana - 50º percentil)",
      formula: `Q₂ = (x_${i1 + 1} + x_${i2 + 1}) / 2`,
      substituicao: `(${v1} + ${v2}) / 2`,
      resultado: mediana.toFixed(2),
      explicacao: `n = ${n} (par). Mediana = média dos valores centrais nas posições ${i1 + 1} e ${i2 + 1}.`,
      formulaLatex: `Q_2 = \\frac{x_{${i1 + 1}} + x_{${i2 + 1}}}{2}`,
      substituicaoLatex: `\\frac{${v1} + ${v2}}{2}`,
    };
  }

  const v = ordenado[meio]!;
  return {
    titulo: "Passo 2: Calcular Q2 (Mediana - 50º percentil)",
    formula: `Q₂ = x_${meio + 1} (valor central)`,
    substituicao: `Q₂ = ${v}`,
    resultado: v.toFixed(2),
    explicacao: `n = ${n} (ímpar). Mediana = valor na posição central ${meio + 1}.`,
    formulaLatex: `Q_2 = x_{${meio + 1}} \\quad \\text{(valor central)}`,
    substituicaoLatex: `Q_2 = ${v}`,
  };
}

function passoQ3(ordenado: number[], n: number): PassoQuartil {
  const percentil = 0.75;
  const posicao = percentil * (n - 1);
  const base = Math.floor(posicao);
  const resto = posicao - base;
  const valor = ordenado[base]! + resto * ((ordenado[base + 1] ?? ordenado[base]!) - ordenado[base]!);
  const idx = base + 1;
  const idx1 = base + 2;

  if (ordenado[base + 1] === undefined) {
    return {
      titulo: "Passo 3: Calcular Q3 (75º percentil)",
      formula: `Q₃ = x_${idx} (valor na posição ${idx})`,
      substituicao: `Q₃ = ${ordenado[base]}`,
      resultado: valor.toFixed(2),
      explicacao: `Posição = 0,75 × (n − 1) = ${posicao.toFixed(2)}. Valor na posição ${idx}.`,
      formulaLatex: `Q_3 = x_{${idx}}`,
      substituicaoLatex: `Q_3 = ${ordenado[base]}`,
    };
  }

  const v0 = ordenado[base]!;
  const v1 = ordenado[base + 1]!;
  const restoStr = resto % 1 === 0 ? resto.toString() : resto.toFixed(2);
  const interp = resto > 0 ? ` + ${restoStr} \\times (${v1} - ${v0})` : "";
  return {
    titulo: "Passo 3: Calcular Q3 (75º percentil)",
    formula: `Q₃ = x_${idx} + fração × (x_${idx1} − x_${idx})`,
    substituicao: `Q₃ = ${v0}${resto > 0 ? ` + ${resto.toFixed(2)} × (${v1} − ${v0})` : ""}`,
    resultado: valor.toFixed(2),
    explicacao: `Posição = 0,75 × (n − 1) = ${posicao.toFixed(2)}. Interpolação entre posições ${idx} e ${idx1}.`,
    formulaLatex: `Q_3 = x_{${idx}} + p \\times (x_{${idx1}} - x_{${idx}})`,
    substituicaoLatex: `Q_3 = ${v0}${interp}`,
  };
}

export function calcularQuartil(array: number[], percentil: number): number {
  if (!array?.length) return 0;
  const ordenado = [...array].sort((a, b) => a - b);
  const posicao = percentil * (ordenado.length - 1);
  const base = Math.floor(posicao);
  const resto = posicao - base;

  if (ordenado[base + 1] !== undefined) {
    return ordenado[base]! + resto * (ordenado[base + 1]! - ordenado[base]!);
  }
  return ordenado[base] ?? 0;
}

export interface OutliersResult {
  inferior: number[];
  superior: number[];
  limiteInferior: number;
  limiteSuperior: number;
}

export function calcularOutliers(array: number[]): OutliersResult {
  if (!array?.length) {
    return { inferior: [], superior: [], limiteInferior: 0, limiteSuperior: 0 };
  }
  const q1 = calcularQuartil(array, 0.25);
  const q3 = calcularQuartil(array, 0.75);
  const iqr = q3 - q1;
  const limiteInferior = q1 - 1.5 * iqr;
  const limiteSuperior = q3 + 1.5 * iqr;

  return {
    inferior: array.filter((v) => v < limiteInferior),
    superior: array.filter((v) => v > limiteSuperior),
    limiteInferior,
    limiteSuperior,
  };
}
