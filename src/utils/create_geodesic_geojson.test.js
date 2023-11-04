import MapboxDraw from '@mapbox/mapbox-gl-draw';
import Point from '../feature_types/point.js';
import LineString from '../feature_types/line_string.js';
import Polygon from '../feature_types/polygon.js';
import MultiFeature from '../feature_types/multi_feature.js';
import * as Constants from '../constants.js';
import { createCircle } from './circle_geojson.js';
import createGeodesicGeojson from './create_geodesic_geojson.js';

function createMapMock() {
  return {
    project(x) {
      return x;
    },
    unproject(x) {
      return x;
    }
  };
}

function createStoreMock() {
  const features = [];
  return {
    get(id) {
      return features.find((feature) => feature.id === id);
    },
    add(feature) {
      features.push(feature);
    }
  };
}

function createCtxMock() {
  return {
    options: {},
    store: createStoreMock()
  };
}

function createModeMock() {
  return {
    _ctx: createCtxMock(),
    newFeature(geojson) {
      const type = geojson.geometry.type;
      if (type === Constants.geojsonTypes.POINT) return new Point(this._ctx, geojson);
      if (type === Constants.geojsonTypes.LINE_STRING) return new LineString(this._ctx, geojson);
      if (type === Constants.geojsonTypes.POLYGON) return new Polygon(this._ctx, geojson);
      return new MultiFeature(this._ctx, geojson);
    },
    addFeature(feature) {
      return this._ctx.store.add(feature);
    }
  }
}

function createGeojson(type, coordinates, properties = {}) {
  return {
    type: Constants.geojsonTypes.FEATURE,
    properties: {
      ...properties
    },
    geometry: {
      type,
      coordinates
    }
  };
}

function createGeojsonMatch(type, properties = {}) {
  return {
    properties,
    geometry: {
      type
    }
  };
}

const STEPS = 8;
const COORDINATE = [0, 0];
const COORDINATES = [[-40, 37.5], [40, 37.5], [40, 30], [-40, -30], [-40, -37.5], [40, -37.5]];
const RADIUS = 100;

