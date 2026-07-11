import { describe, it, expect } from 'vitest';
import { normalizar, coincide } from '../texto.js';

describe('normalizar', () => {
  it('quita tildes y pasa a minúsculas', () => {
    expect(normalizar('Ingeniería Química')).toBe('ingenieria quimica');
    expect(normalizar('MEDICINA')).toBe('medicina');
  });

  it('tolera valores vacíos', () => {
    expect(normalizar('')).toBe('');
    expect(normalizar(null)).toBe('');
  });
});

describe('coincidencia exacta (regla del buscador)', () => {
  it('«Medicina» NO es igual a «Medicina Veterinaria»', () => {
    expect(normalizar('Medicina') === normalizar('Medicina Veterinaria')).toBe(false);
  });

  it('la igualdad ignora tildes y mayúsculas', () => {
    expect(normalizar('medicina') === normalizar('Medicina')).toBe(true);
    expect(normalizar('Ingenieria quimica') === normalizar('Ingeniería Química')).toBe(true);
  });
});

describe('coincide (subcadena, usado como utilidad general)', () => {
  it('encuentra subcadenas sin importar tildes', () => {
    expect(coincide('Ingeniería de Sistemas y Computación', 'sistemas')).toBe(true);
    expect(coincide('Derecho', 'medicina')).toBe(false);
  });
});
