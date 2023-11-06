//@ts-nocheck
import { prisma } from '~/secure/db.server';
import { encrypt } from '~/shared/Password.util';

export default async function criarNovoUsuario({
  email,
  senha,
  nome_completo,
  data_nascimento,
  celular,
}) {
  const hash = await encrypt(senha);

  try {
    const usuario = await prisma.usuario.create({
      data: {
        email,
        senha: hash,
        nome_completo,
        data_nascimento: new Date(data_nascimento),
        celular,
      },
    });

    return usuario;
  } catch (error) {
    console.log(error);
    return null;
  }
}
