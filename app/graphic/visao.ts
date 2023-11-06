//@ts-nocheck

import PontoCaminho from './elements/pontoCaminho';
import PontoReferencia from './elements/pontoReferencia';
import { add, subtract } from './utils';

export default class Visao {
  constructor(canvas, { mainWidth, mainHeight }) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    this.zoom = 1;
    this.offset = new PontoReferencia(0, 0);

    this.mainWidth = mainWidth;
    this.mainHeight = mainHeight;

    this.drag = {
      start: new PontoReferencia(0, 0),
      end: new PontoReferencia(0, 0),
      offset: new PontoReferencia(0, 0),
      active: false,
    };

    this.addEvents();
  }

  getMouse(event, selectedTool) {
    // Problema -
    // Está perdando a posição do mouse em duas situações:
    // - Quando está com zoom
    if (selectedTool === 'caminho') {
      return new PontoCaminho(
        (event.offsetX - this.offset.x) * this.zoom,
        (event.offsetY - this.offset.y) * this.zoom
      );
    }

    return new PontoReferencia(
      (event.offsetX - this.offset.x) * this.zoom,
      (event.offsetY - this.offset.y) * this.zoom
    );
  }

  getOffset() {
    return add(this.offset, this.drag.offset);
  }

  private addEvents() {
    this.canvas.addEventListener('mousewheel', this.handleMouseWheel.bind(this));
    this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
  }

  private handleMouseDown(event) {
    if (event.button == 1) {
      this.drag.start = this.getMouse(event);
      this.drag.active = true;
    }
  }

  private handleMouseMove(event) {
    if (this.drag.active) {
      this.drag.end = this.getMouse(event);
      this.drag.offset = subtract(this.drag.end, this.drag.start);
    }
  }

  private handleMouseUp(event) {
    if (this.drag.active) {
      let tmp_offset = add(this.offset, this.drag.offset);

      let diferencial_x = this.mainWidth + tmp_offset.x * -1;
      let diferencial_y = this.mainHeight + tmp_offset.y * -1;

      if (tmp_offset.x > 0) {
        tmp_offset.x = 0;
      }

      if (diferencial_x > this.canvas.width * this.zoom) {
        tmp_offset.x = this.mainWidth - this.canvas.width * this.zoom;
      }

      if (tmp_offset.y > 0) {
        tmp_offset.y = 0;
      }

      if (diferencial_y > this.canvas.height * this.zoom) {
        tmp_offset.y = this.mainHeight - this.canvas.height * this.zoom;
      }

      this.offset = new PontoReferencia(tmp_offset.x, tmp_offset.y);

      this.drag = {
        start: new PontoReferencia(0, 0),
        end: new PontoReferencia(0, 0),
        offset: new PontoReferencia(0, 0),
        active: false,
      };
    }
  }

  private handleMouseWheel(event) {
    const direction = Math.sign(event.deltaY) * -1;
    const step = 0.2;

    this.zoom += direction * step;
    this.zoom = Math.max(1, Math.min(3, this.zoom));
  }
}
