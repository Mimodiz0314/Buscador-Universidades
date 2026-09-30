// Fechas clave de una convocatoria (procesos.js → fechasClave).
// Marca las que ya pasaron, resalta la próxima y cuenta los días que faltan.
// fechasClave: [{ evento, fecha: 'YYYY-MM-DD', hasta?: 'YYYY-MM-DD' }]

const dias = (desde, hasta) => Math.round((Date.parse(hasta + 'T00:00:00Z') - Date.parse(desde + 'T00:00:00Z')) / 86400000);

export function analizarFechas(fechasClave = [], hoy) {
  const items = [...fechasClave]
    .sort((a, b) => a.fecha.localeCompare(b.fecha))
    .map((f) => {
      const fin = f.hasta || f.fecha;
      const enCurso = f.fecha <= hoy && hoy <= fin;
      return { ...f, pasada: fin < hoy, enCurso, diasFaltan: dias(hoy, f.fecha) };
    });
  const proxima = items.find((f) => !f.pasada) || null;
  return {
    items: items.map((f) => ({ ...f, esProxima: f === proxima })),
    proxima,
    terminada: items.length > 0 && !proxima,
  };
}
