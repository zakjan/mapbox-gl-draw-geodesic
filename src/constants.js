import MapboxDraw from '@mapbox/mapbox-gl-draw';

export const { cursors, geojsonTypes, events, meta, activeStates } = MapboxDraw.constants;

export const modes = {
  ...MapboxDraw.modes,
  DRAW_CIRCLE: 'draw_circle'
};

export const properties = {
  CIRCLE_RADIUS: 'circleRadius',
  CIRCLE_HANDLE_BEARING: 'circleHandleBearing'
};