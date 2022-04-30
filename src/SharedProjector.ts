import Projector, { createDOMContainer } from "./Projector";
import { GLProvider } from "parsegraph-compileprogram";

export default class SharedProjector implements Projector {
  _shared: Projector;
  _domContainer: HTMLDivElement;
  _schedulerFunc: () => void;
  _schedulerFuncThisArg: object;

  constructor(shared: Projector) {
    this._shared = shared;
  }

  unmount() {
    this.resetDOM();
  }

  width() {
    return this.shared().width();
  }

  height() {
    return this.shared().height();
  }

  container() {
    return this.shared().container();
  }

  hasDOMContainer() {
    return !!this._domContainer;
  }

  resetDOM() {
    if (this._domContainer) {
      this.container().removeChild(this.getDOMContainer().parentElement);
    }
    this._domContainer = null;
  }

  getDOMContainer() {
    if (!this._domContainer) {
      this._domContainer = createDOMContainer();
      this.container().appendChild(this._domContainer.parentElement);
    }
    return this._domContainer;
  }

  getProvider(): GLProvider {
    return this.shared().glProvider();
  }

  glProvider() {
    return this.getProvider();
  }

  isOffscreen(): boolean {
    return this.shared().isOffscreen();
  }

  shared() {
    return this._shared;
  }

  setCursor(cursorType: string): void {
    this.shared().setCursor(cursorType);
  }

  textureSize() {
    return this.shared().textureSize();
  }

  hasOverlay() {
    return this.shared().hasOverlay();
  }

  overlay() {
    return this.shared().overlay();
  }

  overlayCanvas() {
    return this.shared().overlayCanvas();
  }

  hasAudio() {
    return this.shared().hasAudio();
  }

  audio(): AudioContext {
    return this.shared().audio();
  }

  setOnScheduleUpdate(
    schedulerFunc: () => void,
    schedulerFuncThisArg?: any
  ): void {
    this._schedulerFunc = schedulerFunc;
    this._schedulerFuncThisArg = schedulerFuncThisArg;
  }

  render(): boolean {
    // This projector needs no setup.
    return false;
  }
}
