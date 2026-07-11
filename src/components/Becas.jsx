import { BECAS } from '../data/becas.js';

export default function Becas() {
  return (
    <div className="space-y-4">
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-5 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
        <h2 className="text-sm font-bold text-[#111827]">Oportunidades de Becas y Apoyos Estatales / Privados</h2>
        <p className="mt-1 text-xs text-[#6B7280]">
          Recuerda: la matrícula de pregrado en universidades públicas es de $0 COP para la mayoría de estudiantes gracias a la Política de Gratuidad del Gobierno Nacional. Los siguientes programas complementan este beneficio cubriendo sostenimiento, transporte o matrícula en universidades privadas.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {BECAS.map((b) => (
          <div
            key={b.id}
            className={`rounded border p-4 transition-colors ${
              b.destacada 
                ? 'bg-emerald-50/40 border-emerald-200' 
                : 'bg-white border-[#E5E7EB]'
            }`}
          >
            <h3 className="text-xs font-bold text-[#111827] flex items-center gap-1.5">
              {b.destacada && (
                <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-emerald-600">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              )}
              <span>{b.nombre}</span>
            </h3>
            <div className="mt-2 space-y-1 text-xs">
              <p className="text-[#4B5563]">
                <strong className="text-[#111827]">Cobertura:</strong> {b.cobertura}
              </p>
              <p className="text-[#4B5563]">
                <strong className="text-[#111827]">Población Objetivo:</strong> {b.quienes}
              </p>
            </div>
            {b.link && (
              <a
                href={b.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block text-[11px] font-bold text-[#0369A1] hover:underline"
              >
                Sitio oficial del programa →
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
