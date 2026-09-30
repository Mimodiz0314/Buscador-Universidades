import { useEffect, useState } from 'react';

// Chrome/Android avisa UNA sola vez, apenas carga la página, que la app se puede
// instalar (evento "beforeinstallprompt"). Se guarda aquí, al importar el módulo,
// para que el botón "Instalar" funcione aunque el usuario lo pulse minutos después.
let eventoInstalacion = null;
const oyentes = new Set();
const avisar = () => oyentes.forEach((fn) => fn());

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    eventoInstalacion = e;
    avisar();
  });
  window.addEventListener('appinstalled', () => {
    eventoInstalacion = null;
    avisar();
  });
}

export const yaInstalada = () => {
  try {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true
    );
  } catch {
    return false;
  }
};

export const esIOS = () => {
  try {
    const ua = window.navigator.userAgent || '';
    // iPadOS moderno se presenta como Mac con pantalla táctil.
    return /iphone|ipad|ipod/i.test(ua) || (/macintosh/i.test(ua) && navigator.maxTouchPoints > 1);
  } catch {
    return false;
  }
};

export function useInstalacion() {
  const [, forzar] = useState(0);
  useEffect(() => {
    const fn = () => forzar((n) => n + 1);
    oyentes.add(fn);
    return () => oyentes.delete(fn);
  }, []);

  const instalar = async () => {
    if (!eventoInstalacion) return false;
    const e = eventoInstalacion;
    eventoInstalacion = null;
    e.prompt();
    try { await e.userChoice; } catch {}
    avisar();
    return true;
  };

  return {
    puedeInstalarDirecto: !!eventoInstalacion,
    instalada: yaInstalada(),
    ios: esIOS(),
    instalar,
  };
}
