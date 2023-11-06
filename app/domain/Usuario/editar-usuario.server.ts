import { prisma } from '~/secure/db.server';

//@ts-ignore
export default async function editarUsuarioPorId(usuarioId, email, papel) {
  try {
    const editarPerfil = await prisma.usuario.update({
      where: {
        id: Number(usuarioId)
      },
      data: {
        email: email,
        papel: papel
      },
    })
    
    
    return editarPerfil;
  } catch (error) {
    return null;
  }
}
