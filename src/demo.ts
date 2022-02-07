console.log("DEMO!");

import Color from "parsegraph-color";
import TimingBelt from "parsegraph-timingbelt";
import BasicProjector from "./BasicProjector";
import Projection from "./Projection";
import Projector from "./Projector";
import Projected from "./Projected";
import Rect from "parsegraph-rect";
import SharedProjector from "./SharedProjector";

class Demo implements Projected {
  _content: Map<Projector, HTMLDivElement>;

  constructor() {
    this._content = new Map();
  }

  tick(_: number): boolean {
    return false;
  }

  paint(projector: Projector): boolean {
    if (!this._content.has(projector)) {
      const div = document.createElement("div");
      div.style.color = "yellow";
      div.style.backgroundColor = "blue";
      div.style.position = "absolute";
      div.style.display = "none";
      div.innerText = "This is from a div!";
      projector.getDOMContainer().appendChild(div);
      this._content.set(projector, div);
    }
    return false;
  }

  render(projector: Projector, width: number, height: number): boolean {
    const div = this._content.get(projector);
    div.style.display = "initial";
    div.style.transform = `translate(${Math.round(
      Math.random() * width
    )}px, ${Math.round(Math.random() * height)}px)`;
    div.style.transformOrigin = "top left";

    const ctx = projector.overlay();
    ctx.fillStyle = "red";
    ctx.fillRect(0, 0, width, height);
    ctx.font = "16px serif";
    ctx.fillStyle = "white";
    ctx.textBaseline = "top";
    ctx.fillText(
      "This is rendering from a projector",
      Math.random() * width,
      Math.random() * height
    );
    return false;
  }

  unmount(_: Projector): void {}

  contextChanged(): void {}

  setOnScheduleUpdate(): void {}

  dispose() {}

}

class BG implements Projected {
  _content: Map<Projector, HTMLDivElement>;

  constructor() {
    this._content = new Map();
  }

  tick(_: number): boolean {
    return false;
  }

  paint(): boolean {
    return false;
  }

  render(projector: Projector): boolean {
    const ctx = projector.overlay();
    ctx.fillStyle = "#111";
    ctx.fillRect(
      0,
      0,
      projector.overlayCanvas().width,
      projector.overlayCanvas().height
    );
    return false;
  }

  unmount(_: Projector): void {}

  dispose() {}

  contextChanged(): void {}

  setOnScheduleUpdate(): void {}
}

document.addEventListener("DOMContentLoaded", () => {
  const belt = new TimingBelt();

  // Background
  let projector = new BasicProjector(new Color(0, 0, 0, 1));
  document.getElementById("root").appendChild(projector.container());
  belt.addRenderable(new Projection(projector, new BG()));

  // Objects
  projector = new BasicProjector(new Color(0, 0, 0, 0));
  document.getElementById("root").appendChild(projector.container());

  const demo = new Demo();
  const proj = new Projection(projector, demo);
  proj.setClip(new Rect(50, 50, 250, 250));
  belt.addRenderable(proj);

  let shared = new SharedProjector(projector);
  const proj2 = new Projection(shared, demo);
  proj2.setClip(new Rect(350, 50, 250, 250));
  belt.addRenderable(proj2);

  shared = new SharedProjector(projector);
  const proj3 = new Projection(shared, demo);
  proj3.setClip(new Rect(650, 50, 250, 250));
  belt.addRenderable(proj3);

  document.getElementById("schedule-update").addEventListener("click", () => {
    belt.scheduleUpdate();
  });
});
