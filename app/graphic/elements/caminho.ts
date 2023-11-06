//@ts-nocheck
export default class Segment {
  constructor(p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
  }

  equals(seg) {
    return this.includes(seg.p1) && this.includes(seg.p2);
  }

  includes(point) {
    return this.p1.equals(point) || this.p2.equals(point);
  }

  draw(ctx, { zoom, width = 4, color = '#FF4D80', dash = [] } = {}) {
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.setLineDash(dash);
    ctx.moveTo(this.p1.x * zoom, this.p1.y * zoom);
    ctx.lineTo(this.p2.x * zoom, this.p2.y * zoom);
    ctx.stroke();
    ctx.setLineDash([]);
  }
}
