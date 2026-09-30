import fs from 'fs';
import path from 'path';
import { UNIVERSIDADES } from '../src/data/universidades.js';
import { LATAM } from '../src/data/latam.js';
import { listaUnica } from './reglas_estados.js';

// Reinicia los estados: todas quedan "sin_dato" hasta que el robot de IA
// encuentre una fuente oficial (nunca se inventa "abiertas" o "cerradas").
const allUnis = listaUnica(UNIVERSIDADES, LATAM);
const initialEstados = Object.fromEntries(allUnis.map((u) => [u.id, 'sin_dato']));

fs.writeFileSync(path.resolve('src/data/estados.json'), JSON.stringify(initialEstados, null, 2) + '\n', 'utf-8');
fs.writeFileSync(path.resolve('src/data/estados_detalle.json'), '{}\n', 'utf-8');

console.log('✅ Reiniciados', allUnis.length, 'estados como "sin_dato".');
