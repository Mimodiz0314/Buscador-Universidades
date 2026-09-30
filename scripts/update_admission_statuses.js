import fs from 'fs';
import path from 'path';
import { UNIVERSIDADES } from '../src/data/universidades.js';
import { LATAM } from '../src/data/latam.js';
import { listaUnica, decidirEstado, hoyColombia, fechaEnTexto } from './reglas_estados.js';

// UNIVERSIDADES ya incluye las de Latinoamérica: listaUnica evita consultarlas dos veces.
const allUnis = listaUnica(UNIVERSIDADES, LATAM);
const porId = new Map(allUnis.map((u) => [u.id, u]));
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error('❌ Error: La variable de entorno GEMINI_API_KEY no está configurada.');
  process.exit(1);
}

const leerJson = (p, porDefecto) => {
  try { return JSON.parse(fs.readFileSync(p, 'utf-8')); } catch { return porDefecto; }
};

const estadosPath = path.resolve('src/data/estados.json');
const detallePath = path.resolve('src/data/estados_detalle.json');
const metaPath = path.resolve('src/data/meta.json');
const estadosActuales = leerJson(estadosPath, {});
const detalleActual = leerJson(detallePath, {});
const HOY = hoyColombia();

const batchSize = 8; // Consultar en grupos pequeños para máxima precisión de búsqueda por lote
const batches = [];
for (let i = 0; i < allUnis.length; i += batchSize) {
  batches.push(allUnis.slice(i, i + batchSize));
}

console.log(`Iniciando actualización por IA con Gemini (${HOY}). Total universidades: ${allUnis.length}. Lotes: ${batches.length}`);

