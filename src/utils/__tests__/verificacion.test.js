import { describe, it, expect } from 'vitest';
import {
  MESES_VIGENCIA,
  parsearFechaVerificacion,
  mesesDesde,
  estadoVerificacion,
} from '../verificacion.js';

const HOY = new Date(2026, 6, 18); // 18 de julio de 2026

describe('parsearFechaVerificacion', () => {
  it('acepta YYYY-MM-DD', () => {
    const d = parsearFechaVerificacion('2026-07-18');
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(6);
    expect(d.getDate()).toBe(18);
  });

  it('acepta YYYY-MM (asume día 1)', () => {
    const d = parsearFechaVerificacion('2026-07');
    expect(d.getDate()).toBe(1);
  });

  it('rechaza formatos inválidos y valores no string', () => {
    expect(parsearFechaVerificacion('julio 2026')).toBeNull();
    expect(parsearFechaVerificacion(null)).toBeNull();
    expect(parsearFechaVerificacion(undefined)).toBeNull();
    expect(parsearFechaVerificacion(20260718)).toBeNull();
  });
});

describe('mesesDesde', () => {
  it('calcula meses completos transcurridos', () => {
    expect(mesesDesde('2026-07-01', HOY)).toBe(0);
    expect(mesesDesde('2026-01-15', HOY)).toBe(6);
    expect(mesesDesde('2025-07-18', HOY)).toBe(12);
  });

  it('devuelve null si la fecha no parsea', () => {
    expect(mesesDesde(null, HOY)).toBeNull();
  });

  it('no devuelve negativos para fechas futuras', () => {
    expect(mesesDesde('2026-12-01', HOY)).toBe(0);
  });
});

describe('estadoVerificacion', () => {
  it('vigente si fue verificado dentro de la ventana', () => {
    expect(estadoVerificacion('2026-07-18', HOY)).toEqual({ nivel: 'vigente', meses: 0 });
    expect(estadoVerificacion('2026-02-18', HOY)).toEqual({ nivel: 'vigente', meses: MESES_VIGENCIA });
  });

  it('antigua si pasó la ventana de vigencia (cambio de convocatoria)', () => {
    expect(estadoVerificacion('2026-01-18', HOY)).toEqual({ nivel: 'antigua', meses: 6 });
    expect(estadoVerificacion('2025-03-01', HOY).nivel).toBe('antigua');
  });

  it('sin_verificar si no hay fecha válida', () => {
    expect(estadoVerificacion(null, HOY)).toEqual({ nivel: 'sin_verificar', meses: null });
    expect(estadoVerificacion(undefined, HOY).nivel).toBe('sin_verificar');
  });
});
