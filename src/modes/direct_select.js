import * as Constants from '../constants.js';
import { isCircle, getCircleCenter } from '../utils/circle_geojson.js';
import { distance, initialBearing } from '../utils/geodesy.js';
import createGeodesicGeojson from '../utils/create_geodesic_geojson.js';

function patchDirectSelect(DirectSelect) {
  const DirectSelectPatched = { ...DirectSelect };

  DirectSelectPatched.dragVertex = function(state, e, delta) {
    const geojson = state.feature.toGeoJSON();

    if (isCircle(geojson)) {
      if (state.selectedCoordPaths[0] === '0.1') {
        const center = getCircleCenter(geojson);
        const handle = [e.lngLat.lng, e.lngLat.lat];
        const radius = distance(center, handle);
        const handleBearing = initialBearing(center, handle);
        state.feature.properties[Constants.properties.CIRCLE_RADIUS] = radius;
        state.feature[Constants.properties.CIRCLE_HANDLE_BEARING] = handleBearing;
        state.feature.changed();
      } else {
        DirectSelect.dragFeature.call(this, state, e, delta);
      }
    } else {
      DirectSelect.dragVertex.call(this, state, e, delta);
    }
  };

  DirectSelectPatched.toDisplayFeatures = function(state, geojson, display) {
    const displayGeodesic = (geojson) => {
      const geodesicGeojson = createGeodesicGeojson(geojson, { ctx: this._ctx, selectedPaths: state.selectedCoordPaths });
      geodesicGeojson.forEach(display);
    };
    
    DirectSelect.toDisplayFeatures.call(this, state, geojson, displayGeodesic);
  };

  return DirectSelectPatched;
}

export default patchDirectSelect;