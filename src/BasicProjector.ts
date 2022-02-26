import Projector, { createDOMContainer } from "./Projector";
import { GLProvider, BasicGLProvider } from "parsegraph-compileprogram";
import Color from "parsegraph-color";

export const MAX_TEXTURE_SIZE = 2048;

// Background color.
export const BACKGROUND_COLOR = new Color(
  // 0, 47 / 255, 57 / 255, 1,
  // 256/255, 255/255, 255/255, 1
  0,
  0,
  0,
  1
  // 45/255, 84/255, 127/255, 1
);

export default class BasicProjector implements Projector {
  _glProvider: BasicGLProvider;
  _audio: AudioContext;
  _textureSize: number;
  _overlayCanvas: HTMLCanvasElement;
  _overlayCtx: CanvasRenderingContext2D;
  _domContainer: HTMLDivElement;
  _schedulerFunc: () => void;
  _schedulerFuncThisArg: object;

  constructor() {
    this._glProvider = new BasicGLProvider();
    this._textureSize = NaN;
    this._schedulerFunc = null;
    this._schedulerFuncThisArg = null;

    const container = this.container();
    container.className = "parsegraph_Window";
    container.style.display = "block";
    container.style.position = "relative";
    container.style.overflow = "hidden";

    // Observe root container for size changes.
    new ResizeObserver(() => {
      this.scheduleUpdate();
    }).observe(this.container());
  }

  createOverlay() {
    return this.overlayCanvas().getContext("2d");
  }

  createOverlayCanvas() {
    const overlayCanvas = document.createElement("canvas");
    overlayCanvas.style.position = "absolute";
    overlayCanvas.style.top = "0";
    overlayCanvas.style.left = "0";
    overlayCanvas.style.pointerEvents = "none";
    return overlayCanvas;
  }

  container() {
    return this.glProvider().container();
  }

  protected createDOMContainer(): HTMLDivElement {
    return createDOMContainer();
  }

  getDOMContainer() {
    if (!this._domContainer) {
      this._domContainer = this.createDOMContainer();
      this.container().appendChild(this._domContainer.parentElement);
    }
    return this._domContainer;
  }

  getProvider(): GLProvider {
    return this._glProvider;
  }

  isOffscreen(): boolean {
    return false;
  }

  /**
   * Sets the mouse cursor bitmap by this canvas.
   *
   * @param {string} cursorType CSS cursor style
   */
  setCursor(cursorType: string): void {
    this.glProvider().canvas().style.cursor = cursorType;
  }

  glProvider() {
    return this._glProvider;
  }

  getTextureSize(): number {
    const gl = this.glProvider().gl();
    return Math.min(MAX_TEXTURE_SIZE, gl.getParameter(gl.MAX_TEXTURE_SIZE));
  }

  textureSize() {
    const gl = this.glProvider().gl();
    if (gl.isContextLost()) {
      return NaN;
    }
    if (Number.isNaN(this._textureSize)) {
      this._textureSize = Math.min(512, this.getTextureSize());
    }
    return this._textureSize;
  }

  overlay() {
    if (!this._overlayCtx) {
      this._overlayCtx = this.createOverlay();
    }

    return this._overlayCtx;
  }

  overlayCanvas() {
    if (!this._overlayCanvas) {
      this._overlayCanvas = this.createOverlayCanvas();
      this.container().appendChild(this._overlayCanvas);
    }
    return this._overlayCanvas;
  }

  hasAudio() {
    return !!this._audio;
  }

  setAudio(audio: AudioContext) {
    this._audio = audio;
  }

  audio() {
    if (!this._audio) {
      try {
        this._audio = new AudioContext();
      } catch (ex) {
        console.log(ex);
      }
      if (this._audio == null) {
        throw new Error("AudioContext is not supported");
      }
    }
    return this._audio;
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

  width() {
    return this.glProvider().width();
  }

  height() {
    return this.glProvider().height();
  }

  hasOverlay() {
    return !!this._overlayCanvas;
  }

  hasDOMContainer() {
    return !!this._domContainer;
  }

  render(): boolean {
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
