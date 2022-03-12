import Projector, { createDOMContainer } from "./Projector";
import { GLProvider } from "parsegraph-compileprogram";
import ResizeObserver from "resize-observer-polyfill";

export const MAX_TEXTURE_SIZE = 2048;

export default abstract class AbstractProjector implements Projector {
  private _glProvider: GLProvider;
  private _schedulerFunc: () => void;
  private _schedulerFuncThisArg: object;
  private _audio: AudioContext;
  private _overlayCanvas: HTMLCanvasElement;
  private _overlayCtx: CanvasRenderingContext2D;
  private _domContainer: HTMLDivElement;
  private _textureSize: number;
  private _container: HTMLElement;

  constructor() {
    this._container = null;
    this._glProvider = null;
    this._schedulerFunc = null;
    this._schedulerFuncThisArg = null;
    this._audio = null;
    this._overlayCtx = null;
    this._overlayCanvas = null;
    this._domContainer = null;
    this._textureSize = NaN;
  }

  abstract setCursor(cursorType: string): void;
  abstract render(): boolean;
  abstract width(): number;
  abstract height(): number;
  abstract isOffscreen(): boolean;

  protected getTextureSize(): number {
    return MAX_TEXTURE_SIZE;
  }
  protected abstract createContainer(): HTMLElement;
  protected abstract createOverlayCanvas(): HTMLCanvasElement;

  protected createDOMContainer(): HTMLDivElement {
    return createDOMContainer();
  }

  protected abstract createAudio(): AudioContext;
  protected abstract createOverlay(): CanvasRenderingContext2D;
  protected abstract createGLProvider(): GLProvider;

  protected setDOMContainer(domContainer: HTMLDivElement) {
    this.removeDOMContainer();
    this._domContainer = domContainer;
  }

  protected removeDOMContainer() {
    if (!this._domContainer) {
      return;
    }
    this._domContainer.parentElement.remove();
  }

  protected setAudio(audio: AudioContext) {
    this._audio = audio;
  }

  protected setGLProvider(glProvider: GLProvider) {
    this._glProvider = glProvider;
  }

  protected setOverlay(overlay: CanvasRenderingContext2D) {
    this._overlayCtx = overlay;
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
        this._container = container;
      }
    }
    return this._container;
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

  hasOverlay() {
    return !!this._overlayCanvas;
  }

  hasDOMContainer() {
    return !!this._domContainer;
  }

  textureSize() {
    if (Number.isNaN(this._textureSize)) {
      this._textureSize = this.getTextureSize();
    }
    return this._textureSize;
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
}
