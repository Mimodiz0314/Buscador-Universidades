// Becas, fondos y apoyos REALES para acceso a educación superior pública en Colombia.
// Cada entrada lleva link oficial — la información de requisitos cambia por convocatoria.

export const BECAS = [
  {
    id: 'gratuidad',
    nombre: 'Política de Gratuidad en la Matrícula (MinEducación)',
    cobertura: 'Matrícula de pregrado en instituciones públicas ($0 de matrícula).',
    quienes:
      'La mayoría de estudiantes de pregrado en universidades e instituciones públicas. Se aplica automáticamente al momento de la matrícula si cumples las condiciones.',
    link: 'https://www.mineducacion.gov.co',
    destacada: true,
  },
  {
    id: 'icetex',
    nombre: 'ICETEX — Créditos condonables y fondos especiales',
    cobertura: 'Créditos educativos, fondos con condonación por graduación, sostenimiento.',
    quienes:
      'Varias líneas según condición socioeconómica, mérito académico y población (víctimas, docentes, etc.).',
    link: 'https://web.icetex.gov.co',
    destacada: true,
  },
  {
    id: 'alvaro-ulcue',
    nombre: 'Fondo Álvaro Ulcué Chocué (ICETEX)',
    cobertura: 'Créditos condonables para matrícula y sostenimiento.',
    quienes: 'Estudiantes pertenecientes a comunidades indígenas.',
    link: 'https://web.icetex.gov.co/prensa/especiales/fondo-de-comunidades-indigenas-alvaro-ulcue-chocue',
    destacada: false,
  },
  {
    id: 'comunidades-negras',
    nombre: 'Fondo de Comunidades Negras (ICETEX)',
    cobertura: 'Créditos condonables para matrícula y sostenimiento.',
    quienes: 'Estudiantes de comunidades negras, afrocolombianas, raizales y palenqueras.',
    link: 'https://web.icetex.gov.co/es/-/comunidades-negras',
    destacada: false,
  },
  {
    id: 'jovenes-a-la-u',
    nombre: 'Jóvenes a la U (Bogotá — Agencia Atenea)',
    cobertura: 'Matrícula y apoyo de sostenimiento en programas de IES aliadas.',
    quienes: 'Jóvenes residentes en Bogotá, priorizados por condiciones socioeconómicas.',
    link: 'https://agenciaatenea.gov.co',
    destacada: false,
  },
  {
    id: 'becas-universidad',
    nombre: 'Becas y apoyos propios de cada universidad',
    cobertura:
      'Monitorías, becas de alimentación y transporte, residencias universitarias, exención de matrícula por mérito.',
    quienes:
      'Consulta la oficina de Bienestar Universitario de cada institución — casi todas las públicas tienen apoyos que pocos estudiantes conocen.',
    link: null,
    destacada: false,
  },
  {
    id: 'fondos-territoriales',
    nombre: 'Fondos departamentales y municipales',
    cobertura: 'Matrícula y/o sostenimiento según el ente territorial.',
    quienes:
      'Muchas gobernaciones y alcaldías tienen fondos propios (pregunta en la Secretaría de Educación de tu departamento o municipio).',
    link: null,
    destacada: false,
  },
];
