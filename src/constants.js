import MapboxDraw from '@mapbox/mapbox-gl-draw';
const originalModes = MapboxDraw.modes;
var drawConstants;
if (typeof MapboxDraw.constants !== 'undefined') {
    drawConstants = MapboxDraw.constants
} else {
    drawConstants = await import('@mapbox/mapbox-gl-draw/src/constants');
}
export const { cursors, geojsonTypes, events, meta, activeStates } = drawConstants;

export const modes = {
    ...originalModes,
    DRAW_CIRCLE: 'draw_circle'
};

export const properties = {
    CIRCLE_RADIUS: 'circleRadius',
    CIRCLE_HANDLE_BEARING: 'circleHandleBearing'
};
