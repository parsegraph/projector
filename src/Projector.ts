import { GLProvider } from "parsegraph-compileprogram";

export default interface Projector {
  glProvider(): GLProvider;
  overlay(): CanvasRenderingContext2D;
  overlayCanvas(): HTMLCanvasElement;
  getChildContainer(): HTMLDivElement;
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
