import Projector from "./Projector";

export default interface Projected {
  tick(elapsed: number): boolean;
  paint(projector: Projector, timeout?: number): boolean;
  render(projector: Projector, width: number, height: number): boolean;
  unmount(projector: Projector): void;
  contextChanged(projector: Projector, isLost: boolean): void;
  setOnScheduleUpdate(listener: () => void, listenerObj?: object): void;
}
