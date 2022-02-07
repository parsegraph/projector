import Rect from "parsegraph-rect";
import Projected from "./Projected";
import Projector from "./Projector";
import { Renderable } from "parsegraph-timingbelt";

export default class Projection implements Renderable {
  _schedulerFunc: () => void;
  _schedulerFuncThisArg: object;
  _projected: Projected;
  _projector: Projector;
  _clip: Rect;

  constructor(projector: Projector, projected: Projected) {
    this._projected = projected;
    this._schedulerFunc = null;
    this._schedulerFuncThisArg = null;
    this._projector = projector;
    this._projected = projected;
    this._clip = null;

    this.projected().setOnScheduleUpdate(this.scheduleUpdate, this);
  }

  setClip(clip: Rect) {
    this._clip = clip;
    this.scheduleUpdate();
  }

  tick(elapsed: number): boolean {
    return this.projected().tick(elapsed);
  }

  paint(timeout?: number): boolean {
    return this.projected().paint(this.projector(), timeout);
  }

  projected() {
    return this._projected;
  }

  projector() {
    return this._projector;
  }

  hasClip() {
    return !!this._clip;
  }

  prepareClip(): void {
    if (!this.hasClip()) {
      return;
    }
    const compSize = this._clip;

    if (this.projector().glProvider().hasGL()) {
      const gl = this.projector().glProvider()?.gl();
      if (gl) {
        gl.enable(gl.SCISSOR_TEST);
        gl.scissor(
          compSize.x(),
          compSize.y(),
          compSize.width(),
          compSize.height()
        );
        gl.viewport(
          compSize.x(),
          compSize.y(),
          compSize.width(),
          compSize.height()
        );
      }
    }
    if (this.projector().hasOverlay()) {
      const overlay = this.projector().overlay();
      if (overlay) {
        overlay.resetTransform();
        overlay.save();
        const height = this.projector().overlayCanvas().height;
        overlay.beginPath();
        overlay.moveTo(compSize.x(), height - compSize.y());
        overlay.lineTo(compSize.x() + compSize.width(), height - compSize.y());
        overlay.lineTo(
          compSize.x() + compSize.width(),
          height - (compSize.y() + compSize.height())
        );
        overlay.lineTo(
          compSize.x(),
          height - (compSize.y() + compSize.height())
        );
        overlay.clip();
        overlay.translate(
          compSize.x(),
          height - compSize.y() - compSize.height()
        );
      }
    }
    if (this.projector().hasDOMContainer()) {
      const domContainer = this.projector().getDOMContainer();
      if (domContainer) {
        const container = domContainer.parentElement;
        container.style.left = compSize.x() + "px";
        const height = container.clientHeight;
        container.style.top = height - compSize.y() - compSize.height() + "px";
        domContainer.style.width = compSize.width() + "px";
        domContainer.style.height = compSize.height() + "px";
      }
    }
  }

  removeClip(): void {
    if (this.projector().hasOverlay()) {
      this.projector().overlay().restore();
    }
    if (this.projector().glProvider().hasGL()) {
      const gl = this.projector().glProvider()?.gl();
      if (gl) {
        gl.disable(gl.SCISSOR_TEST);
      }
    }
  }

  clip() {
    return this._clip;
  }

  render(): boolean {
    let needsUpdate = this.projector().render();
    const width = this.hasClip()
      ? this.clip().width()
      : this.projector().width();
    const height = this.hasClip()
      ? this.clip().height()
      : this.projector().height();
    this.prepareClip();
    needsUpdate =
      this.projected().render(this.projector(), width, height) || needsUpdate;
    this.removeClip();
    return needsUpdate;
  }

  scheduleUpdate() {
    // console.log("Window is scheduling update");
    if (this._schedulerFunc) {
      this._schedulerFunc.call(this._schedulerFuncThisArg, this);
    }
  }

  setOnScheduleUpdate(
    schedulerFunc: () => void,
    schedulerFuncThisArg?: any
  ): void {
    this._schedulerFunc = schedulerFunc;
    this._schedulerFuncThisArg = schedulerFuncThisArg;
  }

  unmount() {
    this.projected().unmount(this.projector());
  }
}
