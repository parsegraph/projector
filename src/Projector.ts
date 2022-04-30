import { GLProvider } from "parsegraph-compileprogram";

export default interface Projector {
  /**
   * Returns the GL context provider for this projector. The GL context
   * will be clipped.
   */
  glProvider(): GLProvider;

  /**
   * Returns this projector's main container.
   */
  container(): HTMLElement;

  /**
   * Returns true if this projector has a 2D overlay.
   */
  hasOverlay(): boolean;

  /**
   * Returns the 2D canvas context for this projector.
   */
  overlay(): CanvasRenderingContext2D;

  /**
   * Returns the 2D canvas HTML element for this projector. The 2D canvas will be clipped.
   */
  overlayCanvas(): HTMLCanvasElement;

  /**
   * Returns true if this Projector has a DOM container.
   */
  hasDOMContainer(): boolean;

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
  setCursor(cursorType: string): void;

  /**
   * Returns the optimal texture size for this projector.
   */
  textureSize(): number;

  /**
   * Returns true if this projector is designed to be offscreen.
   */
  isOffscreen(): boolean;

  /**
   * Returns true if this projector has an audio context.
   */
  hasAudio(): boolean;

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
 *
 * @return {HTMLDivElement} the child container
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
  childContainer.style.width = "100%";
  childContainer.style.height = "100%";
  childContainer.style.pointerEvents = "none";
  container.appendChild(childContainer);

  return childContainer;
}
