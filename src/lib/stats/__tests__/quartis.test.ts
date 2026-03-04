import { describe, it, expect } from 'vitest';
import { calcularQuartil, calcularOutliers, obterPassosQuartis } from '../quartis';

describe('Quartis e Outliers', () => {

    const dataPares = [12, 15, 18, 20, 22, 25, 28, 30]; // 8 elementos
    const dataImpares = [5, 10, 15, 20, 25, 30, 35, 40, 45]; // 9 elementos
    // Posição Q1 impares = 0.25*(8) = 2 (índice 2) = 15

    describe('calcularQuartil', () => {

        it('deve retornar 0 para array vazio', () => {
            expect(calcularQuartil([], 0.25)).toBe(0);
        });

        it('deve calcular corretamente Q1, Q2, Q3 para amostra de tamanho par', () => {
            // Método clássico de percentil
            // pos Q1 = 0.25 * 7 = 1.75 => idx=1 (15) e idx=2 (18) => 15 + 0.75*(3)= 17.25
            const q1 = calcularQuartil(dataPares, 0.25);
            expect(q1).toBeCloseTo(17.25);

            // pos Q2 = 0.5 * 7 = 3.5 => (20 + 22) / 2 = 21
            const q2 = calcularQuartil(dataPares, 0.5);
            expect(q2).toBeCloseTo(21);

            // pos Q3 = 0.75 * 7 = 5.25 => 25 + 0.25*(3) = 25.75
            const q3 = calcularQuartil(dataPares, 0.75);
            expect(q3).toBeCloseTo(25.75);
        });

        it('deve calcular corretamente Q1, Q2, Q3 para amostra de tamanho ímpar', () => {
            const q1 = calcularQuartil(dataImpares, 0.25);
            expect(q1).toBe(15);
            const q2 = calcularQuartil(dataImpares, 0.5);
            expect(q2).toBe(25);
            const q3 = calcularQuartil(dataImpares, 0.75);
            expect(q3).toBe(35);
        });
    });

    describe('calcularOutliers', () => {
        it('deve detectar outliers inferiores e superiores via IQR', () => {
            // 100 é um outlier superior
            // -10 é outlier inferior
            const sample = [-100, 12, 13, 13, 14, 15, 15, 16, 200];
            const outliers = calcularOutliers(sample);
            expect(outliers.inferior).toContain(-100);
            expect(outliers.superior).toContain(200);

            // q1 ≈ 13
            // q3 ≈ 15
            // iqr = 2, LI = 13 - 1.5*2 = 10. LS = 15 + 3 = 18
            expect(outliers.inferior.length).toBe(1);
            expect(outliers.superior.length).toBe(1);
        });
    });

    describe('obterPassosQuartis', () => {
        it('deve retornar null para arrays vazios', () => {
            expect(obterPassosQuartis([])).toBeNull();
        });
        it('deve retornar a sequência estruturada com IQR', () => {
            const steps = obterPassosQuartis([10, 20, 30]);
            expect(steps?.q1.resultado).toBeDefined();
            expect(steps?.q2.resultado).toBeDefined();
            expect(steps?.q3.resultado).toBeDefined();
            expect(steps?.iqr.resultado).toBeDefined();
        });
    });

});
