import { prisma } from '~/secure/db.server';
import { Mapa, Usuario } from '@prisma/client';

export default async function listarMapas(): Promise<Mapa[] | null> {
  try {
    const mapas = await prisma.mapa.findMany();
    
    return mapas as Mapa[];
  } catch (error) {
    return null;
  }
}
