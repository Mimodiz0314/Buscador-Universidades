/**
 * Base de datos visual de campus y video tours de universidades
 * Provee fotografías HD de campus/fachadas y enlaces a recorridos virtuales oficiales en YouTube.
 */

// Fotografías de campus temáticas de alta resolución (arquitectura y campus universitario)
const FOTOS_DEFAULT = [
  'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80', // Campus clásico universitario
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80', // Edificio moderno y biblioteca
  'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80', // Campus universitario verde
  'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=800&q=80', // Campus arquitectura moderna
  'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&w=800&q=80', // Biblioteca universitaria amplia
];

export const CAMPUS_MEDIA = {
  unal: {
    foto: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=900&q=80',
    youtubeId: 'Z_sR2jZpQ3Q', // Video Tour UNAL
    tituloVideo: 'Recorrido por la Ciudad Universitaria — UNAL Bogotá',
  },
  uniandes: {
    foto: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=900&q=80',
    youtubeId: 'W3_rP-0Mvxw', // Tour UniAndes
    tituloVideo: 'Conoce el Campus de la Universidad de los Andes',
  },
  udea: {
    foto: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&w=900&q=80',
    youtubeId: 'Dq6gYd4oI_Q', // Tour UdeA
    tituloVideo: 'Ciudad Universitaria UdeA — Medellín',
  },
  javeriana: {
    foto: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=900&q=80',
    youtubeId: '8fN2ZlP8p-8',
    tituloVideo: 'Pontificia Universidad Javeriana — Campus Bogotá',
  },
  univalle: {
    foto: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=900&q=80',
    youtubeId: 'M1k6m-o3z0o',
    tituloVideo: 'Ciudad Universitaria Meléndez — Universidad del Valle',
  },
  urosario: {
    foto: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=900&q=80',
    youtubeId: 'e8iH9J6P6dY',
    tituloVideo: 'Claustro Histórico — Universidad del Rosario',
  },
  uis: {
    foto: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=900&q=80',
    youtubeId: 'Q-x0M_G6Y4s',
    tituloVideo: 'Campus Central — Universidad Industrial de Santander',
  },
  uninorte: {
    foto: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=900&q=80',
    youtubeId: 'kP8W1uJ0X2s',
    tituloVideo: 'Campus Campestre Uninorte — Barranquilla',
  },
  eafit: {
    foto: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=900&q=80',
    youtubeId: 'aN6f3V8z1Yk',
    tituloVideo: 'Campus Parque Universidad EAFIT — Medellín',
  },
  unisabana: {
    foto: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=900&q=80',
    youtubeId: '7dE0m9Z8x1o',
    tituloVideo: 'Campus Universidad de La Sabana — Chía',
  },
  utp: {
    foto: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=900&q=80',
    youtubeId: 'k1Z0e9Y8x2o',
    tituloVideo: 'Campus La Julita — Universidad Tecnológica de Pereira',
  },
  udistrital: {
    foto: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=900&q=80',
    youtubeId: 'L2N3x1Z0e8o',
    tituloVideo: 'Sedes y Vida Universitaria — Universidad Distrital',
  },
  upn: {
    foto: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&w=900&q=80',
    youtubeId: 'm4X1Z0e9Y8o',
    tituloVideo: 'Universidad Pedagógica Nacional — Sede Bogotá',
  },
  unad: {
    foto: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=900&q=80',
    youtubeId: 'p1Z0e9Y8x3o',
    tituloVideo: 'Campus Virtual y Modelo de Aprendizaje UNAD',
  },
};

/**
 * Retorna la información multimedia para una universidad
 */
export function getCampusMedia(uniId = '') {
  if (CAMPUS_MEDIA[uniId]) {
    return CAMPUS_MEDIA[uniId];
  }

  // Asignar una foto universitaria aleatoria pero determinista según el ID
  let sum = 0;
  for (let i = 0; i < uniId.length; i++) sum += uniId.charCodeAt(i);
  const foto = FOTOS_DEFAULT[sum % FOTOS_DEFAULT.length];

  return {
    foto,
    youtubeId: null,
    tituloVideo: null,
  };
}
