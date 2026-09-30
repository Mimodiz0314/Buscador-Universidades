// Navegación por la dirección (#/...): permite el botón Atrás del celular,
// compartir el enlace de una universidad y QR que abren una sección directa.
//   #/                 inicio
//   #/u/<id>           ficha de una universidad
//   #/proceso/<id>     guía de inscripción de una universidad
//   #/<pestaña>        cualquier otra pestaña (simulador, test, ruta…)

export const PESTANAS = ['buscar', 'lineatiempo', 'comparar', 'gratuidad', 'proceso', 'simulador', 'explorar', 'test', 'becas', 'acerca', 'ruta'];

export function leerRuta(hash = '') {
  const partes = hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
  if (partes[0] === 'u' && partes[1]) return { pestana: 'buscar', uniId: partes[1], procesoUni: null };
  if (partes[0] === 'proceso') return { pestana: 'proceso', uniId: null, procesoUni: partes[1] || null };
  if (PESTANAS.includes(partes[0])) return { pestana: partes[0], uniId: null, procesoUni: null };
  return { pestana: 'buscar', uniId: null, procesoUni: null };
}

export function escribirRuta({ pestana, uniId, procesoUni }) {
  if (uniId) return `#/u/${encodeURIComponent(uniId)}`;
  if (pestana === 'proceso' && procesoUni) return `#/proceso/${encodeURIComponent(procesoUni)}`;
  if (!pestana || pestana === 'buscar') return '#/';
  return `#/${pestana}`;
}

export const URL_PUBLICA = 'https://uniscoop.vercel.app/';
export const enlaceUniversidad = (id) => `${URL_PUBLICA}#/u/${encodeURIComponent(id)}`;

// Compartir: usa el menú nativo del celular; si no existe, abre WhatsApp.
export async function compartir({ titulo, texto, url }) {
  try {
    if (navigator.share) {
      await navigator.share({ title: titulo, text: texto, url });
      return 'nativo';
    }
  } catch (e) {
    if (e?.name === 'AbortError') return 'cancelado';
  }
  window.open(`https://wa.me/?text=${encodeURIComponent(`${texto}\n${url}`)}`, '_blank', 'noopener');
  return 'whatsapp';
}
