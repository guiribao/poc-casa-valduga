export function validatorNomeCompleto(nome: string): string | undefined {
  if(nome == null) return "Campo nome parece inválido"
  if(nome == '') return "Campo nome não pode ser vazio"
  if(nome.length < 5) return "Este nome parece pequeno demais"
}

export function validatorDataNascimento(data: string): string | undefined {
  if(!data)  return "Data de nascimento inválida"
}

export function validatorCelular(celular: string): string | undefined {
  if(celular.length < 15) return "Este celular parece pequeno demais"
  if(celular == '') return "Campo celular não pode ser vazio"
  if(celular == null) return "Campo celular parece inválido"
}

export function validatorEmail(email: string): string | undefined {
  if(!/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi.test(email)) {
    return "E-mail inválido"
  }
}
