import fs from 'fs';
import path from 'path';
import { UNIVERSIDADES } from '../src/data/universidades.js';
import { LATAM } from '../src/data/latam.js';

const allUnis = [...UNIVERSIDADES, ...LATAM];
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error('❌ Error: La variable de entorno GEMINI_API_KEY no está configurada.');
  process.exit(1);
}

// Cargar estados actuales
const estadosPath = path.resolve('src/data/estados.json');
let estadosActuales = {};
try {
  estadosActuales = JSON.parse(fs.readFileSync(estadosPath, 'utf-8'));
} catch (e) {
  console.log('No se pudo cargar estados.json, se creará uno nuevo.');
}

const batchSize = 8; // Consultar en grupos pequeños para máxima precisión de búsqueda por lote
const batches = [];
for (let i = 0; i < allUnis.length; i += batchSize) {
  batches.push(allUnis.slice(i, i + batchSize));
}

console.log(`Iniciando actualización por IA con Gemini. Total universidades: ${allUnis.length}. Lotes: ${batches.length}`);

async function consultarGeminiConBusqueda(lote) {
  const listaTexto = lote.map(u => `- ${u.id}: ${u.nombre} (${u.ciudad ? u.ciudad + ', ' : ''}${u.pais || 'Colombia'}) - Portal de admisiones: ${u.admisiones}`).join('\n');

  const prompt = `Actúa como un experto en el sistema universitario latinoamericano. Tu tarea es investigar el estado real de admisiones (pregrado) hoy para las siguientes universidades. 
Para cada universidad, debes buscar en internet cuál es su estado actual de inscripción.

Responde ÚNICAMENTE con un objeto JSON plano donde las llaves sean el ID de la universidad y el valor sea uno de estos 4 estados:
- "abiertas" (si hay inscripciones o convocatorias activas para registro de aspirantes en este momento).
- "matriculas" (si el proceso de inscripción ya cerró pero se encuentra en periodo de matrículas financieras/académicas o inducciones del semestre).
- "proximamente" (si las inscripciones del periodo actual están cerradas pero la página web oficial ya anuncia la fecha exacta de apertura del próximo periodo).
- "cerradas" (si no hay procesos de inscripción ni matrículas activas, o si las clases ya iniciaron y no hay convocatorias vigentes).

Lista de universidades a investigar:
${listaTexto}

Responde exclusivamente con el JSON, sin bloques de código markdown, solo el objeto JSON plano:
{
  "id_universidad": "estado"
}`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  
  const body = {
    contents: [{
      parts: [{ text: prompt }]
    }],
    tools: [{
      googleSearch: {} // Activa la navegación web de Google Search en Gemini
    }],
    generationConfig: {
      responseMimeType: "application/json"
    }
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`HTTP ${res.status}: ${errText}`);
    }

    const data = await res.json();
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!replyText) {
      throw new Error('Respuesta vacía de Gemini');
    }

    return JSON.parse(replyText.trim());
  } catch (error) {
    console.error(`Error procesando lote:`, error.message);
    return null;
  }
}

async function ejecutarSincronizacion() {
  const nuevosEstados = { ...estadosActuales };
  let exitos = 0;

  for (let i = 0; i < batches.length; i++) {
    const lote = batches[i];
    console.log(`[Lote ${i + 1}/${batches.length}] Investigando ${lote.length} universidades...`);
    
    const resultadoLote = await consultarGeminiConBusqueda(lote);
    if (resultadoLote) {
      console.log('Resultados obtenidos del lote:', resultadoLote);
      Object.assign(nuevosEstados, resultadoLote);
      exitos++;
    } else {
      console.log(`Lote ${i + 1} falló. Se conservarán los estados anteriores para estas universidades.`);
    }

    // Espera corta para evitar saturación de tasa de solicitudes
    await new Promise(r => setTimeout(r, 2000));
  }

  // Guardar los estados consolidados
  fs.writeFileSync(estadosPath, JSON.stringify(nuevosEstados, null, 2), 'utf-8');
  console.log(`\n🎉 Sincronización finalizada. Sincronizados con éxito ${exitos} de ${batches.length} lotes.`);
}

ejecutarSincronizacion();
