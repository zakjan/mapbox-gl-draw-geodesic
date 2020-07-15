import MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as Constants from '@mapbox/mapbox-gl-draw/src/constants';
import createGeodesicGeojson from '../utils/create_geodesic_geojson';

const SimpleSelect = MapboxDraw.modes[Constants.modes.SIMPLE_SELECT];

const SimpleSelectGeodesic = { ...SimpleSelect };

SimpleSelectGeodesic.toDisplayFeatures = function(state, geojson, display) {
  const displayGeodesic = (geojson) => {
    const geodesicGeojson = createGeodesicGeojson(geojson, { ctx: this._ctx });
    geodesicGeojson.forEach(display);
  };

  SimpleSelect.toDisplayFeatures.call(this, state, geojson, displayGeodesic);
};

export default SimpleSelectGeodesic;