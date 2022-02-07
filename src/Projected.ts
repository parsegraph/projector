import Projector from "./Projector";

export default interface Projected {
  /**
   * Runs the render loop for this projected element.
   *
   * @param {number} cycleTime is the timestamp of this cycle.
   * @returns {boolean} true if the projected has changed
   */
  tick(cycleTime: number): boolean;

  /**
   * Commits this projected element to the given projector.
   *
   * @returns {boolean} true if painting is incomplete
   */
  paint(projector: Projector, timeout?: number): boolean;

  /**
   * Renders this projected element on the given projector.
   *
   * @return {boolean} true if rendering is incomplete.
   */
  render(projector: Projector, width: number, height: number): boolean;

  /**
   * Remove all data for the given projector.
   */
  unmount(projector: Projector): void;

  /**
   * Notify this projected that the GL context has been lost or
   * gained.
   */
  contextChanged(projector: Projector, isLost: boolean): void;

  /**
   * Sets the listener for this projected, to be notified when
   * the projected needs to be painted or rendered.
   */
  setOnScheduleUpdate(listener: () => void, listenerObj?: object): void;
}
