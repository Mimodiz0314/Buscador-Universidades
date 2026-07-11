// Motor vocacional LOCAL (sin IA, sin internet): mapea intereses del estudiante
// a áreas de conocimiento y luego a carreras reales de nuestra base. Es la base
// del Test Vocacional; la IA (opcional) se monta encima para profundizar.
import { UNIVERSIDADES } from '../data/universidades.js';

// ── Áreas de conocimiento ───────────────────────────────────────────────────
export const AREAS = {
  salud: { nombre: 'Salud y Ciencias de la Vida', emoji: '🩺', color: 'rose' },
  ingenieria: { nombre: 'Ingeniería y Tecnología', emoji: '⚙️', color: 'blue' },
  ciencias: { nombre: 'Ciencias Exactas y Naturales', emoji: '🔬', color: 'cyan' },
  social: { nombre: 'Ciencias Sociales y Humanas', emoji: '🧠', color: 'violet' },
  economica: { nombre: 'Económicas, Administrativas y Negocios', emoji: '📈', color: 'emerald' },
  arte: { nombre: 'Artes, Diseño y Comunicación', emoji: '🎨', color: 'fuchsia' },
  educacion: { nombre: 'Educación', emoji: '📚', color: 'amber' },
  agro: { nombre: 'Agro, Animales y Medio Ambiente', emoji: '🌱', color: 'green' },
  derecho: { nombre: 'Derecho y Ciencia Política', emoji: '⚖️', color: 'slate' },
};

// ── Cuestionario ────────────────────────────────────────────────────────────
// Cada afirmación suma a un área. El estudiante responde 0..3 (No / Un poco /
// Sí / Me encanta). Frases concretas y cercanas a un bachiller colombiano.
export const PREGUNTAS = [
  { texto: 'Cuidar a las personas y ayudar a que se sientan mejor de salud', area: 'salud' },
  { texto: 'Armar, reparar o entender cómo funcionan las máquinas y los aparatos', area: 'ingenieria' },
  { texto: 'Programar, crear apps, videojuegos o trastear con computadores', area: 'ingenieria' },
  { texto: 'Hacer experimentos y resolver problemas con números y lógica', area: 'ciencias' },
  { texto: 'Investigar a fondo un tema hasta descubrir algo nuevo', area: 'ciencias' },
  { texto: 'Entender por qué las personas y las sociedades actúan como actúan', area: 'social' },
  { texto: 'Escuchar y acompañar a otros con sus problemas', area: 'social' },
  { texto: 'Liderar proyectos, vender ideas o manejar un negocio', area: 'economica' },
  { texto: 'Organizar dinero, cuentas, metas y planes', area: 'economica' },
  { texto: 'Crear: dibujar, diseñar, música, escribir o grabar video', area: 'arte' },
  { texto: 'Comunicar, hablar en público, redes sociales o periodismo', area: 'arte' },
  { texto: 'Enseñarle cosas a otros hasta que de verdad las entiendan', area: 'educacion' },
  { texto: 'Trabajar con animales, plantas, el campo o el medio ambiente', area: 'agro' },
  { texto: 'Defender causas justas, argumentar y debatir con razones', area: 'derecho' },
];

export const OPCIONES_RESPUESTA = [
  { valor: 0, etiqueta: 'No' },
  { valor: 1, etiqueta: 'Un poco' },
  { valor: 2, etiqueta: 'Sí' },
  { valor: 3, etiqueta: 'Me encanta' },
];

/**
 * Calcula el puntaje por área a partir de las respuestas (array de 0..3 por
 * pregunta) y devuelve las áreas ordenadas de mayor a menor afinidad (0..100).
 */
export function puntuarAreas(respuestas) {
  const acumulado = {};
  const maximo = {};
  PREGUNTAS.forEach((p, i) => {
    acumulado[p.area] = (acumulado[p.area] || 0) + (respuestas[i] || 0);
    maximo[p.area] = (maximo[p.area] || 0) + 3;
  });
  return Object.keys(AREAS)
    .map((id) => ({
      id,
      ...AREAS[id],
      porcentaje: maximo[id] ? Math.round((acumulado[id] / maximo[id]) * 100) : 0,
    }))
    .sort((a, b) => b.porcentaje - a.porcentaje);
}

// ── Mapeo carrera → área (por palabras clave, en orden de prioridad) ─────────
const REGLAS_AREA = [
  // Educación primero: una "Licenciatura en X" es carrera docente, sin importar X.
  ['educacion', /licenciatura|pedagog|etnoeducaci|educaci[óo]n f[íi]sica|educaci[óo]n infantil/i],
  ['agro', /veterinaria|zootecnia|agron|agroindustrial|agr[íi]cola|forestal|acuicultura|pesquer|agroecolog|biolog[íi]a marina|ambient|aliment/i],
  ['salud', /medicina(?! veterinaria)|enfermer|odontolog|fisioterap|fonoaudiolog|terapia|nutrici[óo]n|bacteriolog|microbiolog|optometr|instrumentaci[óo]n|farmac|gerontolog|regencia|salud/i],
  ['ingenieria', /ingenier|sistemas|software|electr[óo]nic|mecatr[óo]nic|telecomunic|inform[áa]tic|computaci[óo]n|multimedia|topograf|catastral|petr[óo]leos|minas|metal[úu]rgic/i],
  ['ciencias', /biolog|f[íi]sica|qu[íi]mic|matem[áa]tic|estad[íi]stic|geolog|astronom|ciencias naturales|bioqu[íi]mic|bioingenier/i],
  ['derecho', /derecho|ciencia pol[íi]tica|relaciones internacionales|gobierno/i],
  ['economica', /administraci|econom|contadur|negocios|mercadeo|finanz|comercio|turismo|hab[íi]tat/i],
  ['arte', /arte|dise[ñn]o|m[úu]sica|cine|audiovisual|comunicaci|periodismo|publicidad|literatura|danza|esc[ée]nic|moda|gastronom|pl[áa]stic|visual|multimedios/i],
  ['social', /psicolog|sociolog|antropolog|trabajo social|historia|filosof|geograf|desarrollo familiar|ling[üu][íi]stic|teolog|estudios b[íi]blicos|humanidades|archiv|deporte|recreaci/i],
];

export function areaDeCarrera(programa) {
  for (const [area, re] of REGLAS_AREA) {
    if (re.test(programa)) return area;
  }
  return 'social';
}

/**
 * Devuelve carreras reales de la base que pertenecen a las áreas dadas,
 * ordenadas por disponibilidad (en cuántas universidades se ofrecen).
 */
export function recomendarCarreras(areasIds, limite = 12) {
  const conteo = new Map();
  UNIVERSIDADES.forEach((u) => {
    u.programas.forEach((p) => {
      if (areasIds.includes(areaDeCarrera(p))) {
        conteo.set(p, (conteo.get(p) || 0) + 1);
      }
    });
  });
  return [...conteo.entries()]
    .map(([carrera, universidades]) => ({ carrera, universidades, area: areaDeCarrera(carrera) }))
    .sort((a, b) => b.universidades - a.universidades)
    .slice(0, limite);
}
