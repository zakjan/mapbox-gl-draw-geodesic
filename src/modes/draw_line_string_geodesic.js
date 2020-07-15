import MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as Constants from '@mapbox/mapbox-gl-draw/src/constants';
import createGeodesicFeature from '../utils/create_geodesic_geojson';

const DrawLineString = MapboxDraw.modes[Constants.modes.DRAW_LINE_STRING];

const DrawLineStringGeodesic = { ...DrawLineString };

DrawLineStringGeodesic.toDisplayFeatures = function(state, geojson, display) {
  const displayGeodesic = (geojson) => {
    const geodesicGeojson = createGeodesicFeature(geojson, { ctx: this._ctx });
    geodesicGeojson.forEach(display);
  };

  DrawLineString.toDisplayFeatures.call(this, state, geojson, displayGeodesic);
};

export default DrawLineStringGeodesic;