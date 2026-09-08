import { useState } from 'react';
import { generarUrlGoogleCalendar } from '../utils/calendar.js';

export default function LineaTiempo({ onVerProceso }) {
  const [filtroTipo, setFiltroTipo] = useState('todas'); // 'todas' | 'publicas' | 'privadas'

  const hitos = [
    {
      id: 'udea-pin',
      uni: 'Universidad de Antioquia (UdeA)',
      sigla: 'UdeA',
      tipo: 'pública',
      fase: 'septiembre',
      mesTexto: 'Septiembre 2026',
      urgencia: 'urgente',
      titulo: 'Cierre de Pago e Inscripción (Convocatoria 2027-1)',
      fechaTexto: '14 de agosto al 14 de septiembre de 2026',
      fechaInicio: '2026-09-14',
      descripcion: 'Último plazo para generar y pagar los derechos de inscripción en línea o en banco para presentar el examen de admisión UdeA.',
      linkOficial: 'https://www.udea.edu.co/wps/portal/udea/web/inicio/estudiar-udea',
      uniId: 'udea'
    },
    {
      id: 'unal-examen',
      uni: 'Universidad Nacional de Colombia (UNAL)',
      sigla: 'UNAL',
      tipo: 'pública',
      fase: 'septiembre',
      mesTexto: 'Septiembre 2026',
      urgencia: 'clave',
      titulo: 'Presentación del Examen de Admisión Presencial',
      fechaTexto: 'Domingo 20 de septiembre de 2026',
      fechaInicio: '2026-09-20',
      descripcion: 'Presentación oficial de la prueba académica en la sede y salón asignados en tu credencial.',
      linkOficial: 'https://admisiones.unal.edu.co',
      uniId: 'unal'
    },
    {
      id: 'privadas-tempranas',
      uni: 'Universidades Privadas (Andes, Javeriana, Rosario, Sabana, EAFIT)',
      sigla: 'Privadas',
      tipo: 'privada',
      fase: 'septiembre',
      mesTexto: 'Septiembre 2026',
      urgencia: 'activo',
      titulo: 'Inscripciones Anticipadas y Admisiones 2027-1',
      fechaTexto: 'Abiertas durante todo septiembre',
      fechaInicio: '2026-09-01',
      fechaFin: '2026-09-30',
      descripcion: 'Periodo de postulaciones tempranas para asegurar cupo y aplicar a becas institucionales de excelencia académica.',
      linkOficial: 'https://uniandes.edu.co',
      uniId: 'uniandes'
    },
    {
      id: 'unal-puntajes',
      uni: 'Universidad Nacional de Colombia (UNAL)',
      sigla: 'UNAL',
      tipo: 'pública',
      fase: 'octubre',
      mesTexto: 'Octubre 2026',
      urgencia: 'clave',
      titulo: 'Puntajes e Inscripción de Carrera Curricular',
      fechaTexto: '1 al 6 de octubre de 2026',
      fechaInicio: '2026-10-01',
      fechaFin: '2026-10-06',
      descripcion: 'Consulta de tu puntaje del examen e inscripción obligatoria del programa académico al que aspiras.',
      linkOficial: 'https://admisiones.unal.edu.co',
      uniId: 'unal'
    },
    {
      id: 'unal-resultados',
      uni: 'Universidad Nacional de Colombia (UNAL)',
      sigla: 'UNAL',
      tipo: 'pública',
      fase: 'octubre',
      mesTexto: 'Octubre 2026',
      urgencia: 'activo',
      titulo: 'Publicación de Admitidos Oficiales UNAL',
      fechaTexto: '9 de octubre de 2026',
      fechaInicio: '2026-10-09',
      descripcion: 'Publicación de listas de aspirantes admitidos y apertura de envío de documentos para matrícula.',
      linkOficial: 'https://admisiones.unal.edu.co',
      uniId: 'unal'
    },
    {
      id: 'udea-examen',
      uni: 'Universidad de Antioquia (UdeA)',
      sigla: 'UdeA',
      tipo: 'pública',
      fase: 'octubre',
      mesTexto: 'Octubre 2026',
      urgencia: 'clave',
      titulo: 'Examen de Admisión Presencial y Virtual UdeA',
      fechaTexto: '26 y 27 de octubre de 2026',
      fechaInicio: '2026-10-26',
      fechaFin: '2026-10-27',
      descripcion: 'Presentación de la prueba de 80 preguntas (razonamiento lógico y competencia lectora). Credenciales disponibles del 14 al 22 de octubre.',
      linkOficial: 'https://www.udea.edu.co',
      uniId: 'udea'
    },
    {
      id: 'univalle-uis-apertura',
      uni: 'Universidad del Valle & Universidad Industrial de Santander',
      sigla: 'Univalle / UIS',
      tipo: 'pública',
      fase: 'octubre',
      mesTexto: 'Octubre - Noviembre 2026',
      urgencia: 'proximo',
      titulo: 'Apertura de Calendario Regular de Pregrado 2027-1',
      fechaTexto: 'Previsto: mediados de octubre a noviembre 2026',
      fechaInicio: '2026-10-15',
      descripcion: 'Venta de PIN de inscripción por resultados de examen Saber 11 (ICFES). Consulta periódica en sus portales de admisiones.',
      linkOficial: 'https://admisiones.univalle.edu.co',
      uniId: 'univalle'
    },
    {
      id: 'udea-resultados',
      uni: 'Universidad de Antioquia (UdeA)',
      sigla: 'UdeA',
      tipo: 'pública',
      fase: 'noviembre',
      mesTexto: 'Noviembre 2026',
      urgencia: 'activo',
      titulo: 'Publicación de Resultados de Admisión UdeA',
      fechaTexto: '11 de noviembre de 2026',
      fechaInicio: '2026-11-11',
      descripcion: 'Publicación de asignación de cupos según puntajes obtenidos entre tu primera y segunda opción de carrera.',
      linkOficial: 'https://www.udea.edu.co',
      uniId: 'udea'
    },
    {
      id: 'matriculas-gratuidad',
      uni: 'Sistema Universitario Estatal (SUE)',
      sigla: 'Nacional',
      tipo: 'pública',
      fase: 'diciembre',
      mesTexto: 'Diciembre 2026 - Enero 2027',
      urgencia: 'activo',
      titulo: 'Legalización de Matrícula y Aplicación de Gratuidad (Puedo Estudiar)',
      fechaTexto: 'Diciembre 2026 a enero 2027',
      fechaInicio: '2026-12-01',
      descripcion: 'Carga de documentos socioeconómicos (estrato o Sisbén) para formalizar la matrícula con 100% de subsidio estatal.',
      linkOficial: 'https://snies.mineducacion.gov.co',
      uniId: 'unal'
    }
  ];

  const hitosFiltrados = hitos.filter(h => {
    if (filtroTipo === 'publicas') return h.tipo === 'pública';
    if (filtroTipo === 'privadas') return h.tipo === 'privada';
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full mb-1">
            ⏱️ Cronograma Oficial de Admisiones
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Línea de Tiempo de Convocatorias
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Visualiza qué convocatorias están abiertas hoy, qué fechas vencen y cuáles abren el próximo mes.
          </p>
        </div>

        {/* Filtros */}
        <div className="flex bg-slate-100 p-1 rounded-xl gap-1 self-start sm:self-auto">
          {[
            { id: 'todas', label: 'Todas' },
            { id: 'publicas', label: 'Públicas' },
            { id: 'privadas', label: 'Privadas' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFiltroTipo(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filtroTipo === f.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="relative border-l-2 border-slate-200 ml-4 sm:ml-6 space-y-8 pb-12">
        {hitosFiltrados.map((hito) => {
          const calendarUrl = generarUrlGoogleCalendar({
            titulo: `${hito.sigla}: ${hito.titulo}`,
            descripcion: `${hito.descripcion}\nEnlace oficial: ${hito.linkOficial}`,
            ubicacion: hito.uni,
            fechaInicio: hito.fechaInicio,
            fechaFin: hito.fechaFin || hito.fechaInicio
          });

          const urgenciaBadge = {
            urgente: { bg: 'bg-rose-500', text: 'Cierre Próximo', dot: 'bg-rose-500' },
            clave: { bg: 'bg-indigo-600', text: 'Hito Crítico', dot: 'bg-indigo-600' },
            activo: { bg: 'bg-emerald-500', text: 'En Curso', dot: 'bg-emerald-500' },
            proximo: { bg: 'bg-amber-500', text: 'Próxima Apertura', dot: 'bg-amber-500' }
          }[hito.urgencia] || { bg: 'bg-slate-500', text: 'Activo', dot: 'bg-slate-500' };

          return (
            <div key={hito.id} className="relative pl-6 sm:pl-8 group">
              
              {/* Bullet circular en la línea de tiempo */}
              <div className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 border-white ${urgenciaBadge.dot} shadow-xs ring-4 ring-slate-50 transition-transform group-hover:scale-125`}></div>

              {/* Tarjeta del hito */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:shadow-md transition-shadow">
                
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase ${urgenciaBadge.bg}`}>
                      {urgenciaBadge.text}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {hito.mesTexto}
                    </span>
                  </div>
                  <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    hito.tipo === 'pública' ? 'bg-emerald-50 text-emerald-800' : 'bg-indigo-50 text-indigo-800'
                  }`}>
                    {hito.tipo}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  {hito.titulo}
                </h3>
                
                <p className="text-xs font-semibold text-blue-700 mt-1">
                  🏛️ {hito.uni}
                </p>

                <div className="mt-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex items-center gap-2 text-xs text-slate-700">
                  <span>📅</span>
                  <span className="font-bold">{hito.fechaTexto}</span>
                </div>

                <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                  {hito.descripcion}
                </p>

                {/* Acciones */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <a
                      href={calendarUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-lg transition-colors"
                      title="Agregar recordatorio a Google Calendar"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      Añadir a Google Calendar
                    </a>

                    {onVerProceso && hito.uniId && (
                      <button
                        onClick={() => onVerProceso(hito.uniId)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-lg transition-colors"
                      >
                        Guía de Inscripción
                      </button>
                    )}
                  </div>

                  <a
                    href={hito.linkOficial}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800 underline"
                  >
                    Portal Oficial ↗
                  </a>
                </div>

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
