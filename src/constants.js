import { modes as originalModes } from '@mapbox/mapbox-gl-draw/src/constants.js';
export { cursors, geojsonTypes, events, meta, activeStates } from '@mapbox/mapbox-gl-draw/src/constants.js';

export const modes = {
    ...originalModes,
    DRAW_CIRCLE: 'draw_circle'
};

export const properties = {
    CIRCLE_RADIUS: 'circleRadius',
    CIRCLE_HANDLE_BEARING: 'circleHandleBearing'
};