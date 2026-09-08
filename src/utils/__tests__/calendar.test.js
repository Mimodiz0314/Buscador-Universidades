import { describe, it, expect } from 'vitest';
import { formatearFechaParaCalendar, generarUrlGoogleCalendar, generarDataUriIcs } from '../calendar.js';

describe('calendar utils', () => {
  it('formatea fechas a YYYYMMDD', () => {
    expect(formatearFechaParaCalendar('2026-09-20')).toBe('20260920');
    expect(formatearFechaParaCalendar('')).toBe('');
  });

  it('genera URL correcta de Google Calendar', () => {
    const url = generarUrlGoogleCalendar({
      titulo: 'Examen de Admisión UNAL',
      descripcion: 'Llevar documento de identidad y credencial.',
      ubicacion: 'Campus Bogotá',
      fechaInicio: '2026-09-20',
      fechaFin: '2026-09-20'
    });

    expect(url).toContain('https://calendar.google.com/calendar/render');
    expect(url).toContain('text=Examen+de+Admisi%C3%B3n+UNAL');
    expect(url).toContain('dates=20260920%2F20260920');
  });

  it('genera Data URI válida para archivo iCal (.ics)', () => {
    const dataUri = generarDataUriIcs({
      titulo: 'Cierre PIN UdeA',
      descripcion: 'Último día de pago de derechos.',
      ubicacion: 'Medellín',
      fechaInicio: '2026-09-14'
    });

    expect(dataUri).toContain('data:text/calendar;charset=utf-8,');
    expect(dataUri).toContain('Cierre%20PIN%20UdeA');
  });
});
