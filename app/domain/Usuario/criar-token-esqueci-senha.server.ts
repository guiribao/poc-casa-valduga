import { prisma } from '~/secure/db.server';
import Constraints from '~/shared/Constraints';
import addHours from 'date-fns/addHours';

const VALIDADE_EMAIL_PADRAO = Number(process.env.VALIDADE_EMAIL_PADRAO)

export default async function criarTokenEsqueciSenha(usuarioId: number) {
  let validadeToken = addHours(new Date(), VALIDADE_EMAIL_PADRAO);
  
  try {
    const tokenCriado = await prisma.usuario_Esqueci_Senha.create({
      data: {
        usuarioId: usuarioId,
        valido_ate: validadeToken,
      },
    });

    if (!tokenCriado) {
      return null;
    }

    return tokenCriado;
  } catch (error) {
    return null;
  }
}
