// Normaliza texto para búsqueda: minúsculas y sin tildes.
export function normalizar(txt) {
  return (txt || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

export function coincide(texto, consulta) {
  return normalizar(texto).includes(normalizar(consulta));
}
