import { describe, it, expect } from 'vitest';
import { estadoVigente, hoyISO } from '../estados.js';
import ESTADOS from '../../data/estados.json';
import { UNIVERSIDADES } from '../../data/universidades.js';

const meta = { ultimaActualizacion: '2026-09-29' };

describe('estadoVigente', () => {
  it('sin dato → "sin_dato", nunca "cerradas" por defecto', () => {
    expect(estadoVigente('x', { estados: {}, meta, hoy: '2026-09-29' })).toBe('sin_dato');
    expect(estadoVigente('x', { estados: { x: 'ambas' }, meta, hoy: '2026-09-29' })).toBe('sin_dato');
  });
  it('dato reciente se muestra', () => {
    expect(estadoVigente('x', { estados: { x: 'abiertas' }, meta, hoy: '2026-10-10' })).toBe('abiertas');
  });
  it('dato de más de 30 días pasa a "sin_dato"', () => {
    expect(estadoVigente('x', { estados: { x: 'abiertas' }, meta, hoy: '2026-11-15' })).toBe('sin_dato');
  });
  it('la fecha propia de la universidad manda sobre la general', () => {
    const detalle = { x: { consultado: '2026-08-01' } };
    expect(estadoVigente('x', { estados: { x: 'cerradas' }, detalle, meta, hoy: '2026-09-29' })).toBe('sin_dato');
  });
  it('"abiertas" con cierre oficial vencido → "sin_dato"', () => {
    const detalle = { x: { consultado: '2026-09-28', cierre: '2026-09-15' } };
    expect(estadoVigente('x', { estados: { x: 'abiertas' }, detalle, meta, hoy: '2026-09-29' })).toBe('sin_dato');
  });
  it('hoyISO usa hora de Colombia', () => {
    expect(hoyISO(new Date('2026-09-30T02:00:00Z'))).toBe('2026-09-29');
  });
});

describe('coherencia de datos', () => {
  it('cada estado guardado corresponde a una universidad real', () => {
    const ids = new Set(UNIVERSIDADES.map((u) => u.id));
    for (const id of Object.keys(ESTADOS)) expect(ids.has(id), id).toBe(true);
  });
  it('no hay universidades con id repetido', () => {
    const ids = UNIVERSIDADES.map((u) => u.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
