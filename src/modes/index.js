
import * as Constants from '@mapbox/mapbox-gl-draw/src/constants';
import * as ConstantsGeodesic from '../constants';
import DrawLineStringGeodesic from './draw_line_string_geodesic';
import DrawPolygonGeodesic from './draw_polygon_geodesic';
import DrawCircleGeodesic from './draw_circle_geodesic';
import DrawPointGeodesic from './draw_point_geodesic';
import SimpleSelectGeodesic from './simple_select_geodesic';
import DirectSelectGeodesic from './direct_select_geodesic';
import StaticGeodesic from './static_geodesic';

export const modes = {
    [Constants.modes.DRAW_LINE_STRING]: DrawLineStringGeodesic,
    [Constants.modes.DRAW_POLYGON]: DrawPolygonGeodesic,
    [ConstantsGeodesic.modes.DRAW_CIRCLE]: DrawCircleGeodesic,
    [Constants.modes.DRAW_POINT]: DrawPointGeodesic,
    [Constants.modes.SIMPLE_SELECT]: SimpleSelectGeodesic,
    [Constants.modes.DIRECT_SELECT]: DirectSelectGeodesic,
    [Constants.modes.STATIC]: StaticGeodesic,
};