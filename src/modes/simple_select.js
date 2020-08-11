import createGeodesicGeojson from '../utils/create_geodesic_geojson';

function patchSimpleSelect(SimpleSelect) {
  const SimpleSelectPatched = { ...SimpleSelect };

  SimpleSelectPatched.toDisplayFeatures = function(state, geojson, display) {
    const displayGeodesic = (geojson) => {
      const geodesicGeojson = createGeodesicGeojson(geojson, { ctx: this._ctx });
      geodesicGeojson.forEach(display);
    };

    SimpleSelect.toDisplayFeatures.call(this, state, geojson, displayGeodesic);
  };

  return SimpleSelectPatched;
}

export default patchSimpleSelect;