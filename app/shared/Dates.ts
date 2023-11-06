export function stringLocalParaData(dataHoraString: string) {
  let [dataString, horaString] = dataHoraString.split(' ');
  let [dia, mes, ano] = dataString.split('/');

  let isoString = `${ano}-${mes}-${dia}T${horaString}:00-03:00`

  return new Date(isoString)
}
