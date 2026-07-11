export const TAXONOMIA = [
  {
    area: 'Ingeniería, Arquitectura y Afines',
    icono: '⚙️', // We will use SVGs in App.jsx but provide emojis as fallback
    color: 'from-blue-100 to-indigo-100',
    textColor: 'text-indigo-800',
    descripcion: 'Diseño, construcción y tecnología para resolver problemas complejos.',
    subgrupos: [
      {
        nombre: 'Computación y Sistemas',
        carreras: ['Ingeniería de Sistemas', 'Ingeniería de Software', 'Ingeniería Informática', 'Ingeniería de Datos'],
        duracion: '9 - 10 semestres'
      },
      {
        nombre: 'Infraestructura',
        carreras: ['Ingeniería Civil', 'Ingeniería de Vías y Transportes'],
        duracion: '10 semestres'
      },
      {
        nombre: 'Procesos y Producción',
        carreras: ['Ingeniería Industrial', 'Ingeniería de Producción'],
        duracion: '10 semestres'
      },
      {
        nombre: 'Electrónica y Biomédica',
        carreras: ['Ingeniería Electrónica', 'Ingeniería Eléctrica', 'Ingeniería Mecatrónica', 'Ingeniería Biomédica'],
        duracion: '10 semestres'
      },
      {
        nombre: 'Tierra y Extracción',
        carreras: ['Ingeniería de Petróleos', 'Ingeniería de Minas', 'Ingeniería Metalúrgica', 'Ingeniería Geológica'],
        duracion: '10 semestres'
      },
      {
        nombre: 'Química y Ambiental',
        carreras: ['Ingeniería Química', 'Ingeniería Ambiental', 'Ingeniería Sanitaria', 'Ingeniería Agroindustrial'],
        duracion: '10 semestres'
      }
    ]
  },
  {
    area: 'Ciencias de la Educación',
    icono: '📚',
    color: 'from-amber-100 to-yellow-100',
    textColor: 'text-amber-800',
    descripcion: 'Formación de docentes y pedagogía para transformar la sociedad.',
    subgrupos: [
      {
        nombre: 'Educación Inicial y Básica',
        carreras: ['Licenciatura en Educación Infantil', 'Licenciatura en Pedagogía Infantil', 'Licenciatura en Educación Básica Primaria'],
        duracion: '10 semestres'
      },
      {
        nombre: 'Tecnología',
        carreras: ['Licenciatura en Tecnología e Informática', 'Licenciatura en Innovación Educativa'],
        duracion: '10 semestres'
      },
      {
        nombre: 'Ciencias Exactas',
        carreras: ['Licenciatura en Matemáticas', 'Licenciatura en Física', 'Licenciatura en Ciencias Naturales'],
        duracion: '10 semestres'
      },
      {
        nombre: 'Lenguas y Letras',
        carreras: ['Licenciatura en Lenguas Extranjeras (Inglés-Francés)', 'Licenciatura en Literatura y Lengua Castellana'],
        duracion: '10 semestres'
      },
      {
        nombre: 'Sociales y Deporte',
        carreras: ['Licenciatura en Ciencias Sociales', 'Licenciatura en Educación Física, Recreación y Deportes'],
        duracion: '10 semestres'
      }
    ]
  },
  {
    area: 'Ciencias de la Salud',
    icono: '⚕️',
    color: 'from-emerald-100 to-teal-100',
    textColor: 'text-teal-800',
    descripcion: 'Cuidado, prevención y bienestar físico y mental de la humanidad.',
    subgrupos: [
      {
        nombre: 'Medicina General',
        carreras: ['Medicina'],
        duracion: '12 - 14 semestres'
      },
      {
        nombre: 'Cuidado y Cirugía',
        carreras: ['Enfermería', 'Instrumentación Quirúrgica'],
        duracion: '10 semestres'
      },
      {
        nombre: 'Salud Oral',
        carreras: ['Odontología'],
        duracion: '10 semestres'
      },
      {
        nombre: 'Terapias y Mente',
        carreras: ['Psicología', 'Terapia Ocupacional', 'Fisioterapia', 'Fonoaudiología'],
        duracion: '10 semestres'
      },
      {
        nombre: 'Laboratorio y Nutrición',
        carreras: ['Bacteriología', 'Nutrición y Dietética'],
        duracion: '10 semestres'
      }
    ]
  },
  {
    area: 'Ciencias Sociales y Humanas',
    icono: '⚖️',
    color: 'from-rose-100 to-pink-100',
    textColor: 'text-rose-800',
    descripcion: 'Estudio de la sociedad, las leyes, la cultura y la comunicación.',
    subgrupos: [
      {
        nombre: 'Derecho y Política',
        carreras: ['Derecho', 'Ciencias Políticas', 'Gobernabilidad'],
        duracion: '10 semestres'
      },
      {
        nombre: 'Comunicaciones',
        carreras: ['Comunicación Social', 'Periodismo', 'Realización Audiovisual'],
        duracion: '9 - 10 semestres'
      },
      {
        nombre: 'Humanidades',
        carreras: ['Trabajo Social', 'Sociología', 'Antropología', 'Historia', 'Filosofía'],
        duracion: '10 semestres'
      },
      {
        nombre: 'Estudios Internacionales',
        carreras: ['Estudios Globales', 'Relaciones Internacionales'],
        duracion: '9 - 10 semestres'
      }
    ]
  },
  {
    area: 'Economía, Administración y Contaduría',
    icono: '📈',
    color: 'from-cyan-100 to-blue-100',
    textColor: 'text-cyan-800',
    descripcion: 'Gestión de organizaciones, finanzas y desarrollo económico.',
    subgrupos: [
      {
        nombre: 'Gestión y Negocios',
        carreras: ['Administración de Empresas', 'Administración Pública', 'Negocios Internacionales'],
        duracion: '9 - 10 semestres'
      },
      {
        nombre: 'Contabilidad',
        carreras: ['Contaduría Pública', 'Auditoría'],
        duracion: '9 - 10 semestres'
      },
      {
        nombre: 'Economía y Finanzas',
        carreras: ['Economía', 'Finanzas', 'Ingeniería Financiera'],
        duracion: '9 - 10 semestres'
      }
    ]
  },
  {
    area: 'Ciencias Exactas y Naturales',
    icono: '🔬',
    color: 'from-purple-100 to-fuchsia-100',
    textColor: 'text-purple-800',
    descripcion: 'Investigación pura de las matemáticas, la química y la vida.',
    subgrupos: [
      {
        nombre: 'Ciencias de la Vida',
        carreras: ['Biología', 'Microbiología', 'Biotecnología'],
        duracion: '10 semestres'
      },
      {
        nombre: 'Química',
        carreras: ['Química', 'Química Farmacéutica'],
        duracion: '10 semestres'
      },
      {
        nombre: 'Física y Matemáticas',
        carreras: ['Física', 'Matemáticas', 'Estadística'],
        duracion: '10 semestres'
      }
    ]
  },
  {
    area: 'Agronomía, Veterinaria y Afines',
    icono: '🌱',
    color: 'from-lime-100 to-green-100',
    textColor: 'text-green-800',
    descripcion: 'Cuidado animal, agricultura y gestión sostenible del campo.',
    subgrupos: [
      {
        nombre: 'Salud Animal',
        carreras: ['Medicina Veterinaria', 'Zootecnia'],
        duracion: '10 - 12 semestres'
      },
      {
        nombre: 'Agro y Bosques',
        carreras: ['Ingeniería Agronómica', 'Ingeniería Forestal', 'Administración Agropecuaria'],
        duracion: '10 semestres'
      }
    ]
  },
  {
    area: 'Bellas Artes',
    icono: '🎨',
    color: 'from-fuchsia-100 to-pink-100',
    textColor: 'text-fuchsia-800',
    descripcion: 'Expresión estética, visual, musical y escénica.',
    subgrupos: [
      {
        nombre: 'Diseño',
        carreras: ['Diseño Gráfico', 'Diseño Industrial', 'Diseño de Modas'],
        duracion: '8 - 10 semestres'
      },
      {
        nombre: 'Artes Escénicas y Plásticas',
        carreras: ['Artes Plásticas', 'Música', 'Cine y Televisión', 'Teatro'],
        duracion: '8 - 10 semestres'
      }
    ]
  }
];
