import { modes as originalModes } from '@mapbox/mapbox-gl-draw/src/constants';
export { cursors, geojsonTypes, events, meta, activeStates } from '@mapbox/mapbox-gl-draw/src/constants';

export const modes = {
    ...originalModes,
    DRAW_CIRCLE: 'draw_circle'
};

export const properties = {
    CIRCLE_RADIUS: 'circleRadius'
};