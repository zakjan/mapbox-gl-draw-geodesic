import MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as Constants from '@mapbox/mapbox-gl-draw/src/constants';
import createGeodesicGeojson from '../utils/create_geodesic_geojson';

const DrawPolygon = MapboxDraw.modes[Constants.modes.DRAW_POLYGON];

const DrawPolygonGeodesic = { ...DrawPolygon };

DrawPolygonGeodesic.toDisplayFeatures = function(state, geojson, display) {
  const displayGeodesic = (geojson) => {
    const geodesicGeojson = createGeodesicGeojson(geojson, { ctx: this._ctx });
    geodesicGeojson.forEach(display);
  };
  
  DrawPolygon.toDisplayFeatures.call(this, state, geojson, displayGeodesic);
};

export default DrawPolygonGeodesic;