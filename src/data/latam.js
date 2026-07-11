// Selección CURADA de universidades de Latinoamérica que un estudiante
// colombiano realmente considera (las más reconocidas por país). No pretende
// ser exhaustiva. Cada sistema de admisión es distinto; la nota lo explica y el
// link oficial es siempre el protagonista. El `ranking` aquí es la posición
// aproximada en el QS Latin America University Rankings (orientativo).
//
// IMPORTANTE: la matrícula/costos y fechas varían por país y convocatoria →
// verificado: null y siempre remitir al sitio oficial.

const FECHAS_INTL = {
  texto:
    'El calendario de admisión varía por país y por universidad (muchas abren una o dos convocatorias al año). Consulta las fechas exactas en el sitio oficial de admisiones.',
  verificado: null,
};

const PASOS_INTL = [
  'Verifica en el sitio oficial los requisitos para estudiantes extranjeros (visa de estudiante, convalidación del bachillerato/apostilla, examen de idioma si aplica).',
  'Revisa el proceso de admisión del país: en varios es por examen nacional o propio de la universidad.',
  'Prepara la documentación: diploma y notas apostillados, pasaporte, y prueba de suficiencia (idioma o examen de ingreso).',
  'Inscríbete dentro de las fechas de la convocatoria y paga los derechos si aplica.',
  'Si eres admitido: tramita la visa de estudiante y organiza sostenimiento (los costos de vida cuentan tanto como la matrícula).',
];

const costoIntl = (nota) => ({ valor: null, nota, verificado: null });

// zona = país (para mostrarlo en la tarjeta donde Colombia muestra su región).
const U = (o) => ({
  tipoAdmision: 'internacional',
  selectividad: 'alta',
  pasos: PASOS_INTL,
  fechas: FECHAS_INTL,
  ...o,
});

