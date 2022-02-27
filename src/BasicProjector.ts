import Projector, { createDOMContainer } from "./Projector";
import { GLProvider, BasicGLProvider } from "parsegraph-compileprogram";
import { setVFlip } from "parsegraph-matrix";

export const MAX_TEXTURE_SIZE = 2048;

export default class BasicProjector implements Projector {
  private _glProvider: GLProvider;
  private _textureSize: number;
  private _schedulerFunc: () => void;
  private _schedulerFuncThisArg: object;
  private _audio: AudioContext;
  private _overlayCanvas: HTMLCanvasElement;
  private _overlayCtx: CanvasRenderingContext2D;
  private _domContainer: HTMLDivElement;
  private _container: HTMLElement;

  constructor(glProvider?: GLProvider) {
    this._glProvider = null;
    this._textureSize = NaN;
    this._schedulerFunc = null;
    this._schedulerFuncThisArg = null;
    this._audio = null;
    this._overlayCtx = null;
    this._overlayCanvas = null;
    this._domContainer = null;
    this._container = null;

    if (glProvider) {
      this.setGLProvider(glProvider);
    }
  }

  protected setGLProvider(glProvider: GLProvider) {
    this._glProvider = glProvider;
  }

  protected createGLProvider() {
    return new BasicGLProvider();
  }

  protected setOverlay(overlay: CanvasRenderingContext2D) {
    this._overlayCtx = overlay;
  }

  overlay() {
    if (!this._overlayCtx) {
      const overlay = this.createOverlay();
      if (overlay) {
        this.setOverlay(overlay);
      }
    }

    return this._overlayCtx;
  }

  protected createContainer() {
    return this.glProvider().container();
  }

  protected setContainer(container: HTMLElement) {
    this._container = container;
  }

  container() {
    if (!this._container) {
      const container = this.createContainer();
      if (container) {
        container.className = "parsegraph_Window " + container.className;
        container.style.display = "block";
        container.style.position = "relative";
        container.style.overflow = "hidden";

        // Observe root container for size changes.
        new ResizeObserver(() => {
          this.scheduleUpdate();
        }).observe(container);
        this.setContainer(container);
      }
    }
    return this._container;
  }

  setOverlayCanvas(canvas: HTMLCanvasElement) {
    this._overlayCanvas = canvas;
  }

  overlayCanvas() {
    if (!this._overlayCanvas) {
      const canvas = this.createOverlayCanvas();
      if (canvas) {
        this.container().appendChild(canvas);
        this.setOverlayCanvas(canvas);
      }
    }
    return this._overlayCanvas;
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

  protected setAudio(audio: AudioContext) {
    this._audio = audio;
  }

  protected createAudio() {
    return new AudioContext();
  }

  audio() {
    if (!this._audio) {
      try {
        this._audio = this.createAudio();
      } catch (ex) {
        console.log("Error creating audio", ex);
      }
    }
    return this._audio;
  }

  hasAudio() {
    return !!this._audio;
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

  createOverlay() {
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

  protected setDOMContainer(domContainer: HTMLDivElement) {
    this._domContainer = domContainer;
  }

  protected createDOMContainer(): HTMLDivElement {
    return createDOMContainer();
  }

  getDOMContainer() {
    if (!this._domContainer) {
      const container = this.createDOMContainer();
      if (container) {
        this.setDOMContainer(container);
        this.container().appendChild(this._domContainer.parentElement);
      }
    }
    return this._domContainer;
  }

  glProvider() {
    if (!this._glProvider) {
      const glProvider = this.createGLProvider();
      if (glProvider) {
        this.setGLProvider(glProvider);
      }
    }
    return this._glProvider;
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

  isOffscreen(): boolean {
    return false;
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
