// Guías detalladas del proceso de inscripción por universidad.
// REGLA DE ORO: cada guía lleva `verificado` (fecha en que se confirmó en la
// fuente oficial) y `fuente` (URL oficial consultada). Si una universidad no
// aparece aquí, la UI muestra el proceso genérico marcado "sin verificar".
// Al actualizar una guía, actualiza SIEMPRE la fecha `verificado`.
//
// Esquema por universidad (todos los campos son opcionales salvo verificado/fuente):
// {
//   verificado: 'YYYY-MM-DD',
//   fuente: 'https://...',            // página oficial consultada
//   nombreFuente: 'Oficina de ...',
//   resumen: 'Cómo funciona la admisión en esta universidad.',
//   convocatoria: 'Estado/fechas de la convocatoria al momento de verificar.',
//   costoPin: { valor: 120000, nota: '...' },   // valor null si no se confirmó
//   requisitos: ['...'],
//   etapas: [{ titulo: '...', detalle: '...' }],
//   notas: ['...'],
// }

export const PROCESOS_DETALLADOS = {
  // ─────────────────────────────────────────────────────────── PÚBLICAS ──
  unal: {
    verificado: '2026-07-18',
    fuente: 'https://admisiones.unal.edu.co/pregrado/guia-paso-a-paso-pregrado/',
    nombreFuente: 'Dirección Nacional de Admisiones — UNAL',
    resumen:
      'La UNAL admite por su PROPIO examen (no usa el puntaje del ICFES). El puntaje que obtengas en la prueba define a qué programa puedes aspirar. Hay admisión regular y programas especiales (PAES, PEAMA, PAET).',
    convocatoria:
      'Convocatoria 2027-1 ABIERTA al verificar: pago de derechos e inscripción del 6 de julio al 19 de agosto de 2026. Examen de admisión: domingo 20 de septiembre de 2026. Consulta de puntajes desde el 1 de octubre; inscripción del programa curricular del 1 al 6 de octubre; resultados de admisión desde el 9 de octubre; envío de documentos del 15 al 20 de octubre de 2026.',
    costoPin: {
      valor: 175000,
      nota: 'Derechos de inscripción de la convocatoria 2027-1 ($175.000 COP; US$87,5 si pagas desde el exterior). La UNAL NO solicita pagos por adjudicación de cupos: cualquier cobro distinto al PIN oficial es fraude.',
    },
    requisitos: [
      'Ser bachiller (o estar cursando grado 11).',
      'Haber presentado el examen Saber 11 (ICFES) — se exige haberlo presentado, pero el puntaje NO define la admisión.',
      'Documento de identidad vigente.',
    ],
    etapas: [
      { titulo: 'Revisa la reglamentación y la oferta de programas', detalle: 'Confirma qué programas se ofrecen en la sede donde quieres estudiar (Bogotá, Medellín, Manizales, Palmira, La Paz y sedes de presencia nacional).' },
      { titulo: 'Paga los derechos de inscripción', detalle: 'Dentro de las fechas de la convocatoria, en línea o por los canales oficiales que indica admisiones.unal.edu.co.' },
      { titulo: 'Formaliza la inscripción en línea', detalle: 'Diligencia el formulario en admisiones.unal.edu.co con tus datos y el número de pago.' },
      { titulo: 'Consulta tu citación y presenta el examen', detalle: 'La citación (fecha, hora y lugar) se publica semanas antes. Lleva tu documento de identidad.' },
      { titulo: 'Consulta tu puntaje e inscribe el programa', detalle: 'Con tu puntaje, inscribes el programa curricular al que aspiras en la ventana publicada.' },
      { titulo: 'Consulta resultados y envía documentos', detalle: 'Si eres admitido, envía los documentos requeridos y paga la sistematización para matricularte. La matrícula de pregrado está cubierta por la Política de Gratuidad para la mayoría.' },
    ],
    notas: [
      'Es la universidad más demandada del país: prepárate para el examen con tiempo.',
      'Desde 2027 algunos programas y sedes tienen mecanismos de admisión sin examen — revisa la convocatoria oficial de tu programa.',
    ],
  },

  udea: {
    verificado: '2026-07-18',
    fuente: 'https://www.udea.edu.co/wps/portal/udea/web/inicio/estudiar-udea/quiero-estudiar-udea/pregrado',
    nombreFuente: 'Portal Estudiar en la UdeA — Admisiones pregrado',
    resumen:
      'La UdeA admite por su PROPIO examen: prueba de razonamiento lógico y competencia lectora (no usa el puntaje del ICFES para pregrado). Al inscribirte eliges dos opciones de programa.',
    convocatoria:
      'Al verificar, la convocatoria 2026-2 ya cerró (inscripciones del 19 de febrero al 18 de marzo de 2026; examen el 25 de mayo de 2026). El calendario de la convocatoria 2027-1 aún no estaba publicado; la admisión especial 2027-1 (comunidades indígenas, afro, víctimas, sordoseñantes, exentas de pago) tenía registro hasta el 17 de julio de 2026.',
    costoPin: {
      valor: null,
      nota: 'El valor oficial se publica con cada calendario. Referencia de la última convocatoria: ~$90.800 COP por la inscripción con dos opciones de programa (y un valor menor, ~$28.200, para sedes regionales y programas virtuales). Confírmalo al abrir la nueva convocatoria.',
    },
    requisitos: [
      'Ser bachiller o estar cursando grado 11.',
      'Documento de identidad vigente para la inscripción y el registro biométrico.',
      'No se exige puntaje mínimo de Saber 11: lo que cuenta es el examen propio.',
    ],
    etapas: [
      { titulo: 'Diligencia el formulario de inscripción', detalle: 'En el portal de la UdeA, dentro de las fechas del calendario. Elige tu primera y segunda opción de programa.' },
      { titulo: 'Paga los derechos de inscripción', detalle: 'La inscripción solo queda efectiva cuando pagas: en línea o descargando el recibo para pagar en banco.' },
      { titulo: 'Descarga tu credencial', detalle: 'Días antes del examen se habilita la credencial con fecha, hora y campus. No la envían por correo: descárgala e imprímela.' },
      { titulo: 'Presenta el examen de admisión', detalle: '80 preguntas (40 de razonamiento lógico y 40 de competencia lectora), máximo 3 horas. Lleva credencial impresa, documento, lápiz negro #2, sacapuntas y borrador.' },
      { titulo: 'Consulta resultados', detalle: 'Los cupos se asignan por puntaje entre tus dos opciones. Si no alcanzas cupo, existe un programa de admisión a cursos de primeros semestres con promoción posterior.' },
      { titulo: 'Matricúlate', detalle: 'Si eres admitido, sigue el instructivo de matrícula. En pregrado aplica la Política de Gratuidad para la mayoría de estudiantes.' },
    ],
    notas: [
      'La UdeA ofrece simulacro oficial del examen y preparatorios gratuitos — úsalos.',
      'Hay dos convocatorias al año; el calendario nuevo se publica en el portal "Estudiar en la UdeA".',
    ],
  },

  univalle: {
    verificado: '2026-07-18',
    fuente: 'https://admisiones.univalle.edu.co/new/',
    nombreFuente: 'Área de Admisiones — Universidad del Valle',
    resumen:
      'Univalle admite por el puntaje del examen Saber 11 (ICFES), ponderado por áreas según el programa al que aspiras. No hay examen propio.',
    convocatoria:
      'Al verificar, la convocatoria 2026-2 ya había cerrado (inscripciones hasta comienzos de junio de 2026, con resultados a finales de junio). La convocatoria 2027-1 se publica en el portal oficial de admisiones; históricamente abre en el segundo semestre del año.',
    costoPin: {
      valor: null,
      nota: 'El valor del PIN se publica con cada convocatoria en admisiones.univalle.edu.co. No lo confirmamos en esta verificación.',
    },
    requisitos: [
      'Ser bachiller o estar cursando grado 11.',
      'Resultados del examen Saber 11 (ICFES) — el puntaje ponderado por áreas define la admisión.',
      'Documento de identidad vigente.',
    ],
    etapas: [
      { titulo: 'Inscripción', detalle: 'Compra el PIN y diligencia el formulario en línea en admisiones.univalle.edu.co dentro de las fechas de la convocatoria. Elige programa y sede (Cali o regionales).' },
      { titulo: 'Proceso de selección', detalle: 'La universidad pondera tus puntajes de Saber 11 por áreas según el programa. Algunos programas (como Música o Artes) tienen pruebas específicas adicionales.' },
      { titulo: 'Consulta de resultados', detalle: 'Los admitidos se publican en el portal en las fechas del calendario.' },
      { titulo: 'Carga de documentos y matrícula', detalle: 'Si eres admitido, carga los documentos requeridos y formaliza la matrícula. En pregrado aplica la Política de Gratuidad para la mayoría.' },
    ],
    notas: [
      'Contacto oficial: admisiones@correounivalle.edu.co · +57 (602) 3212101.',
    ],
  },

  uis: {
    verificado: '2026-07-18',
    fuente: 'https://inscripciones.uis.edu.co/',
    nombreFuente: 'Dirección de Admisiones y Registro Académico — UIS',
    resumen:
      'La UIS admite por el puntaje del examen Saber 11 (ICFES), ponderado según el programa. No hay examen propio.',
    convocatoria:
      'Al verificar, la convocatoria 2026-2 ya había cerrado (pago de derechos del 4 de mayo al 17 de junio y registro en línea hasta el 18 de junio de 2026). Como referencia, la convocatoria 2026-1 abrió del 8 de octubre al 20 de noviembre de 2025. La próxima se publica en inscripciones.uis.edu.co.',
    costoPin: {
      valor: null,
      nota: 'El valor de los derechos de inscripción se publica en cada convocatoria en el portal oficial. No lo confirmamos en esta verificación.',
    },
    requisitos: [
      'Haber aprobado grado 11 o estar cursándolo.',
      'Examen Saber 11 con vigencia no mayor a 5 años (para 2026: presentado desde 2021).',
      'Puntaje mínimo de 31 puntos en CADA área de conocimiento del Saber 11 (programas presenciales de Bucaramanga).',
    ],
    etapas: [
      { titulo: 'Paga los derechos de inscripción', detalle: 'En la fase de recaudo del calendario, por los medios oficiales del portal de inscripciones.' },
      { titulo: 'Formaliza el registro en línea', detalle: 'Diligencia el formulario en inscripciones.uis.edu.co, eligiendo programa y sede.' },
      { titulo: 'Proceso de selección', detalle: 'Se ordenan los aspirantes por el puntaje ponderado de Saber 11 según el programa.' },
      { titulo: 'Consulta resultados y matricúlate', detalle: 'Si eres admitido, entrega documentos y matricúlate. La política de gratuidad "Puedo Estudiar" cubre la matrícula neta de pregrado para la mayoría.' },
    ],
    notas: [
      'La UIS tiene sedes regionales (Socorro, Barbosa, Málaga, Barrancabermeja) con oferta propia.',
    ],
  },

  uniatlantico: {
    verificado: '2026-07-18',
    fuente: 'https://www.uniatlantico.edu.co/wp-content/uploads/2026/04/GUIA-PARA-EL-PROCESO-DE-INSCRIPCION-2026-2.pdf',
    nombreFuente: 'Guía oficial de inscripción 2026-2 — Universidad del Atlántico',
    resumen:
      'La Universidad del Atlántico admite por el puntaje del examen Saber 11 (ICFES). Para inscribirte no se exige puntaje mínimo; el puntaje define quién obtiene cupo.',
    convocatoria:
      'Al verificar, la ventana de compra de PIN de la convocatoria 2026-2 ya había pasado (6 al 19 de mayo de 2026). El calendario de la siguiente convocatoria se publica en uniatlantico.edu.co (sección Admisiones y Registro Académico).',
    costoPin: {
      valor: null,
      nota: 'El PIN se compra en Banco Popular o en línea; al pagar llega a tu correo un PIN de 19 dígitos. Hay inscripción GRATUITA para quienes cumplen los requisitos de la Resolución Rectoral 001620 de 2013 (poblaciones especiales). El valor exacto se publica en cada convocatoria.',
    },
    requisitos: [
      'Ser bachiller o estar cursando grado 11.',
      'Haber presentado el examen Saber 11 (se aceptan resultados desde 2014).',
      'No se exige puntaje mínimo para inscribirse.',
    ],
    etapas: [
      { titulo: 'Compra el PIN', detalle: 'En las fechas del calendario, en Banco Popular o pago en línea. El PIN de 19 dígitos llega a tu correo.' },
      { titulo: 'Formaliza la inscripción en línea', detalle: 'Con el PIN, diligencia el formulario en www.uniatlantico.edu.co y elige tu programa.' },
      { titulo: 'Proceso de selección', detalle: 'Los cupos se asignan por puntaje de Saber 11 según el programa.' },
      { titulo: 'Consulta resultados y matricúlate', detalle: 'Si eres admitido, sigue la guía de nuevos admitidos: documentos, liquidación y matrícula (aplica gratuidad en pregrado para la mayoría).' },
    ],
    notas: [
      'Descarga siempre la "Guía para el proceso de inscripción" vigente del sitio oficial: ahí están las fechas exactas de cada periodo.',
    ],
  },

  unicartagena: {
    verificado: '2026-07-18',
    fuente: 'https://www.unicartagena.edu.co/aspirante',
    nombreFuente: 'Portal de aspirantes — Universidad de Cartagena',
    resumen:
      'La Universidad de Cartagena admite por el puntaje del examen Saber 11 (ICFES). La inscripción se hace en la plataforma SMA de la universidad, y el proceso está regulado por acuerdos publicados en el portal (el calendario 2026-2 quedó fijado en el Acuerdo No. 03 del 19 de febrero de 2026).',
    convocatoria:
      'Las fechas exactas de cada periodo se publican en la sección "Calendario de Inscripciones" del portal de aspirantes (en acuerdos descargables). Referencia del ciclo 2026-1: venta de pines hasta el 30 de octubre de 2025, inscripciones hasta el 31 de octubre y resultados el 14 de noviembre de 2025. Verifica el calendario vigente antes de cualquier pago.',
    costoPin: {
      valor: null,
      nota: 'El PIN se compra únicamente en línea por PSE. Referencia de la convocatoria 2026-1: $166.704 COP (según Universo U, el portal informativo de la universidad). El valor vigente se publica con cada convocatoria.',
    },
    requisitos: [
      'Ser bachiller o estar cursando grado 11 (requisitos generales del Ministerio de Educación).',
      'Resultados del examen Saber 11 — la selección es por puntaje; consulta los "puntajes de referencia" históricos en el portal de aspirantes.',
      'Documento de identidad vigente.',
    ],
    etapas: [
      { titulo: 'Consulta el calendario vigente', detalle: 'En el portal de aspirantes → Calendario de Inscripciones (se publica por acuerdo para cada periodo).' },
      { titulo: 'Compra el PIN por PSE', detalle: 'El pago es únicamente en línea (PSE) dentro de las fechas de venta de pines.' },
      { titulo: 'Inscríbete en la plataforma SMA', detalle: 'Diligencia el formulario en la plataforma SMA (sma.unicartagena.edu.co) y elige tu programa (presencial o a distancia).' },
      { titulo: 'Consulta los resultados', detalle: 'La selección es por puntaje de Saber 11; los admitidos se publican en las fechas del calendario.' },
      { titulo: 'Matricúlate', detalle: 'Si eres admitido, entrega documentos y formaliza la matrícula (aplica gratuidad en pregrado para la mayoría).' },
    ],
    notas: [
      'Revisa los "puntajes de referencia" de tu programa antes de inscribirte: te dicen qué tan competido está el cupo.',
      'Duda o problema: admisiones@unicartagena.edu.co (Centro de Admisiones, Registro y Control Académico).',
    ],
  },

  // ─────────────────────────────────────────────────────────── PRIVADAS ──
  uniandes: {
    verificado: '2026-07-18',
    fuente: 'https://aspirantes.uniandes.edu.co/es/pregrado/proceso-admision',
    nombreFuente: 'Portal de aspirantes — Universidad de los Andes',
    resumen:
      'Uniandes NO tiene examen propio ni cobra inscripción: el formulario es gratuito y en línea, dos veces al año, con publicación de admitidos por cortes. La admisión depende de un excelente resultado en las pruebas que la universidad avala (Saber 11 u otras).',
    convocatoria:
      'El proceso funciona por cortes durante el semestre anterior al ingreso. Referencia 2026-2: apertura de inscripciones el 28 de enero y cierre del último corte el 6 de julio de 2026, con última publicación de admitidos el 9 de julio. Las fechas de cada periodo se publican en aspirantes.uniandes.edu.co.',
    costoPin: {
      valor: 0,
      nota: 'La inscripción es GRATUITA. Ojo: la MATRÍCULA es privada y se paga cada semestre (varía por programa); revisa becas (Quiero Estudiar), ICETEX y financiación antes de matricularte.',
    },
    requisitos: [
      'Saber 11 presentado en los últimos 5 años (para 2026: entre 2021-2 y 2026-1), con puntajes de corte según el programa.',
      'También aceptan exámenes internacionales (IB, Cambridge, etc.) o admisión previa a universidades top 100 de rankings QS/THE/Shanghái, según la modalidad.',
      'Certificados de notas o ranking del colegio, según la modalidad elegida.',
    ],
    etapas: [
      { titulo: 'Diligencia el formulario de inscripción', detalle: 'Gratuito, en línea, dentro de las fechas del periodo. Elige tu modalidad de admisión.' },
      { titulo: 'Carga los documentos', detalle: 'Los que respalden tu modalidad: resultados Saber 11, certificados del colegio o diplomas internacionales.' },
      { titulo: 'Espera los resultados del corte', detalle: 'Los admitidos se publican por cortes en las fechas anunciadas.' },
      { titulo: 'Define la financiación y matricúlate', detalle: 'Si eres admitido, revisa becas y apoyos ANTES de matricularte y formaliza la matrícula.' },
    ],
    notas: [
      'Programas como Medicina, Música o Arquitectura pueden tener requisitos o pruebas adicionales — revisa la página del programa.',
    ],
  },

  uninorte: {
    verificado: '2026-07-18',
    fuente: 'https://www.uninorte.edu.co/web/admisiones-pregrado/nuevos-ingresos',
    nombreFuente: 'Admisiones Pregrado — Universidad del Norte',
    resumen:
      'Uninorte admite con el formulario en línea (plataforma Pomelo) más el pago de la inscripción; evalúa tus notas de bachillerato y el Saber 11. Algunos programas piden prueba adicional.',
    convocatoria:
      'Referencia 2026-2 al verificar: inscripciones del 2 de marzo al 24 de julio de 2026 (Medicina hasta el 10 de julio), con decisión de admisión notificada al correo desde el 4 de marzo e inicio de clases el 27 de julio. El calendario de cada periodo está en la sección Calendarios del portal de admisiones.',
    costoPin: {
      valor: 150000,
      nota: 'Valor de la inscripción: $150.000 COP, no reembolsable. La MATRÍCULA es privada y se paga por semestre; revisa becas y financiación de la universidad e ICETEX.',
    },
    requisitos: [
      'Documento de identidad (ambas caras, un solo archivo PDF/JPG, máx. 10 MB).',
      'Certificado de notas definitivas de uno de los dos últimos años de bachillerato.',
      'Resultados del Saber 11.',
      'Pruebas adicionales según programa: inglés (Lenguas Modernas, Relaciones Internacionales, Negocios Internacionales), aptitudes musicales (Música).',
    ],
    etapas: [
      { titulo: 'Diligencia el formulario en línea', detalle: 'En la plataforma de admisiones (Pomelo) con tus documentos cargados.' },
      { titulo: 'Paga la inscripción', detalle: '$150.000 COP (no reembolsable) para que tu solicitud entre al proceso.' },
      { titulo: 'Espera la decisión de admisión', detalle: 'Se notifica a tu correo; solo se evalúan solicitudes con documentación completa.' },
      { titulo: 'Paga la matrícula', detalle: 'Recibirás volantes de pago: matrícula del pregrado, idiomas (según programa) y exámenes médicos de ingreso.' },
      { titulo: 'Clasificación de inglés y diploma', detalle: 'Presenta el examen de clasificación de inglés (sin costo antes del primer semestre) y carga tu diploma de bachiller en el sistema (Aurora).' },
    ],
    notas: [
      'Medicina cierra inscripciones antes que el resto de programas — revisa el calendario con anticipación.',
    ],
  },
};
