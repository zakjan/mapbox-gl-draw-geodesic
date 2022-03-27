import hat from 'hat';
import * as Constants from '../constants';

export function createCircle(center, radius, properties = {}) {
  if (!(radius > 0)) {
    throw new Error('Radius has to be greater then 0');
  }

  return {
    id: hat(),
    type: Constants.geojsonTypes.FEATURE,
    properties: {
      [Constants.properties.CIRCLE_RADIUS]: radius, // km
      ...properties
    },
    geometry: {
      type: Constants.geojsonTypes.POLYGON,
      coordinates: [[center, center, center, center]] // valid polygon needs 3 vertices
    }
  };
}

export function isCircleByTypeAndProperties(type, properties) {
  return type === Constants.geojsonTypes.POLYGON &&
    typeof properties[Constants.properties.CIRCLE_RADIUS] === 'number' &&
    properties[Constants.properties.CIRCLE_RADIUS] > 0;
}

export function isCircle(geojson) {
  return isCircleByTypeAndProperties(geojson.geometry.type, geojson.properties);
}

export function getCircleCenter(geojson) {
  if (!isCircle(geojson)) {
    throw new Error('GeoJSON is not a circle');
  }

  return geojson.geometry.coordinates[0][0];
}

export function setCircleCenter(geojson, center) {
  if (!isCircle(geojson)) {
    throw new Error('GeoJSON is not a circle');
  }

  geojson.geometry.coordinates = [[center, center, center, center]]; // valid polygon needs 3 vertices
}

export function getCircleRadius(geojson) {
  if (!isCircle(geojson)) {
    throw new Error('GeoJSON is not a circle');
  }

  return geojson.properties[Constants.properties.CIRCLE_RADIUS];
}

export function setCircleRadius(geojson, radius) {
  if (!isCircle(geojson)) {
    throw new Error('GeoJSON is not a circle');
  }

  geojson.properties[Constants.properties.CIRCLE_RADIUS] = radius;
}