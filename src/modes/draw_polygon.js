import createGeodesicGeojson from '../utils/create_geodesic_geojson.js';

function patchDrawPolygon(DrawPolygon) {
  const DrawPolygonPatched = { ...DrawPolygon };

  DrawPolygonPatched.toDisplayFeatures = function(state, geojson, display) {
    const displayGeodesic = (geojson) => {
      const geodesicGeojson = createGeodesicGeojson(geojson, { ctx: this._ctx });
      geodesicGeojson.forEach(display);
    };
    
    DrawPolygon.toDisplayFeatures.call(this, state, geojson, displayGeodesic);
  };

  return DrawPolygonPatched;
}

export default patchDrawPolygon;