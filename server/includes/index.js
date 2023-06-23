export function formatDateNoTime(dateInput) {
  let data = new Date(dateInput),
    dia = data.getDate().toString(),
    diaF = dia.length === 1 ? "0" + dia : dia,
    mes = (data.getMonth() + 1).toString(),
    mesF = mes.length === 1 ? "0" + mes : mes,
    anoF = data.getFullYear();

  return anoF + "-" + mesF + "-" + diaF;
}

export function removeCaracter(valor) {
  return valor.replace(/\D/g, "");
}

export function getDateHourNow() {
  const dateNow = new Date();
  return removeCaracter(formatDateNoTime(dateNow));
}
