import * as CommonSelectors from '@mapbox/mapbox-gl-draw/src/lib/common_selectors.js';
import doubleClickZoom from '@mapbox/mapbox-gl-draw/src/lib/double_click_zoom.js';
import * as Constants from '../constants.js';
import { createCircle, getCircleCenter } from '../utils/circle_geojson.js';
import { distance, initialBearing } from '../utils/geodesy.js';
import createGeodesicGeojson from '../utils/create_geodesic_geojson.js';
import dragPan from '../utils/drag_pan.js';

const DrawCircleGeodesic = {};

DrawCircleGeodesic.onSetup = function(opts) {
  this.clearSelectedFeatures();
  doubleClickZoom.disable(this);
  dragPan.disable(this);
  this.updateUIClasses({ mouse: Constants.cursors.ADD });
  this.setActionableState(); // default actionable state is false for all actions
  return {};
};

DrawCircleGeodesic.onMouseDown = DrawCircleGeodesic.onTouchStart = function(state, e) {
  const center = [e.lngLat.lng, e.lngLat.lat];
  const circle = this.newFeature(createCircle(center, Number.EPSILON));
  this.addFeature(circle);
  state.circle = circle;
};

DrawCircleGeodesic.onDrag = DrawCircleGeodesic.onTouchMove = function(state, e) {
  if (state.circle) {
    const geojson = state.circle.toGeoJSON();
    const center = getCircleCenter(geojson);
    const handle = [e.lngLat.lng, e.lngLat.lat];
    const radius = distance(center, handle);
    const handleBearing = initialBearing(center, handle);
    state.circle.properties[Constants.properties.CIRCLE_RADIUS] = radius;
    state.circle[Constants.properties.CIRCLE_HANDLE_BEARING] = handleBearing;
    state.circle.changed();
  }
};

DrawCircleGeodesic.onMouseUp = DrawCircleGeodesic.onTouchEnd = function(state, e) {
  this.map.fire(Constants.events.CREATE, { features: [state.circle.toGeoJSON()] });
  return this.changeMode(Constants.modes.SIMPLE_SELECT, { featureIds: [state.circle.id] });
};

DrawCircleGeodesic.onKeyUp = function(state, e) {
  if (CommonSelectors.isEscapeKey(e)) {
    if (state.circle) {
      this.deleteFeature([state.circle.id], { silent: true });
    }
    this.changeMode(Constants.modes.SIMPLE_SELECT);
  } else if (CommonSelectors.isEnterKey(e)) {
    this.changeMode(Constants.modes.SIMPLE_SELECT, { featureIds: [state.circle.id] });
  }
};

DrawCircleGeodesic.onStop = function() {
  this.updateUIClasses({ mouse: Constants.cursors.NONE });
  doubleClickZoom.enable(this);
  dragPan.enable(this);
  this.activateUIButton();
}

DrawCircleGeodesic.toDisplayFeatures = function(state, geojson, display) {
  if (state.circle) {
    const isActivePolygon = geojson.properties.id === state.circle.id;
    geojson.properties.active = (isActivePolygon) ? Constants.activeStates.ACTIVE : Constants.activeStates.INACTIVE;
  }

  const displayGeodesic = (geojson) => {
    const geodesicGeojson = createGeodesicGeojson(geojson, { ctx: this._ctx });
    geodesicGeojson.forEach(display);
  };

  displayGeodesic(geojson);
};

export default DrawCircleGeodesic;