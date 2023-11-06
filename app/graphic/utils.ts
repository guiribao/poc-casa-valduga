//@ts-nocheck

import PontoReferencia from './elements/pontoReferencia';

export function getNearestPoint(loc, points, limite = Number.MAX_SAFE_INTEGER) {
  let minDist = Number.MAX_SAFE_INTEGER;
  let nearest = null;

  for (const point of points) {
    const dist = distance(point, loc);

    if (dist < minDist && dist < limite) {
      minDist = dist;
      nearest = point;
    }
  }

  return nearest;
}

export function distance(p1, p2) {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

export function add(p1, p2) {
  return new PontoReferencia(p1.x + p2.x, p1.y + p2.y);
}

export function subtract(p1, p2) {
  return new PontoReferencia(p1.x - p2.x, p1.y - p2.y);
}
