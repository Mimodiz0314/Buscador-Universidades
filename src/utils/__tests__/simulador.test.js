import { describe, it, expect } from 'vitest';
import { estimarAdmision, nivelDemanda, recomendaciones } from '../simulador.js';
import { UNIVERSIDADES } from '../../data/universidades.js';

const uniIcfes = { sigla: 'X', tipo: 'pública', tipoAdmision: 'icfes', selectividad: 'media' };
const uniIcfesAlta = { sigla: 'X', tipo: 'pública', tipoAdmision: 'icfes', selectividad: 'alta' };

describe('nivelDemanda', () => {
  it('Medicina es demanda muy alta, pero Medicina Veterinaria no', () => {
    expect(nivelDemanda('Medicina')).toBe('muy alta');
    expect(nivelDemanda('Medicina Veterinaria y Zootecnia')).toBe('alta');
  });

  it('Derecho e ingenierías demandadas son demanda alta', () => {
    expect(nivelDemanda('Derecho')).toBe('alta');
    expect(nivelDemanda('Ingeniería de Sistemas')).toBe('alta');
  });

  it('programas sin marca conocida son demanda media', () => {
    expect(nivelDemanda('Filosofía')).toBe('media');
  });
});

describe('estimarAdmision', () => {
  it('admisión abierta siempre da nivel abierta', () => {
    const est = estimarAdmision(100, 'Psicología', {
      sigla: 'UNAD', tipo: 'pública', tipoAdmision: 'abierta', selectividad: 'abierta',
    });
    expect(est.nivel).toBe('abierta');
  });

  it('examen propio no evalúa el puntaje ICFES', () => {
    const est = estimarAdmision(450, 'Medicina', {
      sigla: 'UNAL', tipo: 'pública', tipoAdmision: 'propio', selectividad: 'muy alta',
    });
    expect(est.nivel).toBe('propio');
  });

  it('las privadas dan nivel privada (depende de entrevista y financiación)', () => {
    const est = estimarAdmision(300, 'Derecho', {
      sigla: 'Uniandes', tipo: 'privada', tipoAdmision: 'icfes', selectividad: 'muy alta',
    });
    expect(est.nivel).toBe('privada');
  });

  it('umbral verde/amarillo/rojo para Medicina en pública con ICFES', () => {
    expect(estimarAdmision(420, 'Medicina', uniIcfes).nivel).toBe('verde');
    expect(estimarAdmision(370, 'Medicina', uniIcfes).nivel).toBe('amarillo');
    expect(estimarAdmision(300, 'Medicina', uniIcfes).nivel).toBe('rojo');
  });

  it('la selectividad de la universidad sube el corte', () => {
    // 405 pasa en selectividad media (corte 400) pero queda en amarillo en alta (410).
    expect(estimarAdmision(405, 'Medicina', uniIcfes).nivel).toBe('verde');
    expect(estimarAdmision(405, 'Medicina', uniIcfesAlta).nivel).toBe('amarillo');
  });
});

describe('recomendaciones', () => {
  it('con puntaje bajo sugiere repetir el Saber 11', () => {
    const recs = recomendaciones(250, []);
    expect(recs.join(' ')).toMatch(/volver a presentar el Saber 11/i);
  });

  it('con examen propio en resultados menciona la vía UNAL/UdeA', () => {
    const recs = recomendaciones(320, [{ est: { nivel: 'propio' } }]);
    expect(recs.join(' ')).toMatch(/examen propio/i);
  });
});

describe('base de datos', () => {
  it('todas las universidades tienen tipo pública o privada', () => {
    for (const u of UNIVERSIDADES) {
      expect(['pública', 'privada']).toContain(u.tipo);
    }
  });

  it('todas tienen links https y campos mínimos', () => {
    for (const u of UNIVERSIDADES) {
      expect(u.web).toMatch(/^https:\/\//);
      expect(u.admisiones).toMatch(/^https:\/\//);
      expect(u.programas.length).toBeGreaterThan(0);
      expect(u.pasos.length).toBeGreaterThan(3);
      expect(u.fechas.texto).toBeTruthy();
      expect(u.costoInscripcion.nota).toBeTruthy();
    }
  });

  it('no hay ids duplicados', () => {
    const ids = UNIVERSIDADES.map((u) => u.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('los rankings nacionales de Colombia (los que existen) no se repiten', () => {
    const conRanking = UNIVERSIDADES.filter((u) => u.region === 'colombia' && u.ranking != null);
    expect(conRanking.every((u) => Number.isInteger(u.ranking) && u.ranking >= 1)).toBe(true);
    const rankings = conRanking.map((u) => u.ranking);
    expect(new Set(rankings).size).toBe(rankings.length);
  });

  it('hay universidades de Latinoamérica marcadas con su país', () => {
    const latam = UNIVERSIDADES.filter((u) => u.region === 'latam');
    expect(latam.length).toBeGreaterThan(0);
    expect(latam.every((u) => u.pais && u.pais !== 'Colombia')).toBe(true);
    expect(latam.every((u) => /^https:\/\//.test(u.web))).toBe(true);
  });
});
