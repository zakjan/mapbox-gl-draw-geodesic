import createGeodesicGeojson from '../utils/create_geodesic_geojson';

function patchDrawPoint(DrawPoint) {
  const DrawPointPatched = { ...DrawPoint };

  DrawPointPatched.toDisplayFeatures = function(state, geojson, display) {
    const displayGeodesic = (geojson) => {
      const geodesicGeojson = createGeodesicGeojson(geojson, { ctx: this._ctx });
      geodesicGeojson.forEach(display);
    };

    DrawPoint.toDisplayFeatures.call(this, state, geojson, displayGeodesic);
  };

  return DrawPointPatched;
}

export default patchDrawPoint;