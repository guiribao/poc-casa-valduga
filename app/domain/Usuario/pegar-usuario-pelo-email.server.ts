import { prisma } from '~/secure/db.server';
import { Usuario } from '@prisma/client';

export default async function pegarUsuarioPeloEmail(email: string): Promise<Usuario | null> {
  try {
    const usuario: {} | null = await prisma.usuario.findFirst({
      where: { email: email },
    });

    //@ts-ignore
    delete usuario.senha;

    if (usuario?.id) return usuario as Usuario;

    return null;
  } catch (error) {
    return null;
  }
}
