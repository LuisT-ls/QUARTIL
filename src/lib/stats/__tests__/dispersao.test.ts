import { describe, it, expect } from 'vitest';
import {
    calcularVariancia,
    calcularDesvioPadrao,
    calcularCV,
    calcularAssimetria,
    calcularCurtose
} from '../dispersao';

describe('Medidas de Dispersão', () => {

    const data = [1, 2, 3, 4, 5];
    // media = 3
    // variancia (populacional) = ((1-3)² + (2-3)² + (3-3)² + (4-3)² + (5-3)²) / 5 = (4+1+0+1+4)/5 = 10/5 = 2
    // DP = sqrt(2) = 1.41421356

    describe('calcularVariancia', () => {
        it('deve retornar a variância populacional correta', () => {
            expect(calcularVariancia(data)).toBeCloseTo(2);
        });
    });

    describe('calcularDesvioPadrao', () => {
        it('deve retornar o desvio padrão populacional correto', () => {
            const dp = Math.sqrt(2);
            expect(calcularDesvioPadrao(data)).toBeCloseTo(dp);
        });
    });

    describe('calcularCV', () => {
        it('deve calcular o coeficiente de variação corretamente', () => {
            const cv = (Math.sqrt(2) / 3) * 100;
            expect(calcularCV(data)).toBeCloseTo(cv);
        });
    });

    describe('calcularAssimetria', () => {
        it('deve retornar 0 para dados simétricos', () => {
            const simetric = [10, 20, 30, 40, 50]; // asssimetria = 0
            expect(calcularAssimetria(simetric)).toBeCloseTo(0);
        });

        it('deve tratar amostra pequena n<=2', () => {
            expect(calcularAssimetria([1])).toBe(0);
            expect(calcularAssimetria([1, 2])).toBe(0);
        });

        it('deve calcular corretamente para dados deslocados a direita', () => {
            const direita = [1, 2, 2, 2, 8];
            expect(calcularAssimetria(direita)).toBeGreaterThan(0);
        });
    });

    describe('calcularCurtose', () => {
        it('deve tratar amostra pequena n<=3', () => {
            expect(calcularCurtose([1, 2, 3])).toBe(0);
        });

        it('deve calcular a curtose amostral (coeficiente de excesso)', () => {
            // Para a série [1, 2, 3, 4, 5], a curtose é platicúrtica (negativa)
            const c = calcularCurtose([1, 2, 3, 4, 5]);
            expect(c).toBeLessThan(0);
            expect(c).toBeCloseTo(-1.2);
        });
    });
});
