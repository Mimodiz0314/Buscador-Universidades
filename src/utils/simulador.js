// Estimación ORIENTATIVA de probabilidad de admisión según puntaje global Saber 11.
// Basada en rangos históricos públicos aproximados por nivel de demanda del programa
// y selectividad de la universidad. NO reemplaza los puntajes de corte oficiales.

const DEMANDA_MUY_ALTA = /medicina(?!\s+veterinaria)|odontolog/i;
const DEMANDA_ALTA =
  /derecho|psicolog|enfermer|arquitectura|veterinaria|sistemas|software|civil|industrial|mecatr|electr[oó]nica|petr[oó]leos|econom/i;

export function nivelDemanda(programa) {
  if (DEMANDA_MUY_ALTA.test(programa)) return 'muy alta';
  if (DEMANDA_ALTA.test(programa)) return 'alta';
  return 'media';
}

// Umbrales base (puntaje global Saber 11, escala 0–500) por demanda del programa.
const UMBRALES = {
  'muy alta': { verde: 400, amarillo: 360 },
  alta: { verde: 340, amarillo: 300 },
  media: { verde: 290, amarillo: 250 },
};

// Ajuste por selectividad de la universidad.
const AJUSTE_SELECTIVIDAD = { 'muy alta': 20, alta: 10, media: 0, abierta: -999 };

/**
 * @returns {{nivel:'verde'|'amarillo'|'rojo'|'propio'|'abierta'|'privada', mensaje:string}}
 */
export function estimarAdmision(puntaje, programa, universidad) {
  if (universidad.tipoAdmision === 'abierta') {
    return {
      nivel: 'abierta',
      mensaje: 'Admisión abierta: no exige puntaje mínimo de ICFES. Puedes inscribirte directamente.',
    };
  }
  if (universidad.tipoAdmision === 'propio') {
    return {
      nivel: 'propio',
      mensaje: `${universidad.sigla} usa examen de admisión PROPIO: tu puntaje ICFES no aplica directamente. Prepárate para su examen y revisa simulacros oficiales.`,
    };
  }
  if (universidad.tipo === 'privada') {
    return {
      nivel: 'privada',
      mensaje: `${universidad.sigla} es privada: suele pedir un puntaje ICFES mínimo moderado (no un corte alto) y el ingreso depende más de la entrevista/proceso propio y de cómo financies la matrícula. Revisa sus becas por mérito y la pestaña de becas.`,
    };
  }
  const demanda = nivelDemanda(programa);
  const ajuste = AJUSTE_SELECTIVIDAD[universidad.selectividad] ?? 0;
  const u = UMBRALES[demanda];
  const verde = u.verde + ajuste;
  const amarillo = u.amarillo + ajuste;

  if (puntaje >= verde) {
    return {
      nivel: 'verde',
      mensaje: `Con ${puntaje} puntos estás en el rango que históricamente ha sido admitido en programas de demanda ${demanda}. Aun así, el corte cambia cada semestre: inscríbete y verifica el corte oficial.`,
    };
  }
  if (puntaje >= amarillo) {
    return {
      nivel: 'amarillo',
      mensaje: `Con ${puntaje} puntos estás en zona límite para demanda ${demanda} (corte aproximado histórico ≈ ${verde}). Tienes opciones reales según la competencia del semestre — inscríbete y ten un plan B.`,
    };
  }
  return {
    nivel: 'rojo',
    mensaje: `Con ${puntaje} puntos, este programa (demanda ${demanda}, corte histórico ≈ ${verde}) es poco probable este ciclo. Mira el plan de mejora abajo o considera universidades/programas con menor corte.`,
  };
}

// Recomendaciones generales para maximizar el ingreso (punto 7 y 9 de la idea).
export function recomendaciones(puntaje, resultados) {
  const recs = [];
  const verdes = resultados.filter((r) => r.est.nivel === 'verde').length;
  const propios = resultados.filter((r) => r.est.nivel === 'propio').length;

  recs.push(
    'Inscríbete en 2 o más universidades a la vez: los calendarios suelen coincidir y multiplicar opciones es la estrategia #1 comprobada.'
  );
  if (propios > 0) {
    recs.push(
      'La UNAL y la UdeA tienen examen propio: son una segunda oportunidad independiente de tu ICFES. Consigue simulacros de sus exámenes y preséntate — muchos estudiantes con ICFES medio ingresan por esta vía.'
    );
  }
  if (puntaje > 0 && puntaje < 300) {
    recs.push(
      'Puedes volver a presentar el Saber 11 (hay dos aplicaciones al año). Subir 30–50 puntos con preparación enfocada en Lectura Crítica y Matemáticas es realista y cambia tus opciones por completo.'
    );
    recs.push(
      'Considera empezar por la UNAD (admisión abierta) o por programas con menor demanda en tu región, y luego pedir transferencia interna: es una ruta legal y usada.'
    );
  }
  if (verdes > 0) {
    recs.push(
      'Tienes opciones fuertes: asegura la inscripción TEMPRANO (los PIN tienen fecha límite estricta) y ten los documentos listos (ICFES, diploma/acta, documento de identidad).'
    );
  }
  recs.push(
    'Revisa la pestaña de becas: con la Política de Gratuidad la matrícula en públicas es $0 para la mayoría — el costo real es inscripción + sostenimiento, y para eso hay fondos.'
  );
  return recs;
}
