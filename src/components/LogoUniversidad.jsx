/**
 * LogoUniversidad
 * - Primario: Google S2 Favicon API (?sz=256) — accesible universalmente, sin CORS.
 * - Fallback: iniciales procedurales si la imagen no carga.
 */
import { useState } from 'react';

const PALETAS = [
  { bg: '#1e3a5f', text: '#93c5fd' },
  { bg: '#14532d', text: '#86efac' },
  { bg: '#7c2d12', text: '#fdba74' },
  { bg: '#3b0764', text: '#d8b4fe' },
  { bg: '#0c4a6e', text: '#7dd3fc' },
  { bg: '#1c1917', text: '#d6d3d1' },
  { bg: '#0f172a', text: '#38bdf8' },
  { bg: '#064e3b', text: '#34d399' },
];

function getPaleta(id = '') {
  let sum = 0;
  for (let i = 0; i < id.length; i++) sum += id.charCodeAt(i);
  return PALETAS[sum % PALETAS.length];
}

function getIniciales(sigla = '', nombre = '') {
  if (sigla && sigla.length <= 5) return sigla.toUpperCase();
  const palabras = (nombre || '').split(' ').filter(p => p.length > 2);
  return palabras.slice(0, 3).map(p => p[0]).join('').toUpperCase() || sigla.slice(0, 4).toUpperCase();
}

const FONT_SIZES = {
  sm:  { text: '9px',  fw: '700' },
  md:  { text: '14px', fw: '800' },
  lg:  { text: '28px', fw: '900' },
};

export default function LogoUniversidad({ url, sigla, nombre, uniId, size = 'md', className }) {
  const [imgError, setImgError] = useState(false);
  const [localFailed, setLocalFailed] = useState(false);
  const paleta = getPaleta(uniId || sigla);
  const iniciales = getIniciales(sigla, nombre);
  const fs = FONT_SIZES[size] || FONT_SIZES.md;

  const getDomain = (webUrl = '') => {
    try { return new URL(webUrl).hostname.replace('www.', ''); }
    catch { return ''; }
  };

  const domain = getDomain(url);
  // Google S2 Favicon API — alta disponibilidad, no requiere API key
  const s2Src = `https://www.google.com/s2/favicons?domain=${domain}&sz=256`;
  const localSrc = uniId ? `/logos/${uniId}.png` : s2Src;

  const logoSrc = localFailed ? s2Src : localSrc;

  const containerClass = {
    sm: 'w-9 h-9',
    md: 'w-20 h-20',
    lg: 'w-36 h-36 sm:w-48 sm:h-48',
  }[size] || 'w-20 h-20';

  if (imgError || (!domain && localFailed)) {
    // Fallback: avatar de iniciales
    return (
      <div
        className={`${containerClass} rounded-full flex items-center justify-center shrink-0 select-none ${className || ''}`}
        style={{ backgroundColor: paleta.bg }}
        title={nombre || sigla}
      >
        <span style={{ color: paleta.text, fontSize: fs.text, fontWeight: fs.fw, letterSpacing: '-0.03em', lineHeight: 1, fontFamily: '"Inter","Segoe UI",system-ui,sans-serif' }}>
          {iniciales}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`${containerClass} rounded-full bg-white flex items-center justify-center shrink-0 overflow-hidden ${className || ''}`}
      style={{ padding: size === 'lg' ? '12px' : size === 'md' ? '8px' : '4px' }}
      title={nombre || sigla}
    >
      <img
        src={logoSrc}
        alt={sigla || nombre}
        className="w-full h-full object-contain"
        loading="lazy"
        onError={() => {
          if (!localFailed) {
            setLocalFailed(true);
          } else {
            setImgError(true);
          }
        }}
      />
    </div>
  );
}
