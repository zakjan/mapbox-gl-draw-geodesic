import * as Constants from '../constants.js';
import { createCircle, isCircle, getCircleCenter, setCircleCenter, getCircleRadius, setCircleRadius } from './circle_geojson.js';

const CENTER = [0, 0];
const NEW_CENTER = [10, 0];
const RADIUS = 100;
const NEW_RADIUS = 200;
const INVALID_RADIUS = 0;

describe('createCircle', () => {
  it('returns a circle', () => {
    const expectedResult = {
      type: Constants.geojsonTypes.FEATURE,
      properties: {
        [Constants.properties.CIRCLE_RADIUS]: RADIUS
      },
      geometry: {
        type: Constants.geojsonTypes.POLYGON,
        coordinates: [[CENTER, CENTER, CENTER, CENTER]]
      }
    };
    const result = createCircle(CENTER, RADIUS);
    expect(result).toMatchObject(expectedResult);
  });

  it('throws for an invalid circle', () => {
    expect(() => createCircle(CENTER, INVALID_RADIUS)).toThrow();
  });
});

describe('isCircle', () => {
  it('returns false for a polygon', () => {
    const polygon = {
      type: Constants.geojsonTypes.FEATURE,
      properties: {},
      geometry: {
        type: Constants.geojsonTypes.POLYGON,
        coordinates: [[CENTER, CENTER, CENTER, CENTER]]
      }
    };

    const expectedResult = false;
    const result = isCircle(polygon);
    expect(result).toEqual(expectedResult);
  });

  it('returns true for a valid circle', () => {
    const circle = createCircle(CENTER, RADIUS);

    const expectedResult = true;
    const result = isCircle(circle);
    expect(result).toEqual(expectedResult);
  });

  it('returns false for an invalid circle', () => {
    const circle = createCircle(CENTER, RADIUS);
    circle.properties[Constants.properties.CIRCLE_RADIUS] = INVALID_RADIUS;

    const expectedResult = false;
    const result = isCircle(circle);
    expect(result).toEqual(expectedResult);
  });
});

describe('getCircleCenter', () => {
  it('returns a circle center', () => {
    const circle = createCircle(CENTER, RADIUS);

    const expectedResult = CENTER;
    const result = getCircleCenter(circle);
    expect(result).toEqual(expectedResult);
  });

  it('throws for an invalid circle', () => {
    const circle = createCircle(CENTER, RADIUS);
    circle.properties[Constants.properties.CIRCLE_RADIUS] = INVALID_RADIUS;

    expect(() => getCircleCenter(circle)).toThrow();
  });
});

describe('setCircleCenter', () => {
  it('sets a circle center', () => {
    const circle = createCircle(CENTER, RADIUS);
    setCircleCenter(circle, NEW_CENTER);

    const expectedResult = NEW_CENTER;
    const result = getCircleCenter(circle);
    expect(result).toEqual(expectedResult);
  });

  it('throws for an invalid circle', () => {
    const circle = createCircle(CENTER, RADIUS);
    circle.properties[Constants.properties.CIRCLE_RADIUS] = INVALID_RADIUS;

    expect(() => setCircleCenter(circle, NEW_CENTER)).toThrow();
  });
});

describe('getCircleRadius', () => {
  it('returns a circle radius', () => {
    const circle = createCircle(CENTER, RADIUS);

    const expectedResult = RADIUS;
    const result = getCircleRadius(circle);
    expect(result).toEqual(expectedResult);
  });

  it('throws for an invalid circle', () => {
    const circle = createCircle(CENTER, RADIUS);
    circle.properties[Constants.properties.CIRCLE_RADIUS] = INVALID_RADIUS;

    expect(() => getCircleRadius(circle)).toThrow();
  });
});

describe('setCircleRadius', () => {
  it('sets a circle radius', () => {
    const circle = createCircle(CENTER, RADIUS);
    setCircleRadius(circle, NEW_RADIUS);

    const expectedResult = NEW_RADIUS;
    const result = getCircleRadius(circle);
    expect(result).toEqual(expectedResult);
  });

  it('throws for an invalid circle', () => {
    const circle = createCircle(CENTER, RADIUS);
    circle.properties[Constants.properties.CIRCLE_RADIUS] = INVALID_RADIUS;

    expect(() => setCircleRadius(circle, NEW_RADIUS)).toThrow();
  });
});