async function consultarGeminiConBusqueda(lote) {
  const listaTexto = lote.map(u => `- ${u.id}: ${u.nombre} (${u.ciudad ? u.ciudad + ', ' : ''}${u.pais || 'Colombia'}) - Sitio oficial: ${u.web || ''} - Portal de admisiones: ${u.admisiones}`).join('\n');

  const prompt = `Hoy es ${HOY} (hora de Colombia). Actúa como un investigador cuidadoso del sistema universitario latinoamericano. Para cada universidad de la lista, busca en su SITIO WEB OFICIAL el estado actual de admisiones de PREGRADO.

Estados posibles:
- "abiertas": hoy hay inscripciones o convocatoria activa para aspirantes.
- "matriculas": las inscripciones ya cerraron pero hoy está en periodo de matrículas o inducción.
- "proximamente": las inscripciones están cerradas pero el sitio oficial ya anuncia la fecha de apertura de la próxima.
- "cerradas": no hay inscripciones ni matrículas activas.

REGLAS ESTRICTAS:
- "fuente" debe ser la URL exacta de una página del sitio oficial de ESA universidad donde viste la información (no noticias, blogs ni agregadores).
- "evidencia" debe ser una frase corta copiada de esa página que respalde el estado.
- "apertura" y "cierre" son las fechas de inscripción en formato YYYY-MM-DD si aparecen; si no, null.
- Si no encuentras información oficial clara, responde "estado": null. Es mejor no saber que adivinar.
- Usa exactamente los IDs de la lista.

Lista de universidades a investigar:
${listaTexto}

Responde ÚNICAMENTE con un bloque de código json con esta forma:
\`\`\`json
{
  "id_universidad": { "estado": "abiertas", "fuente": "https://...", "evidencia": "...", "apertura": "2026-10-01", "cierre": null }
}
\`\`\``;

  const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

  const body = {
    contents: [{
      parts: [{ text: prompt }]
    }],
    tools: [{
      googleSearch: {} // Activa la navegación web de Google Search en Gemini
    }]
  };

  for (let intento = 1; intento <= 2; intento++) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        // La clave va en la cabecera (no en la dirección) para que no quede en registros.
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errText}`);
      }

      const data = await res.json();
      const parts = data.candidates?.[0]?.content?.parts || [];
      const replyText = parts.map(p => p.text || '').join('\n');

      if (!replyText.trim()) {
        throw new Error('Respuesta vacía de Gemini');
      }

      // Extraer JSON del bloque de código markdown o del objeto
      let cleanJson = replyText;
      const jsonMatch = replyText.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
      if (jsonMatch) {
        cleanJson = jsonMatch[1];
      } else {
        const braceMatch = replyText.match(/\{[\s\S]*\}/);
        if (braceMatch) cleanJson = braceMatch[0];
      }

      // Limpiar posibles comas colgantes antes de llaves de cierre
      cleanJson = cleanJson.replace(/,\s*([}\]])/g, '$1');

      const parsed = JSON.parse(cleanJson.trim());

      // Solo se aceptan IDs que pertenecen a este lote.
      const idsLote = new Set(lote.map(u => u.id));
      const respuestas = {};
      for (const [id, valor] of Object.entries(parsed)) {
        if (idsLote.has(id) && valor && typeof valor === 'object') respuestas[id] = valor;
        else if (!idsLote.has(id)) console.log(`  ⚠ ID desconocido ignorado: ${id}`);
      }
      return respuestas;
    } catch (error) {
      console.error(`  Intento ${intento} falló:`, error.message);
      if (intento < 2) {
        console.log('  Reintentando en 3 segundos...');
        await new Promise(r => setTimeout(r, 3000));
      } else {
        return null;
      }
    }
  }
  return null;
}

async function ejecutarSincronizacion() {
  const nuevosEstados = {};
  const nuevoDetalle = {};
  const conteo = { aceptado: 0, sin_cambio: 0, pendiente: 0, a_sin_dato: 0 };
  let lotesOk = 0;

  for (let i = 0; i < batches.length; i++) {
    const lote = batches[i];
    console.log(`[Lote ${i + 1}/${batches.length}] Investigando ${lote.length} universidades...`);

    const respuestas = await consultarGeminiConBusqueda(lote);
    if (respuestas) lotesOk++;
    else console.log(`  Lote ${i + 1} falló: se conservan los estados confirmados anteriores.`);

    for (const uni of lote) {
      const r = decidirEstado({
        uni,
        previoEstado: estadosActuales[uni.id],
        previoDetalle: detalleActual[uni.id],
        resp: respuestas ? respuestas[uni.id] : undefined,
        hoy: HOY,
      });
      nuevosEstados[uni.id] = r.estado;
      nuevoDetalle[uni.id] = r.detalle;
      conteo[r.cambio]++;
      console.log(`  ${uni.id}: ${r.estado} (${r.cambio}${r.detalle.motivo ? ' — ' + r.detalle.motivo : ''})`);
    }

    // Espera corta para evitar saturación de tasa de solicitudes
    await new Promise(r => setTimeout(r, 2000));
  }

  fs.writeFileSync(estadosPath, JSON.stringify(nuevosEstados, null, 2) + '\n', 'utf-8');
  fs.writeFileSync(detallePath, JSON.stringify(nuevoDetalle, null, 2) + '\n', 'utf-8');

  const confirmadas = Object.values(nuevoDetalle).filter(d => d.confirmado).length;
  fs.writeFileSync(metaPath, JSON.stringify({
    ultimaActualizacion: HOY,
    fechaTexto: fechaEnTexto(HOY),
    totalUniversidades: allUnis.length,
    confirmadas,
    sinDato: allUnis.length - confirmadas,
    cambiosPendientes: conteo.pendiente,
    exitosLotes: lotesOk,
    totalLotes: batches.length
  }, null, 2) + '\n', 'utf-8');

  console.log(`\n🎉 Listo. Lotes OK: ${lotesOk}/${batches.length}. Con fuente oficial: ${confirmadas}/${allUnis.length}. Cambios en espera de 2ª confirmación: ${conteo.pendiente}.`);
}

ejecutarSincronizacion();