describe('createGeodesicGeojson', () => {
  let map;
  let mode;

  beforeEach(() => {
    map = createMapMock();
    mode = createModeMock();
  });

  it('returns a point', () => {
    const feature = mode.newFeature(createGeojson(Constants.geojsonTypes.POINT, COORDINATE));
    mode.addFeature(feature);
    const internalGeojson = feature.internal();

    const expectedResult = [createGeojsonMatch(Constants.geojsonTypes.POINT)];
    const result = createGeodesicGeojson(internalGeojson, { ctx: mode._ctx });
    expect(result.length).toEqual(expectedResult.length);
    expect(result).toMatchObject(expectedResult);
  });

  it('returns a line', () => {
    const feature = mode.newFeature(createGeojson(Constants.geojsonTypes.LINE_STRING, COORDINATES));
    mode.addFeature(feature);
    const internalGeojson = feature.internal();

    const expectedResult = [createGeojsonMatch(Constants.geojsonTypes.LINE_STRING)];
    const result = createGeodesicGeojson(internalGeojson, { ctx: mode._ctx, steps: STEPS });
    expect(result.length).toEqual(expectedResult.length);
    expect(result).toMatchObject(expectedResult);
  });

  it('returns a line midpoint', () => {
    const feature = mode.newFeature(createGeojson(Constants.geojsonTypes.LINE_STRING, COORDINATES));
    mode.addFeature(feature);
    const internalGeojson = MapboxDraw.lib.createMidPoint(
      feature.id,
      MapboxDraw.lib.createVertex(feature.id, feature.getCoordinate('0'), '0', false),
      MapboxDraw.lib.createVertex(feature.id, feature.getCoordinate('1'), '1', false),
      map
    );

    const expectedResult = [createGeojsonMatch(Constants.geojsonTypes.POINT)];
    const result = createGeodesicGeojson(internalGeojson, { ctx: mode._ctx, steps: STEPS });
    expect(result.length).toEqual(expectedResult.length);
    expect(result).toMatchObject(expectedResult);
  });

  it('returns a multipoint', () => {
    const feature = mode.newFeature(createGeojson(Constants.geojsonTypes.MULTI_POINT, [COORDINATE]));
    mode.addFeature(feature);
    const internalGeojson = feature.internal();

    const expectedResult = [createGeojsonMatch(Constants.geojsonTypes.MULTI_POINT)];
    const result = createGeodesicGeojson(internalGeojson, { ctx: mode._ctx });
    expect(result.length).toEqual(expectedResult.length);
    expect(result).toMatchObject(expectedResult);
  });

  it('returns a polygon', () => {
    const feature = mode.newFeature(createGeojson(Constants.geojsonTypes.POLYGON, [COORDINATES]));
    mode.addFeature(feature);
    const internalGeojson = feature.internal();

    const expectedResult = [createGeojsonMatch(Constants.geojsonTypes.POLYGON)];
    const result = createGeodesicGeojson(internalGeojson, { ctx: mode._ctx, steps: STEPS });
    expect(result.length).toEqual(expectedResult.length);
    expect(result).toMatchObject(expectedResult);
  });

  it('returns a polygon midpoint', () => {
    const feature = mode.newFeature(createGeojson(Constants.geojsonTypes.POLYGON, [COORDINATES]));
    mode.addFeature(feature);
    const internalGeojson = MapboxDraw.lib.createMidPoint(
      feature.id,
      MapboxDraw.lib.createVertex(feature.id, feature.getCoordinate('0.0'), '0.0', false),
      MapboxDraw.lib.createVertex(feature.id, feature.getCoordinate('0.1'), '0.1', false),
      map
    );

    const expectedResult = [createGeojsonMatch(Constants.geojsonTypes.POINT)];
    const result = createGeodesicGeojson(internalGeojson, { ctx: mode._ctx, steps: STEPS });
    expect(result.length).toEqual(expectedResult.length);
    expect(result).toMatchObject(expectedResult);
  });

  it('returns a polygon midpoint, last midpoint', () => {
    const feature = mode.newFeature(createGeojson(Constants.geojsonTypes.POLYGON, [COORDINATES]));
    mode.addFeature(feature);
    const internalGeojson = MapboxDraw.lib.createMidPoint(
      feature.id,
      MapboxDraw.lib.createVertex(feature.id, feature.getCoordinate(`0.${COORDINATES.length - 2}`), `0.${COORDINATES.length - 2}`, false),
      MapboxDraw.lib.createVertex(feature.id, feature.getCoordinate('0.0'), `0.${COORDINATES.length - 1}`, false),
      map
    );

    const expectedResult = [createGeojsonMatch(Constants.geojsonTypes.POINT)];
    const result = createGeodesicGeojson(internalGeojson, { ctx: mode._ctx, steps: STEPS });
    expect(result.length).toEqual(expectedResult.length);
    expect(result).toMatchObject(expectedResult);
  });

  it('returns a multiline', () => {
    const feature = mode.newFeature(createGeojson(Constants.geojsonTypes.MULTI_LINE_STRING, [COORDINATES]));
    mode.addFeature(feature);
    const internalGeojson = feature.internal();

    const expectedResult = [createGeojsonMatch(Constants.geojsonTypes.MULTI_LINE_STRING)];
    const result = createGeodesicGeojson(internalGeojson, { ctx: mode._ctx, steps: STEPS });
    expect(result.length).toEqual(expectedResult.length);
    expect(result).toMatchObject(expectedResult);
  });

  it('returns a multiline midpoint', () => {
    const feature = mode.newFeature(createGeojson(Constants.geojsonTypes.MULTI_LINE_STRING, [COORDINATES]));
    mode.addFeature(feature);
    const internalGeojson = MapboxDraw.lib.createMidPoint(
      feature.id,
      MapboxDraw.lib.createVertex(feature.id, feature.getCoordinate('0.0'), '0.0', false),
      MapboxDraw.lib.createVertex(feature.id, feature.getCoordinate('0.1'), '0.1', false),
      map
    );

    const expectedResult = [createGeojsonMatch(Constants.geojsonTypes.POINT)];
    const result = createGeodesicGeojson(internalGeojson, { ctx: mode._ctx, steps: STEPS });
    expect(result.length).toEqual(expectedResult.length);
    expect(result).toMatchObject(expectedResult);
  });

  it('returns a multipolygon', () => {
    const feature = mode.newFeature(createGeojson(Constants.geojsonTypes.MULTI_POLYGON, [[COORDINATES]]));
    mode.addFeature(feature);
    const internalGeojson = feature.internal();

    const expectedResult = [createGeojsonMatch(Constants.geojsonTypes.MULTI_POLYGON)];
    const result = createGeodesicGeojson(internalGeojson, { ctx: mode._ctx, steps: STEPS });
    expect(result.length).toEqual(expectedResult.length);
    expect(result).toMatchObject(expectedResult);
  });

  it('returns a multipolygon midpoint', () => {
    const feature = mode.newFeature(createGeojson(Constants.geojsonTypes.MULTI_POLYGON, [[COORDINATES]]));
    mode.addFeature(feature);
    const internalGeojson = MapboxDraw.lib.createMidPoint(
      feature.id,
      MapboxDraw.lib.createVertex(feature.id, feature.getCoordinate('0.0.0'), '0.0.0', false),
      MapboxDraw.lib.createVertex(feature.id, feature.getCoordinate('0.0.1'), '0.0.1', false),
      map
    );

    const expectedResult = [createGeojsonMatch(Constants.geojsonTypes.POINT)];
    const result = createGeodesicGeojson(internalGeojson, { ctx: mode._ctx, steps: STEPS });
    expect(result.length).toEqual(expectedResult.length);
    expect(result).toMatchObject(expectedResult);
  });

  it('returns a multipolygon midpoint, last midpoint', () => {
    const feature = mode.newFeature(createGeojson(Constants.geojsonTypes.MULTI_POLYGON, [[COORDINATES]]));
    mode.addFeature(feature);
    const internalGeojson = MapboxDraw.lib.createMidPoint(
      feature.id,
      MapboxDraw.lib.createVertex(feature.id, feature.getCoordinate(`0.0.${COORDINATES.length - 2}`), `0.0.${COORDINATES.length - 2}`, false),
      MapboxDraw.lib.createVertex(feature.id, feature.getCoordinate('0.0.0'), `0.0.${COORDINATES.length - 1}`, false),
      map
    );

    const expectedResult = [createGeojsonMatch(Constants.geojsonTypes.POINT)];
    const result = createGeodesicGeojson(internalGeojson, { ctx: mode._ctx, steps: STEPS });
    expect(result.length).toEqual(expectedResult.length);
    expect(result).toMatchObject(expectedResult);
  });

  it('returns a circle', () => {
    const feature = mode.newFeature(createCircle(COORDINATE, RADIUS));
    mode.addFeature(feature);
    const internalGeojson = feature.internal();

    const expectedResult = [createGeojsonMatch(Constants.geojsonTypes.POLYGON)];
    const result = createGeodesicGeojson(internalGeojson, { ctx: mode._ctx, steps: STEPS });
    expect(result.length).toEqual(expectedResult.length);
    expect(result).toMatchObject(expectedResult);
  });

  it('hides a circle vertex', () => {
    const feature = mode.newFeature(createCircle(COORDINATE, RADIUS));
    mode.addFeature(feature);
    const internalGeojson = MapboxDraw.lib.createVertex(feature.id, feature.getCoordinate('0.0'), '0.0', false);

    const expectedResult = [];
    const result = createGeodesicGeojson(internalGeojson, { ctx: mode._ctx, steps: STEPS });
    expect(result.length).toEqual(expectedResult.length);
    expect(result).toMatchObject(expectedResult);
  });

  it('hides a circle midpoint', () => {
    const feature = mode.newFeature(createCircle(COORDINATE, RADIUS));
    mode.addFeature(feature);
    const internalGeojson = MapboxDraw.lib.createMidPoint(
      feature.id,
      MapboxDraw.lib.createVertex(feature.id, feature.getCoordinate('0.0'), '0.0', false),
      MapboxDraw.lib.createVertex(feature.id, feature.getCoordinate('0.1'), '0.1', false),
      map
    );

    const expectedResult = [];
    const result = createGeodesicGeojson(internalGeojson, { ctx: mode._ctx, steps: STEPS });
    expect(result.length).toEqual(expectedResult.length);
    expect(result).toMatchObject(expectedResult);
  });

  it('returns circle handles', () => {
    const feature = mode.newFeature(createCircle(COORDINATE, RADIUS));
    mode.addFeature(feature);
    const internalGeojson = feature.internal();
    internalGeojson.properties.active = Constants.activeStates.ACTIVE;

    const expectedResult = [
      createGeojsonMatch(Constants.geojsonTypes.POLYGON),
      createGeojsonMatch(Constants.geojsonTypes.POINT),
      createGeojsonMatch(Constants.geojsonTypes.POINT)
    ];
    const result = createGeodesicGeojson(internalGeojson, { ctx: mode._ctx, steps: STEPS });
    expect(result.length).toEqual(expectedResult.length);
    expect(result).toMatchObject(expectedResult);
  });

  it('returns circle handles, one active', () => {
    const feature = mode.newFeature(createCircle(COORDINATE, RADIUS));
    mode.addFeature(feature);
    const internalGeojson = feature.internal();
    internalGeojson.properties.active = Constants.activeStates.ACTIVE;

    const expectedResult = [
      createGeojsonMatch(Constants.geojsonTypes.POLYGON),
      createGeojsonMatch(Constants.geojsonTypes.POINT, { active: Constants.activeStates.ACTIVE }),
      createGeojsonMatch(Constants.geojsonTypes.POINT)
    ];
    const result = createGeodesicGeojson(internalGeojson, { ctx: mode._ctx, selectedPaths: ['0.0'], steps: STEPS });
    expect(result.length).toEqual(expectedResult.length);
    expect(result).toMatchObject(expectedResult);
  });
});