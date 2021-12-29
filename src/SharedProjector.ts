import Projector from "./Projector";
import { GLProvider } from "parsegraph-compileprogram";

export default class SharedProjector implements Projector {
  _shared: Projector;
  _childContainer: HTMLDivElement;
  _schedulerFunc: () => void;
  _schedulerFuncThisArg: object;

  constructor(shared: Projector) {
    this._shared = shared;

    // Setup DOM layer
    const container = document.createElement("div");
    container.style.position = "absolute";
    const childContainer = document.createElement("div");
    childContainer.style.position = "relative";
    childContainer.style.overflow = "hidden";
    container.appendChild(childContainer);
    this._childContainer = childContainer;
    this.container().appendChild(container);
  }

  unmount() {
    this.container().removeChild(this.getChildContainer().parentElement);
  }

  container() {
    return this.glProvider().container();
  }

  getChildContainer() {
    return this._childContainer;
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

  /**
   * Sets the mouse cursor bitmap by this canvas.
   *
   * @param {string} cursorType CSS cursor style
   */
  setCursor(cursorType: string): void {
    this.shared().setCursor(cursorType);
  }

  textureSize() {
    return this.shared().textureSize();
  }

  overlay() {
    return this.shared().overlay();
  }

  overlayCanvas() {
    return this.shared().overlayCanvas();
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
