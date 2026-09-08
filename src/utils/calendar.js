// Utilidades para generar eventos de calendario (Google Calendar y archivo iCal)
// Permite al estudiante sincronizar fechas clave de admisiones en su teléfono en 1 clic.

/**
 * Formatea una fecha YYYY-MM-DD a formato YYYYMMDD para Google Calendar
 * @param {string} fechaStr - 'YYYY-MM-DD'
 * @returns {string} - 'YYYYMMDD'
 */
export function formatearFechaParaCalendar(fechaStr) {
  if (!fechaStr) return '';
  return fechaStr.replace(/-/g, '');
}

/**
 * Genera una URL directa para crear un evento en Google Calendar
 * @param {Object} evento
 * @param {string} evento.titulo
 * @param {string} evento.descripcion
 * @param {string} evento.ubicacion
 * @param {string} evento.fechaInicio - 'YYYY-MM-DD'
 * @param {string} [evento.fechaFin] - 'YYYY-MM-DD' (opcional, por defecto el mismo día)
 * @returns {string} URL de Google Calendar
 */
export function generarUrlGoogleCalendar({ titulo, descripcion = '', ubicacion = '', fechaInicio, fechaFin }) {
  if (!titulo || !fechaInicio) return '';
  
  const start = formatearFechaParaCalendar(fechaInicio);
  const end = formatearFechaParaCalendar(fechaFin || fechaInicio);
  
  // Para eventos de día completo en Google Calendar, la fecha final debe ser al menos el día siguiente
  // pero formato YYYYMMDD/YYYYMMDD funciona para eventos de fecha completa
  const dates = `${start}/${end}`;

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: titulo,
    details: `${descripcion}\n\n— Generado por UniScoop (Buscador de Universidades)`,
    location: ubicacion,
    dates: dates
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Genera el contenido de un archivo .ics para descargar e importar en Apple Calendar o Outlook
 * @param {Object} evento
 * @returns {string} Data URI para descarga de archivo .ics
 */
export function generarDataUriIcs({ titulo, descripcion = '', ubicacion = '', fechaInicio, fechaFin }) {
  if (!titulo || !fechaInicio) return '';

  const start = formatearFechaParaCalendar(fechaInicio);
  const end = formatearFechaParaCalendar(fechaFin || fechaInicio);

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//UniScoop//Admisiones Universitarias//ES',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `SUMMARY:${titulo}`,
    `DESCRIPTION:${descripcion.replace(/\n/g, '\\n')}`,
    `LOCATION:${ubicacion}`,
    `DTSTART;VALUE=DATE:${start}`,
    `DTEND;VALUE=DATE:${end}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  return `data:text/calendar;charset=utf-8,${encodeURIComponent(icsContent)}`;
}
