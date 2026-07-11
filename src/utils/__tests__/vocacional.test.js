import { describe, it, expect } from 'vitest';
import {
  PREGUNTAS,
  puntuarAreas,
  areaDeCarrera,
  recomendarCarreras,
} from '../vocacional.js';

describe('areaDeCarrera', () => {
  it('clasifica carreras en el área correcta', () => {
    expect(areaDeCarrera('Medicina')).toBe('salud');
    expect(areaDeCarrera('Medicina Veterinaria y Zootecnia')).toBe('agro');
    expect(areaDeCarrera('Ingeniería de Sistemas')).toBe('ingenieria');
    expect(areaDeCarrera('Derecho')).toBe('derecho');
    expect(areaDeCarrera('Música')).toBe('arte');
    expect(areaDeCarrera('Licenciatura en Matemáticas')).toBe('educacion');
    expect(areaDeCarrera('Administración de Empresas')).toBe('economica');
    expect(areaDeCarrera('Biología')).toBe('ciencias');
  });
});

describe('puntuarAreas', () => {
  it('el área más votada queda primera con mayor porcentaje', () => {
    // Respondo "Me encanta" (3) solo a las dos preguntas de salud, 0 al resto.
    const respuestas = PREGUNTAS.map((p) => (p.area === 'salud' ? 3 : 0));
    const areas = puntuarAreas(respuestas);
    expect(areas[0].id).toBe('salud');
    expect(areas[0].porcentaje).toBe(100);
  });

  it('devuelve un porcentaje 0..100 para cada área', () => {
    const areas = puntuarAreas(PREGUNTAS.map(() => 1));
    for (const a of areas) {
      expect(a.porcentaje).toBeGreaterThanOrEqual(0);
      expect(a.porcentaje).toBeLessThanOrEqual(100);
    }
  });
});

describe('recomendarCarreras', () => {
  it('recomienda carreras reales del área pedida, ordenadas por disponibilidad', () => {
    const recs = recomendarCarreras(['salud'], 5);
    expect(recs.length).toBeGreaterThan(0);
    expect(recs.length).toBeLessThanOrEqual(5);
    // Vienen ordenadas de mayor a menor número de universidades.
    for (let i = 1; i < recs.length; i++) {
      expect(recs[i - 1].universidades).toBeGreaterThanOrEqual(recs[i].universidades);
    }
    // Y todas deben ser del área de salud.
    expect(recs.every((r) => r.area === 'salud')).toBe(true);
  });
});
