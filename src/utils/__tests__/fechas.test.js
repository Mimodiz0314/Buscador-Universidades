import { describe, it, expect } from 'vitest';
import { analizarFechas } from '../fechas.js';
import { PROCESOS_DETALLADOS } from '../../data/procesos.js';

const F = [
  { evento: 'Inscripciones', fecha: '2026-08-14', hasta: '2026-09-14' },
  { evento: 'Examen', fecha: '2026-10-26', hasta: '2026-10-27' },
  { evento: 'Resultados', fecha: '2026-11-11' },
];

describe('analizarFechas', () => {
  it('tacha lo pasado y resalta la próxima con días que faltan', () => {
    const r = analizarFechas(F, '2026-09-29');
    expect(r.items[0].pasada).toBe(true);
    expect(r.proxima.evento).toBe('Examen');
    expect(r.proxima.diasFaltan).toBe(27);
    expect(r.terminada).toBe(false);
  });
  it('un rango en curso no está pasado', () => {
    const r = analizarFechas(F, '2026-09-01');
    expect(r.items[0]).toMatchObject({ pasada: false, enCurso: true, esProxima: true });
  });
  it('si todo pasó, la convocatoria está terminada', () => {
    expect(analizarFechas(F, '2026-12-01').terminada).toBe(true);
    expect(analizarFechas([], '2026-12-01').terminada).toBe(false);
  });
  it('las fechas de procesos.js tienen formato válido', () => {
    for (const [id, p] of Object.entries(PROCESOS_DETALLADOS)) {
      for (const f of p.fechasClave || []) {
        expect(/^\d{4}-\d{2}-\d{2}$/.test(f.fecha), id).toBe(true);
        if (f.hasta) expect(f.hasta >= f.fecha, id).toBe(true);
        expect(f.evento, id).toBeTruthy();
      }
    }
  });
});
