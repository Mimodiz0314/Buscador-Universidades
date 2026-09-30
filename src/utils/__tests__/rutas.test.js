import { describe, it, expect } from 'vitest';
import { leerRuta, escribirRuta } from '../rutas.js';

describe('rutas', () => {
  it('lee las direcciones', () => {
    expect(leerRuta('')).toEqual({ pestana: 'buscar', uniId: null, procesoUni: null });
    expect(leerRuta('#/u/unicordoba')).toMatchObject({ uniId: 'unicordoba' });
    expect(leerRuta('#/proceso/unal')).toMatchObject({ pestana: 'proceso', procesoUni: 'unal' });
    expect(leerRuta('#/simulador')).toMatchObject({ pestana: 'simulador' });
    expect(leerRuta('#/cualquier-cosa')).toMatchObject({ pestana: 'buscar' });
  });
  it('ida y vuelta', () => {
    for (const r of [{ pestana: 'buscar', uniId: 'udea', procesoUni: null }, { pestana: 'proceso', uniId: null, procesoUni: 'unal' }, { pestana: 'ruta', uniId: null, procesoUni: null }]) {
      expect(leerRuta(escribirRuta(r))).toEqual(r);
    }
  });
});
