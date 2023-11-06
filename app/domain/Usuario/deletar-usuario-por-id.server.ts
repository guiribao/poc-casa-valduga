import { prisma } from '~/secure/db.server';
import Constraints from '~/shared/Constraints';

export default async function deletarUsuarioPorId(usuarioId: number) {
  console.log(usuarioId, ' delete')
  try {
    return await prisma.usuario.delete({
      where: {
        id: usuarioId,
      },
    });
  } catch (error) {
    return null;
  }
}
