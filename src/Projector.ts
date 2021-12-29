import { GLProvider } from "parsegraph-compileprogram";

export default interface Projector {
  glProvider(): GLProvider;
  overlay(): CanvasRenderingContext2D;
  overlayCanvas(): HTMLCanvasElement;
  getDOMContainer(): HTMLDivElement;
  setCursor(cursor: string): void;
  textureSize(): number;
  isOffscreen(): boolean;
  audio(): AudioContext;
  setOnScheduleUpdate(
    schedulerFunc: () => void,
    schedulerFuncThisArg?: any
  ): void;

  render(): boolean;
}

/**
 * Creates a HTML div element intended to contain child elements for a
 * projector.
 */
export function createDOMContainer():HTMLDivElement {
  // Setup DOM layer
  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.width = "100%";
  container.style.height = "100%";
  container.style.top = "0";
  container.style.left = "0";
  container.style.pointerEvents = "none";

  const childContainer = document.createElement("div");
  childContainer.style.position = "relative";
  childContainer.style.overflow = "hidden";
  childContainer.style.width = "100%";
  childContainer.style.height = "100%";
  childContainer.style.pointerEvents = "none";
  container.appendChild(childContainer);

  return childContainer;
}
