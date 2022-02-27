console.log("DEMO!");

import TimingBelt from "parsegraph-timingbelt";
import BasicProjector from "./BasicProjector";
import Projection from "./Projection";
import Projector from "./Projector";
import Projected from "./Projected";
import Rect from "parsegraph-rect";
import SharedProjector from "./SharedProjector";
import ImageProjector from "./ImageProjector";

class Demo implements Projected {
  _content: Map<Projector, HTMLDivElement>;
  _textPos: [number, number];
  _boxPos: [number, number];

  constructor() {
    this._content = new Map();
  }

  tick(_: number): boolean {
    return false;
  }

  shuffle(width: number, height: number) {
    this._textPos = [Math.random() * width, Math.random() * height];
    this._boxPos = [Math.random() * width, Math.random() * height];
  }

  paint(projector: Projector): boolean {
    if (!this._content.has(projector)) {
      const div = document.createElement("div");
      div.style.color = "yellow";
      div.style.backgroundColor = "blue";
      div.style.position = "absolute";
      div.style.display = "none";
      div.innerText = "DOM content!";
      projector.getDOMContainer().appendChild(div);
      this._content.set(projector, div);
    }
    return false;
  }

  render(projector: Projector, width: number, height: number): boolean {
    if (this._boxPos) {
      const div = this._content.get(projector);
      div.style.display = "initial";
      div.style.transform = `translate(${Math.round(this._boxPos[0])}px, ${
        this._boxPos[1]
      }px)`;
      div.style.transformOrigin = "top left";
    }

    if (this._textPos) {
      const ctx = projector.overlay();
      ctx.fillStyle = "red";
      ctx.fillRect(0, 0, width, height);
      ctx.font = "16px serif";
      ctx.fillStyle = "white";
      ctx.textBaseline = "top";
      ctx.fillText("2D Canvas.", ...this._textPos);
    }
    return false;
  }

  unmount(_: Projector): void {}

  contextChanged(): void {}

  setOnScheduleUpdate(): void {}

  dispose() {}
}

class BG implements Projected {
  _color: [number, number, number];

  constructor() {
    this.shuffle();
  }

  tick(_: number): boolean {
    return false;
  }

  shuffle() {
    this._color = [Math.random(), Math.random(), Math.random()];
  }

  paint(): boolean {
    return false;
  }

  render(projector: Projector): boolean {
    console.log("Rendering BG");
    const gl = projector.glProvider().gl();
    gl.clearColor(this._color[0], this._color[1], this._color[2], 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    return false;
  }

  unmount(_: Projector): void {}

  dispose() {}

  contextChanged(): void {}

  setOnScheduleUpdate(): void {}
}

document.addEventListener("DOMContentLoaded", () => {
  const belt = new TimingBelt();

  // Objects
  const projector = new BasicProjector();
  document.getElementById("root").appendChild(projector.container());

  const bg = new BG();
  const demo = new Demo();
  const demoWidth = 250;
  const demoHeight = 250;
  const addScene = (projector: Projector) => {
    projector.glProvider();
    projector.overlayCanvas();
    projector.getDOMContainer();

    belt.addRenderable(new Projection(projector, bg));

    const proj = new Projection(projector, demo);
    proj.setClip(new Rect(50, 50, demoWidth, demoHeight));
    belt.addRenderable(proj);

    let shared = new SharedProjector(projector);
    const proj2 = new Projection(shared, demo);
    proj2.setClip(new Rect(350, 50, demoWidth, demoHeight));
    belt.addRenderable(proj2);

    shared = new SharedProjector(projector);
    const proj3 = new Projection(shared, demo);
    proj3.setClip(new Rect(650, 50, demoWidth, demoHeight));
    belt.addRenderable(proj3);
  };

  addScene(projector);

  const imageProjector = new ImageProjector(
    projector.width(),
    projector.height(),
    0.25
  );
  addScene(imageProjector);

  document.getElementById("shuffle").addEventListener("click", () => {
    bg.shuffle();
    demo.shuffle(demoWidth, demoHeight);
    belt.scheduleUpdate();
  });
  document.getElementById("schedule-update").addEventListener("click", () => {
    belt.scheduleUpdate();
  });
  document.getElementById("take-screenshot").addEventListener("click", () => {
    console.log("Taking screenshot");
    const screenshots = document.getElementById("screenshots");
    imageProjector.setExplicitSize(projector.width(), projector.height());
    screenshots.appendChild(imageProjector.screenshot());
    belt.scheduleUpdate();
  });
});
