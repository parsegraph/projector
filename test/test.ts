import { assert } from "chai";
import { BasicProjector } from "../src/index.lib";
import Color from "parsegraph-color";

describe("Package", function () {
  global.ResizeObserver = require("resize-observer-polyfill");
  window.ResizeObserver = require("resize-observer-polyfill");
  it("works", () => {
    assert.ok(new BasicProjector(new Color(0, 0, 0, 1)));
  });
});
