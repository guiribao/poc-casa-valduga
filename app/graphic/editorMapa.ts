//@ts-nocheck
import PontoCaminho from './elements/pontoCaminho';
import Segment from './elements/caminho';
import { getNearestPoint } from './utils';
import PontoReferencia from './elements/pontoReferencia';

export default class EditorMapa {
  constructor(visao, mapa) {
    this.visao = visao;
    this.canvas = visao.canvas;
    this.ctx = visao.ctx;
    this.mapa = mapa;

    this.tool = 'caminho';
    this.mouse = null;
    this.selected = null;
    this.hovered = null;
    this.dragging = false;

    this.addEvents();
  }

  trocarFerramenta(ferramenta) {
    this.tool = ferramenta;
  }

  private addEvents() {
    this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.canvas.addEventListener('mouseup', (event) => (this.dragging = false));
    this.canvas.addEventListener('contextmenu', (event) => event.preventDefault());
  }

  private handleMouseMove(event) {
    this.mouse = this.visao.getMouse(event, this.tool);
    let allPoints = this.mapa.points.concat(this.mapa.references);

    this.hovered = getNearestPoint(this.mouse, allPoints, 15 * this.visao.zoom, this.visao.zoom);

    if (this.dragging === true) {
      this.selected.x = this.mouse.x;
      this.selected.y = this.mouse.y;
    }
  }

  private handleMouseDown(event) {
    // right click
    if (event.button == 2) {
      if (this.selected) {
        this.selected = null;
      } else if (this.hovered) {
        this.removePoint(this.hovered);
      }
    }

    // left click
    if (event.button == 0) {
      if (this.hovered) {
        this.selectPoint(this.hovered);
        this.dragging = true;
        return;
      }

      if (this.tool === 'referencia') {
        this.mapa.tryAddReferencePoint(this.mouse);
        this.selectPoint(this.mouse);
        this.hovered = this.mouse;
        return;
      }

      this.mapa.tryAddPoint(this.mouse);
      this.selectPoint(this.mouse);
      this.hovered = this.mouse;
    }
  }

  private removePoint(point) {
    point.hasOwnProperty('name')
      ? this.mapa.removeReferencePoint(point)
      : this.mapa.removePoint(point);
    this.hovered = null;

    if (this.selected === point) {
      this.selected = null;
    }
  }

  private selectPoint(point) {
    if (this.selected && this.tool === 'caminho') {
      this.mapa.tryAddSegment(new Segment(this.selected, point));
    }

    this.selected = point;
  }

  display(zoom) {
    this.mapa.draw(this.ctx, zoom);

    if (this.hovered) {
      this.hovered.draw(this.ctx, { fill: true });
    }

    if (this.selected) {
      if (this.tool === 'caminho') {
        const intent = this.hovered || this.mouse;
        new Segment(this.selected, intent).draw(this.ctx, { dash: [6, 4] });
      }

      this.selected.draw(this.ctx, { outline: true });
    }
  }
}
