import Projected from "./Projected";
import Projection from "./Projection";
import Projector, { createDOMContainer } from "./Projector";
import BasicProjector, { MAX_TEXTURE_SIZE } from "./BasicProjector";
import SharedProjector from "./SharedProjector";
import ImageProjector from "./ImageProjector";
import Color from "parsegraph-color";

// Background color.
const BACKGROUND_COLOR = new Color(
  // 0, 47 / 255, 57 / 255, 1,
  // 256/255, 255/255, 255/255, 1
  0,
  0,
  0,
  1
  // 45/255, 84/255, 127/255, 1
);

export {
  BasicProjector,
  MAX_TEXTURE_SIZE,
  BACKGROUND_COLOR,
  Projected,
  Projection,
  Projector,
  createDOMContainer,
  SharedProjector,
  ImageProjector,
};
