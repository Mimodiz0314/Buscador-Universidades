import { Component } from 'react';

// Si alguna pantalla falla (p. ej. un dato mal escrito), en vez de dejar la app
// en blanco muestra un mensaje y un botón para recargar.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('UniScoop: error en pantalla', error, info?.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 font-sans">
        <div className="max-w-sm text-center space-y-3">
          <p className="text-4xl">😕</p>
          <h1 className="text-lg font-bold text-slate-900">Algo falló en esta pantalla</h1>
          <p className="text-sm text-slate-600">Tus favoritos no se perdieron. Toca el botón para volver al inicio.</p>
          <button
            onClick={() => { window.location.hash = '#/'; window.location.reload(); }}
            className="px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold"
          >
            Volver a cargar
          </button>
        </div>
      </div>
    );
  }
}
