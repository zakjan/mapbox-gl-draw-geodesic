import MapboxDraw from "@mapbox/mapbox-gl-draw";

export const { cursors, geojsonTypes, events, meta, activeStates } =
  MapboxDraw.constants;

export const modes = {
  ...MapboxDraw.modes,
  DRAW_CIRCLE: "draw_circle",
  DRAW_LINE_STRING: "draw_line_string",
  DRAW_POLYGON: "draw_polygon",
  DRAW_POINT: "draw_point",
  SIMPLE_SELECT: "simple_select",
  DIRECT_SELECT: "direct_select",
  STATIC: "static",
};

export const properties = {
  CIRCLE_RADIUS: "circleRadius",
  CIRCLE_HANDLE_BEARING: "circleHandleBearing",
};
