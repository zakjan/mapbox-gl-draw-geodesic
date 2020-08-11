
import * as Constants from '../constants';
import patchDrawLineString from './draw_line_string';
import patchDrawPolygon from './draw_polygon';
import DrawCircle from './draw_circle';
import patchDrawPoint from './draw_point';
import patchSimpleSelect from './simple_select';
import patchDirectSelect from './direct_select';
import Static from './static';

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