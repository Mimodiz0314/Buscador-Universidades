import fs from 'fs';
import path from 'path';
import { UNIVERSIDADES } from '../src/data/universidades.js';
import { LATAM } from '../src/data/latam.js';

const allUnis = [...UNIVERSIDADES, ...LATAM];

const initialEstados = {};
allUnis.forEach((u) => {
  if (u.id === 'unad') {
    initialEstados[u.id] = 'abiertas';
  } else if (u.id === 'unal' || u.id === 'udea') {
    initialEstados[u.id] = 'proximamente';
  } else {
    initialEstados[u.id] = 'cerradas';
  }
});

fs.writeFileSync(
  path.resolve('src/data/estados.json'),
  JSON.stringify(initialEstados, null, 2),
  'utf-8'
);

console.log('✅ Creado src/data/estados.json con', Object.keys(initialEstados).length, 'universidades.');
