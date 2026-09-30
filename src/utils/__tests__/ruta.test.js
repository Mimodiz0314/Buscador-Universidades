import { describe, it, expect } from 'vitest';
import { candidatas, sugerirRuta, textoParaCompartir } from '../ruta.js';

const U = [
  { id: 'top', nombre: 'Top', programas: ['Medicina'], tipo: 'pública', tipoAdmision: 'icfes', selectividad: 'muy alta', ranking: 1, departamento: 'Bogotá D.C.' },
  { id: 'media', nombre: 'Media', programas: ['Medicina'], tipo: 'pública', tipoAdmision: 'icfes', selectividad: 'media', ranking: 20, departamento: 'Antioquia' },
  { id: 'cerca', nombre: 'Cerca', programas: ['Medicina'], tipo: 'pública', tipoAdmision: 'icfes', selectividad: 'media', ranking: 37, departamento: 'Córdoba' },
  { id: 'latam', nombre: 'Latam', programas: ['Medicina'], region: 'latam' },
  { id: 'otra', nombre: 'Otra', programas: ['Derecho'], departamento: 'Córdoba' },
];

describe('Mi Ruta', () => {
  it('solo Colombia y la carrera exacta', () => {
    expect(candidatas('medicina', U).map((x) => x.uni.id)).toEqual(['top', 'media', 'cerca']);
  });
  it('con puntaje alto: segura cercana, sueño la mejor rankeada, sin repetir', () => {
    const r = sugerirRuta('Medicina', 410, U);
    expect(r.segura).toBe('cerca');
    expect(new Set(Object.values(r)).size).toBe(3);
  });
  it('con puntaje bajo, la más selectiva queda como sueño', () => {
    expect(sugerirRuta('Medicina', 300, U).sueno).toBe('top');
  });
  it('sin puntaje igual propone tres distintas', () => {
    const r = sugerirRuta('Medicina', '', U);
    expect(r.sueno).toBe('top');
    expect(new Set(Object.values(r)).size).toBe(3);
  });
  it('texto para compartir omite lo vacío', () => {
    const t = textoParaCompartir({ carrera: 'Medicina', nombres: { segura: 'Cerca' }, url: 'u' });
    expect(t).toContain('✅ Segura: Cerca');
    expect(t).not.toContain('Sueño');
  });
});
