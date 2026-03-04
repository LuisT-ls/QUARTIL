import { describe, it, expect } from 'vitest';
import { calcularMedia } from '../media';
import { calcularMediana } from '../mediana';
import { calcularModa } from '../moda';

describe('Medidas de Tendência Central', () => {

    describe('calcularMedia', () => {
        it('deve retornar 0 para array vazio', () => {
            expect(calcularMedia([])).toBe(0);
        });

        it('deve calcular corretamente a média aritmética', () => {
            // (10+20+30+40)/4 = 25
            expect(calcularMedia([10, 20, 30, 40])).toBe(25);
        });

        it('deve lidar com números negativos e flutuantes', () => {
            // (-1 + 2.5 + 4.5)/3 = 2
            expect(calcularMedia([-1, 2.5, 4.5])).toBe(2);
        });
    });

    describe('calcularMediana', () => {
        it('deve retornar 0 para array vazio', () => {
            expect(calcularMediana([])).toBe(0);
        });

        it('deve retornar o termo central para n ímpar', () => {
            const arr = [7, 3, 1, 9, 5]; // order: 1, 3, 5, 7, 9 -> median 5
            expect(calcularMediana(arr)).toBe(5);
        });

        it('deve retornar a média dos dois termos centrais para n par', () => {
            const arr = [10, 20, 40, 30]; // order: 10, 20, 30, 40 -> median (20+30)/2 = 25
            expect(calcularMediana(arr)).toBe(25);
        });
    });

    describe('calcularModa', () => {
        it('deve avisar quando não houver moda (amodal)', () => {
            expect(calcularModa([])).toBe(0);
            expect(calcularModa([1, 2, 3, 4])).toBe("Não há moda");
        });

        it('deve encontrar moda simples (unimodal)', () => {
            expect(calcularModa([1, 2, 2, 3])).toBe(2);
            expect(calcularModa([5, 5, 5, 1, 2])).toBe(5);
        });

        it('deve encontrar múltipla moda (bimodal/multimodal)', () => {
            const bimodal = [1, 1, 2, 3, 3, 4] as number[];
            const res = calcularModa(bimodal);
            expect(Array.isArray(res)).toBe(true);
            if (Array.isArray(res)) {
                expect(res).toContain(1);
                expect(res).toContain(3);
                expect(res.length).toBe(2);
            }
        });
    });

});
