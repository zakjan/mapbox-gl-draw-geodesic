import * as Constants from '../constants';
import { isCircle, getCircleCenter } from '../utils/circle_geojson';
import distance from '../utils/distance';
import createGeodesicGeojson from '../utils/create_geodesic_geojson';

function patchDirectSelect(DirectSelect) {
  const DirectSelectPatched = { ...DirectSelect };

  DirectSelectPatched.dragVertex = function(state, e, delta) {
    const point = [e.lngLat.lng, e.lngLat.lat];
    const geojson = state.feature.toGeoJSON();

    if (isCircle(geojson)) {
      const center = getCircleCenter(geojson);
      const radius = distance(center, point);
      state.feature.setProperty(Constants.properties.CIRCLE_RADIUS, radius);
      state.feature.changed();
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