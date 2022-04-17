import { GLProvider, BasicGLProvider } from "parsegraph-compileprogram";
import { setVFlip } from "parsegraph-matrix";
import AbstractProjector from "./AbstractProjector";

export default class BasicProjector extends AbstractProjector {
  _offscreen: boolean;

  constructor(glProvider?: GLProvider) {
    super();

    this._offscreen = false;

    if (glProvider) {
      this.setGLProvider(glProvider);
    }
  }

  protected createGLProvider() {
    return new BasicGLProvider();
  }

  protected createContainer() {
    return this.glProvider().container();
  }

  /**
   * Sets the mouse cursor bitmap by this canvas.
   *
   * @param {string} cursorType CSS cursor style
   */
  setCursor(cursorType: string): void {
    let elem: HTMLElement;
    if (this.glProvider() && this.glProvider().canvas()) {
      elem = this.glProvider().canvas();
    } else if (this.overlayCanvas()) {
      elem = this.overlayCanvas();
    } else {
      elem = this.getDOMContainer();
    }
    elem.style.cursor = cursorType;
  }

  protected createAudio() {
    return new AudioContext();
  }

  protected getTextureSize(): number {
    const gl = this.glProvider().gl();
    if (gl.isContextLost()) {
      return NaN;
    }
    return Math.min(
      super.getTextureSize(),
      gl.getParameter(gl.MAX_TEXTURE_SIZE)
    );
  }

  protected createOverlay() {
    return this.overlayCanvas().getContext("2d");
  }

  protected createOverlayCanvas() {
    const overlayCanvas = document.createElement("canvas");
    overlayCanvas.style.position = "absolute";
    overlayCanvas.style.top = "0";
    overlayCanvas.style.left = "0";
    overlayCanvas.style.pointerEvents = "none";
    return overlayCanvas;
  }

  width() {
    return this.glProvider().width();
  }

  height() {
    return this.glProvider().height();
  }

  setOffscreen(offscreen:boolean): void {
    this._offscreen = offscreen;
  }

  isOffscreen(): boolean {
    return this._offscreen;
  }

  render(): boolean {
    setVFlip(this.isOffscreen());
    if (this.hasOverlay()) {
      const canvas = this.overlayCanvas();
      if (canvas.width != this.width()) {
        canvas.width = this.width();
      }
      if (canvas.height != this.height()) {
        canvas.height = this.height();
      }
    }
    if (this.glProvider().hasCanvas()) {
      if (this.glProvider().canvas().style.display != "block") {
        this.glProvider().canvas().style.display = "block";
      }
    }
    let needsUpdate = false;
    needsUpdate = this.glProvider().render() || needsUpdate;
    return needsUpdate;
  }
}
