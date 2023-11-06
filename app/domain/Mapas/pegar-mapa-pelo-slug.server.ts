import { prisma } from '~/secure/db.server';
import { Mapa, Usuario } from '@prisma/client';

export default async function pegarMapaPeloSlug(slug: string): Promise<Mapa | null> {
  try {
    const mapa: {} | null = await prisma.mapa.findUnique({
      where: { slug },
    });

    if (mapa?.id) return mapa as Mapa;

    return null;
  } catch (error) {
    return null;
  }
}
