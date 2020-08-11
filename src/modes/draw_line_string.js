import createGeodesicFeature from '../utils/create_geodesic_geojson';

function patchDrawLineString(DrawLineString) {
  const DrawLineStringPatched = { ...DrawLineString };

  DrawLineStringPatched.toDisplayFeatures = function(state, geojson, display) {
    const displayGeodesic = (geojson) => {
      const geodesicGeojson = createGeodesicFeature(geojson, { ctx: this._ctx });
      geodesicGeojson.forEach(display);
    };

    DrawLineString.toDisplayFeatures.call(this, state, geojson, displayGeodesic);
  };

  return DrawLineStringPatched;
}

export default patchDrawLineString;