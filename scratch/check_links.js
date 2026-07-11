import { UNIVERSIDADES } from '../src/data/universidades.js';
import { LATAM } from '../src/data/latam.js';

const allUnis = [...UNIVERSIDADES, ...LATAM];

console.log(`Iniciando verificación de ${allUnis.length} universidades...`);

async function testUrl(url) {
  if (!url) return { ok: false, error: 'URL vacía' };
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      redirect: 'follow',
      timeout: 8000
    });
    return { ok: res.ok || res.status < 400, status: res.status };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

async function verifyAll() {
  const broken = [];
  
  for (const uni of allUnis) {
    console.log(`Probando: ${uni.nombre} (${uni.sigla || uni.id})`);
    
    const webResult = await testUrl(uni.web);
    if (!webResult.ok) {
      broken.push({ id: uni.id, name: uni.nombre, field: 'web', url: uni.web, error: webResult.error || `Status ${webResult.status}` });
    }
    
    const admResult = await testUrl(uni.admisiones);
    if (!admResult.ok) {
      broken.push({ id: uni.id, name: uni.nombre, field: 'admisiones', url: uni.admisiones, error: admResult.error || `Status ${admResult.status}` });
    }
  }
  
  console.log('\n--- REPORTE DE ENLACES CAÍDOS O CON PROBLEMAS ---');
  if (broken.length === 0) {
    console.log('¡Todos los enlaces funcionan correctamente!');
  } else {
    console.log(`Se encontraron ${broken.length} enlaces con problemas:`);
    console.log(JSON.stringify(broken, null, 2));
  }
}

verifyAll();
