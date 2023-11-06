//@ts-nocheck
export default class PontoReferencia {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.name = 'Nome da referencia';
    this.label = 'T';
    this.description = 'Descrição padrão para uma referência';
  }

  equals(reference) {
    return this.x === reference.x && this.y === reference.y;
  }

  draw(
    ctx,
    { zoom, size = 38, color = 'rgba(72, 213, 209, 0.5)', outline = false, fill = false, text = '' } = {}
  ) {
    const rad = size / 2;
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(this.x * zoom, this.y * zoom, rad, 0, Math.PI * 2);
    ctx.fill();

    if (outline) {
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'white';
      ctx.arc(this.x * zoom, this.y * zoom, rad * 0.6, 0, Math.PI * 2);
      ctx.stroke();
    }

    if (fill) {
      ctx.beginPath();
      ctx.arc(this.x * zoom, this.y * zoom, rad * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = 'white';
      ctx.fill();
    }


  }
}
