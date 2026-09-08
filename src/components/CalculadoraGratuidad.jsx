import { useState } from 'react';

export default function CalculadoraGratuidad({ onExplorarPublicas }) {
  const [paso, setPaso] = useState(1);
  const [esColombiano, setEsColombiano] = useState(null);
  const [tieneTitulo, setTieneTitulo] = useState(null);
  const [criterioVulnerabilidad, setCriterioVulnerabilidad] = useState(null); // 'sisben' | 'estrato' | 'especial' | 'ninguno'
  const [grupoSisben, setGrupoSisben] = useState('A');
  const [estrato, setEstrato] = useState('1');

  // Evaluación de elegibilidad según la Ley 2307 de 2023 (Política de Gratuidad "Puedo Estudiar")
  const esElegible = esColombiano === true && tieneTitulo === false && criterioVulnerabilidad !== 'ninguno' && criterioVulnerabilidad !== null;

  function reiniciar() {
    setPaso(1);
    setEsColombiano(null);
    setTieneTitulo(null);
    setCriterioVulnerabilidad(null);
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6">
      
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-800 p-6 sm:p-8 text-white shadow-lg mb-8 relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-xs font-semibold px-3 py-1 rounded-full mb-3 backdrop-blur-xs">
          🏛️ Ley 2307 de 2023 — "Puedo Estudiar"
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Calculadora Oficial de Política de Gratuidad
        </h1>
        <p className="mt-2 text-sm sm:text-base text-emerald-100 max-w-2xl leading-relaxed">
          Descubre en 3 sencillas preguntas si tienes derecho a estudiar una carrera universitaria con <strong>100% de la matrícula cubierta por el Estado</strong> en cualquier universidad pública de Colombia.
        </p>
      </div>

      {/* Card del Wizard */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        
        {/* Barra de progreso */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            {[1, 2, 3].map((num) => (
              <div
                key={num}
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  paso === num
                    ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                    : paso > num
                    ? 'bg-emerald-100 text-emerald-700 font-semibold'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {paso > num ? '✓' : num}
              </div>
            ))}
          </div>
          <span className="text-xs font-medium text-slate-500">
            Paso {paso > 3 ? 3 : paso} de 3
          </span>
        </div>

        {/* PASO 1 */}
        {paso === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Pregunta 1</span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                ¿Eres de nacionalidad colombiana?
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                La Política de Gratuidad aplica para todos los ciudadanos colombianos que deseen cursar su pregrado.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => { setEsColombiano(true); setPaso(2); }}
                className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
                  esColombiano === true
                    ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-200'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span className="text-2xl">🇨🇴</span>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Sí, soy colombiano(a)</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Tengo cédula de ciudadanía o tarjeta de identidad colombiana.</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => { setEsColombiano(false); setPaso(2); }}
                className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
                  esColombiano === false
                    ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-200'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span className="text-2xl">🌎</span>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">No, soy extranjero(a)</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Tengo pasaporte o documento de otro país.</p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* PASO 2 */}
        {paso === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Pregunta 2</span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                ¿Posees ya un título profesional universitario?
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                La ley garantiza el beneficio para aspirantes que vayan a cursar su <strong>primer pregrado</strong> (técnico profesional, tecnólogo o universitario). Si solo tienes título de técnico/tecnólogo, aún puedes aplicar para profesional.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => { setTieneTitulo(false); setPaso(3); }}
                className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
                  tieneTitulo === false
                    ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-200'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span className="text-2xl">🎓</span>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">No tengo título profesional</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Soy bachiller, estoy terminando 11, o solo tengo título técnico/tecnológico.</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => { setTieneTitulo(true); setPaso(3); }}
                className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
                  tieneTitulo === true
                    ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-200'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span className="text-2xl">📜</span>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Sí, ya soy profesional</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Ya me gradué de una carrera universitaria previa.</p>
                </div>
              </button>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setPaso(1)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-700"
              >
                ← Volver a la pregunta anterior
              </button>
            </div>
          </div>
        )}

        {/* PASO 3 */}
        {paso === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Pregunta 3</span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                ¿Cuál es tu condición socioeconómica?
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Bajo la nueva reglamentación de "Puedo Estudiar", el criterio socioeconómico es amplio y flexible:
              </p>
            </div>

            <div className="space-y-3">
              {/* Opción Estrato */}
              <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                criterioVulnerabilidad === 'estrato' ? 'border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-400' : 'border-slate-200 hover:bg-slate-50'
              }`}>
                <input
                  type="radio"
                  name="criterio"
                  checked={criterioVulnerabilidad === 'estrato'}
                  onChange={() => setCriterioVulnerabilidad('estrato')}
                  className="mt-1 text-emerald-600 focus:ring-emerald-500"
                />
                <div className="flex-1">
                  <span className="font-bold text-sm text-slate-900 block">Pertenezco a Estrato Socioeconómico 1, 2 o 3</span>
                  <span className="text-xs text-slate-500 block mt-0.5">Verificado con tu factura de servicios públicos residenciales.</span>
                  {criterioVulnerabilidad === 'estrato' && (
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-xs font-medium text-slate-700">Selecciona tu estrato:</span>
                      {['1', '2', '3'].map((e) => (
                        <button
                          key={e}
                          type="button"
                          onClick={() => setEstrato(e)}
                          className={`px-3 py-1 rounded text-xs font-bold ${
                            estrato === e ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          Estrato {e}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </label>

              {/* Opción Sisbén */}
              <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                criterioVulnerabilidad === 'sisben' ? 'border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-400' : 'border-slate-200 hover:bg-slate-50'
              }`}>
                <input
                  type="radio"
                  name="criterio"
                  checked={criterioVulnerabilidad === 'sisben'}
                  onChange={() => setCriterioVulnerabilidad('sisben')}
                  className="mt-1 text-emerald-600 focus:ring-emerald-500"
                />
                <div className="flex-1">
                  <span className="font-bold text-sm text-slate-900 block">Tengo clasificación en Sisbén IV (Grupos A, B o C)</span>
                  <span className="text-xs text-slate-500 block mt-0.5">Cualquier subgrupo dentro de A (pobreza extrema), B (pobreza moderada) o C (vulnerabilidad).</span>
                  {criterioVulnerabilidad === 'sisben' && (
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-xs font-medium text-slate-700">Tu grupo Sisbén:</span>
                      {['A', 'B', 'C'].map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setGrupoSisben(g)}
                          className={`px-3 py-1 rounded text-xs font-bold ${
                            grupoSisben === g ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          Grupo {g}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </label>

              {/* Opción Población Especial */}
              <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                criterioVulnerabilidad === 'especial' ? 'border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-400' : 'border-slate-200 hover:bg-slate-50'
              }`}>
                <input
                  type="radio"
                  name="criterio"
                  checked={criterioVulnerabilidad === 'especial'}
                  onChange={() => setCriterioVulnerabilidad('especial')}
                  className="mt-1 text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <span className="font-bold text-sm text-slate-900 block">Población con Enfoque Diferencial o Víctima</span>
                  <span className="text-xs text-slate-500 block mt-0.5">Indígenas, afrocolombianos, raizales, palenqueros, Rrom, víctimas del conflicto armado (RUV) o personas con discapacidad.</span>
                </div>
              </label>

              {/* Opción Ninguna */}
              <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                criterioVulnerabilidad === 'ninguno' ? 'border-rose-300 bg-rose-50/40 ring-1 ring-rose-300' : 'border-slate-200 hover:bg-slate-50'
              }`}>
                <input
                  type="radio"
                  name="criterio"
                  checked={criterioVulnerabilidad === 'ninguno'}
                  onChange={() => setCriterioVulnerabilidad('ninguno')}
                  className="mt-1 text-rose-600 focus:ring-rose-500"
                />
                <div>
                  <span className="font-bold text-sm text-slate-900 block">Ninguna de las anteriores (Estrato 4, 5, 6 o Sisbén D)</span>
                  <span className="text-xs text-slate-500 block mt-0.5">No pertenezco a los estratos 1-3 ni a los grupos A-C del Sisbén.</span>
                </div>
              </label>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => setPaso(2)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-700"
              >
                ← Volver a la pregunta anterior
              </button>

              <button
                disabled={!criterioVulnerabilidad}
                onClick={() => setPaso(4)}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl shadow-md transition-colors"
              >
                Ver Mi Veredicto de Gratuidad →
              </button>
            </div>
          </div>
        )}

        {/* PASO 4: RESULTADO OFICIAL */}
        {paso === 4 && (
          <div className="animate-in zoom-in-95 duration-200 space-y-6">
            {esElegible ? (
              <div className="rounded-2xl border-2 border-emerald-500 bg-emerald-50/50 p-6 sm:p-8 text-center">
                <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center text-3xl mx-auto shadow-md mb-4 animate-bounce">
                  ✓
                </div>
                <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full uppercase tracking-wider mb-2">
                  Elegibilidad Confirmada
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  ¡Calificas para 100% de Matrícula Gratuita!
                </h3>
                <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto mt-2 leading-relaxed">
                  Bajo la <strong>Ley 2307 de 2023</strong>, el Estado colombiano cubre el 100% del valor de tu matrícula ordinaria de pregrado en <strong>todas las 34 universidades públicas del país</strong> durante toda tu carrera.
                </p>

                {/* Lo que cubre vs no cubre */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-xl mx-auto">
                  <div className="bg-white p-4 rounded-xl border border-emerald-200">
                    <span className="font-bold text-xs text-emerald-700 uppercase block mb-1">✓ Lo que cubre:</span>
                    <ul className="text-xs text-slate-700 space-y-1">
                      <li>• 100% del valor semestral de la matrícula.</li>
                      <li>• Cubre el total de semestres del plan de estudios.</li>
                      <li>• Carreras técnicas, tecnológicas y universitarias.</li>
                    </ul>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <span className="font-bold text-xs text-amber-700 uppercase block mb-1">⚠️ Lo que NO cubre:</span>
                    <ul className="text-xs text-slate-700 space-y-1">
                      <li>• Derechos de inscripción (PIN de examen).</li>
                      <li>• Carnet, seguro estudiantil o sistematización (~$20.000-$50.000).</li>
                      <li>• Cursos intersemestrales o repeticiones de materias.</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                  {onExplorarPublicas && (
                    <button
                      onClick={onExplorarPublicas}
                      className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg transition-all"
                    >
                      Explorar las Universidades Públicas Disponibles →
                    </button>
                  )}
                  <button
                    onClick={reiniciar}
                    className="w-full sm:w-auto px-5 py-3 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-sm rounded-xl transition-colors"
                  >
                    Volver a calcular
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border-2 border-amber-400 bg-amber-50/50 p-6 sm:p-8 text-center">
                <div className="w-16 h-16 bg-amber-500 text-white rounded-full flex items-center justify-center text-3xl mx-auto shadow-md mb-4">
                  ℹ️
                </div>
                <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full uppercase tracking-wider mb-2">
                  No aplica para Gratuidad Universal
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Tu perfil no cumple con los requisitos de la Ley 2307
                </h3>
                <p className="text-sm text-slate-600 max-w-lg mx-auto mt-2 leading-relaxed">
                  {!esColombiano
                    ? 'La política actual exige ser de nacionalidad colombiana para recibir la gratuidad total.'
                    : tieneTitulo
                    ? 'La gratuidad solo cubre el primer título de pregrado; no aplica para segundos pregrados universitarios.'
                    : 'Perteneces a un estrato o grupo del Sisbén superior al límite de focalización establecido.'}
                </p>

                <div className="mt-6 bg-white p-5 rounded-xl border border-amber-200 max-w-lg mx-auto text-left">
                  <h4 className="font-bold text-xs text-slate-900 uppercase mb-2">Alternativas disponibles para ti:</h4>
                  <ul className="text-xs text-slate-700 space-y-2">
                    <li>• <strong>Becas por Mérito Académico:</strong> Universidades públicas y privadas premian los mejores puntajes Saber 11 con 50% a 100% de descuento.</li>
                    <li>• <strong>Líneas ICETEX Tú Eliges:</strong> Créditos educativos tradicionales y condonables por mérito.</li>
                    <li>• <strong>Convenios de Financiación Directa:</strong> Las privadas ofrecen pago a cuotas sin intereses bancarios.</li>
                  </ul>
                </div>

                <div className="mt-8 flex justify-center gap-3">
                  <button
                    onClick={reiniciar}
                    className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-colors"
                  >
                    Revisar respuestas
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
