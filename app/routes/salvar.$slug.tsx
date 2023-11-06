//@ts-nocheck
import { ActionFunction } from '@remix-run/node';
import salvarMapa from '~/domain/Mapas/salvarmapa.server';

export const action: ActionFunction = async ({ request }) => {
  const { titulo, slug, background, mapaPrivado } = (data = await request.json());
  const { points, segments, references } = data.atributos;
  // {
  //   "points": [],
  //   "segments": [],
  //   "references": []
  // }

  let saveMap = await salvarMapa({
    titulo,
    slug: slug,
    points,
    segments,
    references,
    background,
    mapaPrivado
  });

  return { success: true };
};
