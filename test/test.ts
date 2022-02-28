import { assert } from "chai";
import { BasicProjector } from "../src/index";

describe("Package", function () {
  global.ResizeObserver = require("resize-observer-polyfill");
  window.ResizeObserver = require("resize-observer-polyfill");
  it("works", () => {
    assert.ok(new BasicProjector());
  });
});
