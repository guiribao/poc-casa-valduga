//@ts-nocheck

import Segment from './elements/caminho';
import PontoCaminho from './elements/pontoCaminho';
import PontoReferencia from './elements/pontoReferencia';

export default class Mapa {
  constructor(points = [], segments = [], references = []) {
    this.points = points;
    this.segments = segments;
    this.references = references;
  }

  static load(pontos, caminhos, referencias) {
    const points = [];
    const segments = [];
    const references = [];

    for (const ponto of pontos) {
      points.push(new PontoCaminho(ponto.x, ponto.y));
    }

    for (const seg of caminhos) {
      segments.push(
        new Segment(
          points.find((p) => p.equals(seg.p1)),
          points.find((p) => p.equals(seg.p2))
        )
      );
    }

    for (const referencia of referencias) {
      references.push(new PontoReferencia(referencia.x, referencia.y));
    }

    return new Mapa(points, segments, references);
  }

  addPoint(point) {
    this.points.push(point);
  }

  containsPoint(point) {
    return this.points.find((p) => p.equals(point));
  }

  tryAddPoint(point) {
    if (!this.containsPoint(point)) {
      this.addPoint(point);
      return true;
    }

    return false;
  }

  removePoint(point) {
    let deletarSegmentos = this.getSegmentsWithPoint(point);

    for (let segmento of deletarSegmentos) {
      this.removeSegment(segmento);
    }

    this.points.splice(this.points.indexOf(point), 1);
  }

  addSegment(seg) {
    this.segments.push(seg);
  }

  containsSegment(seg) {
    return this.segments.find((segment) => segment.equals(seg));
  }

  tryAddSegment(seg) {
    if (!this.containsSegment(seg) && !seg.p1.equals(seg.p2)) {
      this.addSegment(seg);
      return true;
    }

    return false;
  }

  removeSegment(seg) {
    this.segments.splice(this.segments.indexOf(seg), 1);
  }

  getSegmentsWithPoint(point) {
    const segs = [];
    for (const seg of this.segments) {
      if (seg.includes(point)) {
        segs.push(seg);
      }
    }

    return segs;
  }

  addReferencePoint(point) {
    this.references.push(point);
  }

  containsReferencePoint(point) {
    return this.references.find((p) => p.equals(point));
  }

  tryAddReferencePoint(point) {
    if (!this.containsReferencePoint(point)) {
      this.addReferencePoint(point);
      return true;
    }

    return false;
  }

  removeReferencePoint(point) {
    this.references.splice(this.references.indexOf(point), 1);
  }

  dispose() {
    this.points.length = 0;
    this.segments.length = 0;
  }

  drawBg(ctx, img, zoom, width, height) {
    ctx.drawImage(img, 0, 0, width * zoom, height * zoom);
  }

  draw(ctx, zoom) {
    for (const segment of this.segments) {
      segment.draw(ctx, { zoom });
    }

    for (const point of this.points) {
      point.draw(ctx, { zoom });
    }

    for (const reference of this.references) {
      reference.draw(ctx, { zoom, text: reference.label });
    }
  }
}