export const LATAM = [
  U({
    id: 'mx-unam', nombre: 'Universidad Nacional Autónoma de México', sigla: 'UNAM',
    ciudad: 'Ciudad de México', pais: 'México', zona: 'México', tipo: 'pública', ranking: 2,
    web: 'https://www.unam.mx', admisiones: 'https://www.escolar.unam.mx',
    notaAdmision:
      'Pública y gratuita/de cuota simbólica. Admisión por EXAMEN de selección propio, muy competido. Para extranjeros exige revalidación de estudios y trámite migratorio.',
    costoInscripcion: costoIntl('Pública: matrícula de cuota simbólica para nacionales; los extranjeros pagan cuotas y deben cubrir sostenimiento y visa. Verifica el costo del examen y de la cuota vigente.'),
    programas: ['Medicina', 'Derecho', 'Ingeniería', 'Arquitectura', 'Psicología', 'Economía', 'Biología', 'Física', 'Química', 'Ciencias de la Computación', 'Relaciones Internacionales', 'Diseño'],
  }),
  U({
    id: 'mx-tec', nombre: 'Tecnológico de Monterrey', sigla: 'Tec de Monterrey',
    ciudad: 'Monterrey (y campus nacionales)', pais: 'México', zona: 'México', tipo: 'privada', ranking: 4,
    web: 'https://tec.mx', admisiones: 'https://admision.tec.mx',
    notaAdmision:
      'Privada de alto prestigio. Admisión por proceso propio (prueba PAA/examen) y con amplio programa de becas por mérito, incluso para extranjeros.',
    costoInscripcion: costoIntl('Privada de matrícula alta; su fuerte son las becas por mérito (Líderes del Mañana y otras). Revisa becas para extranjeros.'),
    programas: ['Ingeniería', 'Medicina', 'Negocios', 'Derecho', 'Arquitectura', 'Ciencias de la Computación', 'Biotecnología', 'Comunicación', 'Diseño', 'Relaciones Internacionales'],
  }),
  U({
    id: 'ar-uba', nombre: 'Universidad de Buenos Aires', sigla: 'UBA',
    ciudad: 'Buenos Aires', pais: 'Argentina', zona: 'Argentina', tipo: 'pública', ranking: 3,
    web: 'https://www.uba.ar', admisiones: 'https://www.uba.ar/internacionales',
    notaAdmision:
      'Pública y GRATUITA, incluso para extranjeros (una de las razones por las que muchos colombianos la eligen). El primer año suele ser un Ciclo Básico Común (CBC) de nivelación, sin examen de corte.',
    costoInscripcion: costoIntl('Matrícula de grado GRATUITA para nacionales y extranjeros. El costo real es el sostenimiento en Buenos Aires y el trámite migratorio.'),
    programas: ['Medicina', 'Derecho', 'Ingeniería', 'Arquitectura', 'Psicología', 'Economía', 'Ciencias de la Computación', 'Odontología', 'Veterinaria', 'Diseño', 'Comunicación'],
  }),
  U({
    id: 'ar-unlp', nombre: 'Universidad Nacional de La Plata', sigla: 'UNLP',
    ciudad: 'La Plata', pais: 'Argentina', zona: 'Argentina', tipo: 'pública', ranking: 12,
    web: 'https://www.unlp.edu.ar', admisiones: 'https://unlp.edu.ar/pregrado/',
    notaAdmision: 'Pública y gratuita, también para extranjeros. Ingreso con curso/nivelación según la facultad, sin examen de corte alto.',
    costoInscripcion: costoIntl('Matrícula de grado gratuita. Considera sostenimiento y visa de estudiante.'),
    programas: ['Medicina', 'Derecho', 'Ingeniería', 'Arquitectura', 'Veterinaria', 'Psicología', 'Bellas Artes', 'Informática', 'Astronomía', 'Comunicación'],
  }),
  U({
    id: 'cl-uchile', nombre: 'Universidad de Chile', sigla: 'UChile',
    ciudad: 'Santiago', pais: 'Chile', zona: 'Chile', tipo: 'pública', ranking: 5,
    web: 'https://www.uchile.cl', admisiones: 'https://www.uchile.cl/admision',
    notaAdmision:
      'Pública de gran prestigio. Admisión por la prueba nacional PAES; para extranjeros hay vías especiales y convalidación. Existen gratuidad y becas según situación socioeconómica.',
    costoInscripcion: costoIntl('Aplica "Gratuidad" chilena y becas para quienes califican; los extranjeros deben revisar su elegibilidad. Considera costo de vida en Santiago.'),
    programas: ['Medicina', 'Derecho', 'Ingeniería', 'Arquitectura', 'Psicología', 'Economía', 'Odontología', 'Veterinaria', 'Ciencias', 'Artes'],
  }),
  U({
    id: 'cl-puc', nombre: 'Pontificia Universidad Católica de Chile', sigla: 'UC Chile',
    ciudad: 'Santiago', pais: 'Chile', zona: 'Chile', tipo: 'privada', ranking: 1,
    web: 'https://www.uc.cl', admisiones: 'https://admision.uc.cl',
    notaAdmision:
      'La mejor rankeada de Latinoamérica según QS. Privada; admisión por prueba PAES y proceso propio. Tiene becas y opciones para extranjeros.',
    costoInscripcion: costoIntl('Privada de arancel alto, con becas por mérito y necesidad. Revisa condiciones para extranjeros.'),
    programas: ['Medicina', 'Ingeniería', 'Derecho', 'Arquitectura', 'Economía', 'Psicología', 'Diseño', 'Ciencias de la Computación', 'Odontología', 'Agronomía'],
  }),
  U({
    id: 'br-usp', nombre: 'Universidade de São Paulo', sigla: 'USP',
    ciudad: 'São Paulo', pais: 'Brasil', zona: 'Brasil', tipo: 'pública', ranking: 6,
    web: 'https://www5.usp.br', admisiones: 'https://www.fuvest.br',
    notaAdmision:
      'Pública y GRATUITA, la más grande de Brasil. Ingreso por el examen FUVEST (en portugués) o vías para extranjeros; requiere dominio del portugués.',
    costoInscripcion: costoIntl('Matrícula GRATUITA. El reto es el examen FUVEST en portugués y el sostenimiento en São Paulo.'),
    programas: ['Medicina', 'Ingeniería', 'Derecho', 'Arquitectura', 'Economía', 'Ciencias de la Computación', 'Odontología', 'Veterinaria', 'Física', 'Relaciones Internacionales'],
  }),
  U({
    id: 'br-unicamp', nombre: 'Universidade Estadual de Campinas', sigla: 'Unicamp',
    ciudad: 'Campinas', pais: 'Brasil', zona: 'Brasil', tipo: 'pública', ranking: 8,
    web: 'https://www.unicamp.br', admisiones: 'https://www.comvest.unicamp.br',
    notaAdmision: 'Pública y gratuita. Ingreso por vestibular propio (Comvest), en portugués. Fuerte en ciencias e ingeniería.',
    costoInscripcion: costoIntl('Matrícula gratuita; examen de ingreso en portugués. Considera sostenimiento y visa.'),
    programas: ['Ingeniería', 'Medicina', 'Ciencias de la Computación', 'Física', 'Química', 'Economía', 'Arquitectura', 'Lingüística', 'Biología'],
  }),
  U({
    id: 'pe-pucp', nombre: 'Pontificia Universidad Católica del Perú', sigla: 'PUCP',
    ciudad: 'Lima', pais: 'Perú', zona: 'Perú', tipo: 'privada', ranking: 15,
    web: 'https://www.pucp.edu.pe', admisiones: 'https://www.pucp.edu.pe/admision/',
    notaAdmision: 'La privada más reconocida del Perú. Admisión por evaluación propia; primeros años por Estudios Generales. Becas por mérito disponibles.',
    costoInscripcion: costoIntl('Privada por escalas de pago según situación socioeconómica; tiene becas. Revisa condiciones para extranjeros.'),
    programas: ['Ingeniería', 'Derecho', 'Economía', 'Arquitectura', 'Comunicación', 'Psicología', 'Ciencias de la Computación', 'Gestión', 'Arte', 'Ciencias Sociales'],
  }),
  U({
    id: 'pe-unmsm', nombre: 'Universidad Nacional Mayor de San Marcos', sigla: 'UNMSM',
    ciudad: 'Lima', pais: 'Perú', zona: 'Perú', tipo: 'pública', ranking: 28,
    web: 'https://www.unmsm.edu.pe', admisiones: 'https://admision.unmsm.edu.pe',
    notaAdmision: 'La universidad más antigua de América. Pública, ingreso por examen de admisión muy competido.',
    costoInscripcion: costoIntl('Pública de bajo costo para nacionales; examen de admisión competido. Extranjeros: revisar requisitos y sostenimiento.'),
    programas: ['Medicina', 'Derecho', 'Ingeniería', 'Economía', 'Educación', 'Ciencias Biológicas', 'Química', 'Farmacia', 'Ciencias Sociales'],
  }),
  U({
    id: 'uy-udelar', nombre: 'Universidad de la República', sigla: 'UdelaR',
    ciudad: 'Montevideo', pais: 'Uruguay', zona: 'Uruguay', tipo: 'pública', ranking: 22,
    web: 'https://udelar.edu.uy', admisiones: 'https://udelar.edu.uy/portal/inicio-de-cursos/',
    notaAdmision:
      'Pública y GRATUITA, con ingreso irrestricto (sin examen de corte) en la mayoría de carreras. Atractiva para extranjeros por eso.',
    costoInscripcion: costoIntl('Matrícula gratuita e ingreso sin examen de corte en la mayoría de carreras. Considera sostenimiento y visa.'),
    programas: ['Medicina', 'Derecho', 'Ingeniería', 'Arquitectura', 'Psicología', 'Economía', 'Veterinaria', 'Ciencias', 'Bellas Artes', 'Comunicación'],
  }),
  U({
    id: 'cr-ucr', nombre: 'Universidad de Costa Rica', sigla: 'UCR',
    ciudad: 'San José', pais: 'Costa Rica', zona: 'Costa Rica', tipo: 'pública', ranking: 25,
    web: 'https://www.ucr.ac.cr', admisiones: 'https://admision.ucr.ac.cr',
    notaAdmision: 'La principal pública de Costa Rica. Admisión por Prueba de Aptitud Académica propia; con sistema de becas socioeconómicas.',
    costoInscripcion: costoIntl('Pública con matrícula por sistema de becas según ingresos; examen de admisión propio. Revisar condiciones para extranjeros.'),
    programas: ['Medicina', 'Derecho', 'Ingeniería', 'Arquitectura', 'Psicología', 'Economía', 'Biología', 'Computación', 'Comunicación', 'Farmacia'],
  }),
  U({
    id: 'ec-usfq', nombre: 'Universidad San Francisco de Quito', sigla: 'USFQ',
    ciudad: 'Quito', pais: 'Ecuador', zona: 'Ecuador', tipo: 'privada', ranking: 30,
    web: 'https://www.usfq.edu.ec', admisiones: 'https://www.usfq.edu.ec/es/admisiones',
    notaAdmision: 'Privada de artes liberales reconocida en la región (dueña de la estación de Galápagos). Admisión por proceso propio; becas por mérito.',
    costoInscripcion: costoIntl('Privada con arancel; ofrece becas por mérito y necesidad. Revisar condiciones para extranjeros.'),
    programas: ['Medicina', 'Ingeniería', 'Administración', 'Derecho', 'Biología', 'Arquitectura', 'Comunicación', 'Artes', 'Relaciones Internacionales'],
  }),
  U({
    id: 'mx-uam', nombre: 'Universidad Autónoma Metropolitana', sigla: 'UAM',
    ciudad: 'Ciudad de México', pais: 'México', zona: 'México', tipo: 'pública', ranking: 40,
    web: 'https://www.uam.mx', admisiones: 'https://www.uam.mx/admision/',
    notaAdmision: 'Pública mexicana de prestigio. Admisión por examen de selección propio.',
    costoInscripcion: costoIntl('Pública de cuota baja para nacionales; examen de selección. Extranjeros: revisar revalidación y visa.'),
    programas: ['Ingeniería', 'Medicina', 'Diseño', 'Economía', 'Sociología', 'Biología', 'Química', 'Administración', 'Comunicación'],
  }),
  U({
    id: 'cl-usach', nombre: 'Universidad de Santiago de Chile', sigla: 'USACH',
    ciudad: 'Santiago', pais: 'Chile', zona: 'Chile', tipo: 'pública', ranking: 35,
    web: 'https://www.usach.cl', admisiones: 'https://admision.usach.cl',
    notaAdmision: 'Pública chilena fuerte en ingeniería. Admisión por prueba nacional PAES; aplican gratuidad y becas para quienes califican.',
    costoInscripcion: costoIntl('Aplica gratuidad/becas chilenas según elegibilidad. Considera costo de vida en Santiago.'),
    programas: ['Ingeniería', 'Medicina', 'Administración', 'Derecho', 'Arquitectura', 'Química', 'Física', 'Periodismo'],
  }),
  U({
    id: 'ar-utn', nombre: 'Universidad Tecnológica Nacional', sigla: 'UTN',
    ciudad: 'Buenos Aires (y regionales)', pais: 'Argentina', zona: 'Argentina', tipo: 'pública', ranking: 45,
    web: 'https://www.utn.edu.ar', admisiones: 'https://www.utn.edu.ar/es/estudiar-utn',
    notaAdmision: 'Pública y gratuita especializada en ingeniería, con sedes en todo el país. Ingreso con curso de nivelación.',
    costoInscripcion: costoIntl('Matrícula de grado gratuita, también para extranjeros. Considera sostenimiento y visa.'),
    programas: ['Ingeniería en Sistemas de Información', 'Ingeniería Civil', 'Ingeniería Industrial', 'Ingeniería Electrónica', 'Ingeniería Mecánica', 'Ingeniería Química'],
  }),
];
