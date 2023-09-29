
import * as Constants from '../constants.js';
import patchDrawLineString from './draw_line_string.js';
import patchDrawPolygon from './draw_polygon.js';
import DrawCircle from './draw_circle.js';
import patchDrawPoint from './draw_point.js';
import patchSimpleSelect from './simple_select.js';
import patchDirectSelect from './direct_select.js';
import Static from './static.js';

export function enable(modes) {
    return {
      ...modes,
      [Constants.modes.DRAW_LINE_STRING]: patchDrawLineString(modes[Constants.modes.DRAW_LINE_STRING]),
      [Constants.modes.DRAW_POLYGON]: patchDrawPolygon(modes[Constants.modes.DRAW_POLYGON]),
      [Constants.modes.DRAW_CIRCLE]: DrawCircle,
      [Constants.modes.DRAW_POINT]: patchDrawPoint(modes[Constants.modes.DRAW_POINT]),
      [Constants.modes.SIMPLE_SELECT]: patchSimpleSelect(modes[Constants.modes.SIMPLE_SELECT]),
      [Constants.modes.DIRECT_SELECT]: patchDirectSelect(modes[Constants.modes.DIRECT_SELECT]),
      [Constants.modes.STATIC]: Static,
    };
  }