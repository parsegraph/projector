import { GLProvider } from "parsegraph-compileprogram";

export default interface Projector {
  /**
   * Returns the GL context provider for this projector. The GL context
   * will be clipped.
   */
  glProvider(): GLProvider;

  /**
   * Returns the 2D canvas context for this projector.
   */
  overlay(): CanvasRenderingContext2D;

  /**
   * Returns the 2D canvas HTML element for this projector. The 2D canvas will be clipped.
   */
  overlayCanvas(): HTMLCanvasElement;

  /**
   * Returns the DOM element that contains child DOM elements. The DOM element will
   * be clipped.
   */
  getDOMContainer(): HTMLDivElement;

  /**
   * Sets the mouse cursor bitmap by this canvas.
   *
   * @param {string} cursorType CSS cursor style
   */
  setCursor(cursor: string): void;

  /**
   * Returns the optimal texture size for this projector.
   */
  textureSize(): number;

  /**
   * Returns true if this projector is designed to be offscreen.
   */
  isOffscreen(): boolean;

  /**
   * Returns the audio context for this projector.
   *
   * Note that audo contexts can only be created during user interaction.
   */
  audio(): AudioContext;

  /**
   * Sets the listener for this projector to respond to update events.
   */
  setOnScheduleUpdate(
    schedulerFunc: () => void,
    schedulerFuncThisArg?: any
  ): void;

  /**
   * Sets up all contexts for this projector.
   */
  render(): boolean;

  /**
   * Returns the width of the projector, in pixels.
   */
  width(): number;

  /**
   * Returns the height of the projector, in pixels.
   */
  height(): number;
}

/**
 * Creates a HTML div element intended to contain child elements for a
 * projector.
 */
export function createDOMContainer(): HTMLDivElement {
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
