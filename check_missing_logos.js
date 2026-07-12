import fs from 'fs';
import path from 'path';

const dataFile = fs.readFileSync(path.join(process.cwd(), 'src/data/universidades.js'), 'utf8');

const regex = /id:\s*'([^']+)',\s*nombre:\s*'([^']+)'/g;
const universities = [];
let match;
while ((match = regex.exec(dataFile)) !== null) {
  universities.push({ id: match[1], nombre: match[2] });
}

const logosDir = path.join(process.cwd(), 'public', 'logos');
const missing = [];

for (const uni of universities) {
  const filepath = path.join(logosDir, `${uni.id}.png`);
  if (!fs.existsSync(filepath)) {
    missing.push(uni);
  } else {
    const stats = fs.statSync(filepath);
    if (stats.size < 2000) {
      missing.push(uni); // Consider small files as missing (probably globe icon)
    }
  }
}

console.log(`Missing or small logos: ${missing.length}`);
missing.forEach(m => console.log(`- ${m.id} (${m.nombre})`));
