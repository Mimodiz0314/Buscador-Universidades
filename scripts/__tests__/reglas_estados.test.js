import { describe, it, expect } from 'vitest';
import { decidirEstado, esFuenteOficial, listaUnica, hoyColombia, fechaEnTexto, validarRespuesta } from '../reglas_estados.js';
import { UNIVERSIDADES } from '../../src/data/universidades.js';
import { LATAM } from '../../src/data/latam.js';

const uni = { id: 'unal', web: 'https://unal.edu.co', admisiones: 'https://admisiones.unal.edu.co' };
const HOY = '2026-09-29';
const resp = (estado, extra = {}) => ({ estado, fuente: 'https://admisiones.unal.edu.co/pregrado/', evidencia: 'x', ...extra });

describe('fuente oficial', () => {
  it('acepta el dominio oficial y sus subdominios', () => {
    expect(esFuenteOficial('https://unal.edu.co/x', uni)).toBe(true);
    expect(esFuenteOficial('https://www.admisiones.unal.edu.co/y', uni)).toBe(true);
  });
  it('rechaza noticias, dominios parecidos y basura', () => {
    expect(esFuenteOficial('https://eltiempo.com/unal', uni)).toBe(false);
    expect(esFuenteOficial('https://falsounal.edu.co', uni)).toBe(false);
    expect(esFuenteOficial('no es url', uni)).toBe(false);
    expect(esFuenteOficial(undefined, uni)).toBe(false);
  });
});

describe('decidirEstado', () => {
  it('sin prueba y sin historial confirmado → sin_dato (no inventa "cerradas")', () => {
    const r = decidirEstado({ uni, previoEstado: 'abiertas', previoDetalle: undefined, resp: undefined, hoy: HOY });
    expect(r.estado).toBe('sin_dato');
  });
  it('fuente no oficial → no se acepta', () => {
    const r = decidirEstado({ uni, previoEstado: 'cerradas', resp: resp('abiertas', { fuente: 'https://blog.com/unal' }), hoy: HOY });
    expect(r.estado).toBe('sin_dato');
    expect(r.detalle.motivo).toBe('fuente no oficial');
  });
  it('primera respuesta con fuente oficial se acepta de inmediato', () => {
    const r = decidirEstado({ uni, previoEstado: 'cerradas', resp: resp('abiertas'), hoy: HOY });
    expect(r.estado).toBe('abiertas');
    expect(r.detalle).toMatchObject({ confirmado: true, consultado: HOY });
  });
  it('un cambio necesita dos confirmaciones seguidas', () => {
    const previo = { confirmado: true, estado: 'cerradas', consultado: '2026-09-22' };
    const s1 = decidirEstado({ uni, previoEstado: 'cerradas', previoDetalle: previo, resp: resp('abiertas'), hoy: HOY });
    expect(s1.estado).toBe('cerradas');
    expect(s1.cambio).toBe('pendiente');
    const s2 = decidirEstado({ uni, previoEstado: 'cerradas', previoDetalle: s1.detalle, resp: resp('abiertas'), hoy: '2026-10-06' });
    expect(s2.estado).toBe('abiertas');
  });
  it('si la segunda semana no repite, el cambio pendiente se descarta', () => {
    const previo = { confirmado: true, estado: 'cerradas', pendiente: { estado: 'abiertas' } };
    const r = decidirEstado({ uni, previoEstado: 'cerradas', previoDetalle: previo, resp: resp('proximamente'), hoy: HOY });
    expect(r.estado).toBe('cerradas');
    expect(r.detalle.pendiente.estado).toBe('proximamente');
  });
  it('si falla la consulta, conserva lo último confirmado con su fecha vieja', () => {
    const previo = { confirmado: true, estado: 'abiertas', consultado: '2026-09-01' };
    const r = decidirEstado({ uni, previoEstado: 'abiertas', previoDetalle: previo, resp: undefined, hoy: HOY });
    expect(r.estado).toBe('abiertas');
    expect(r.detalle.consultado).toBe('2026-09-01');
  });
  it('"abiertas" con fecha de cierre ya pasada se rechaza', () => {
    expect(validarRespuesta(resp('abiertas', { cierre: '2026-09-01' }), uni, HOY).ok).toBe(false);
  });
});

describe('utilidades', () => {
  it('lista sin repetidas: 71 universidades, no 87', () => {
    const l = listaUnica(UNIVERSIDADES, LATAM);
    expect(new Set(l.map((u) => u.id)).size).toBe(l.length);
    expect(l.length).toBe(UNIVERSIDADES.length);
  });
  it('fecha en hora de Colombia', () => {
    // 30 sep 02:00 UTC = 29 sep 21:00 en Colombia
    expect(hoyColombia(new Date('2026-09-30T02:00:00Z'))).toBe('2026-09-29');
    expect(fechaEnTexto('2026-09-29')).toBe('29 de septiembre de 2026');
  });
  it('cada universidad tiene web o portal oficial con https', () => {
    for (const u of listaUnica(UNIVERSIDADES, LATAM)) {
      expect(/^https:\/\//.test(u.web || u.admisiones), u.id).toBe(true);
    }
  });
});
