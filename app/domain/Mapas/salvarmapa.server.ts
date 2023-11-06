//@ts-nocheck
import { Mapa_visibilidade } from '@prisma/client';
import { prisma } from '~/secure/db.server';

export default async function salvarMapa({
  titulo,
  slug,
  background,
  points,
  segments,
  references,
  mapaPrivado,
}) {
  try {
    console.log(background);

    const mapa = await prisma.mapa.upsert({
      where: {
        slug,
      },
      update: {
        titulo,
        pontos: points,
        caminhos: segments,
        referencias: references,
        mapa_privado: mapaPrivado,
      },
      create: {
        titulo,
        slug,
        pontos: points,
        caminhos: segments,
        referencias: references,
        background: '',
        mapa_privado: mapaPrivado,
      },
    });

    return usuario;
  } catch (error) {
    console.log(error);
    return null;
  }
}
