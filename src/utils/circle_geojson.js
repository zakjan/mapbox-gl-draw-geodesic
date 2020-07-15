import * as Constants from '@mapbox/mapbox-gl-draw/src/constants';
import hat from 'hat';
import * as ConstantsGeodesic from '../constants';

export function createCircle(center, radius, properties = {}) {
  if (!(radius > 0)) {
    throw new Error('Radius has to be greater then 0');
  }

  return {
    id: hat(),
    type: Constants.geojsonTypes.FEATURE,
    properties: {
      [ConstantsGeodesic.properties.CIRCLE_RADIUS]: radius, // km
      ...properties
    },
    geometry: {
      type: Constants.geojsonTypes.POLYGON,
      coordinates: [[center, center, center, center, center]] // four handles (NSEW)
    }
  };
}

export function isCircle(geojson) {
  return geojson.geometry.type === Constants.geojsonTypes.POLYGON &&
    typeof geojson.properties[ConstantsGeodesic.properties.CIRCLE_RADIUS] === 'number' &&
    geojson.properties[ConstantsGeodesic.properties.CIRCLE_RADIUS] > 0;
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

  geojson.geometry.coordinates = [[center, center, center, center, center]]; // four handles (NSEW)
}

export function getCircleRadius(geojson) {
  if (!isCircle(geojson)) {
    throw new Error('GeoJSON is not a circle');
  }

  return geojson.properties[ConstantsGeodesic.properties.CIRCLE_RADIUS];
}

export function setCircleRadius(geojson, radius) {
  if (!isCircle(geojson)) {
    throw new Error('GeoJSON is not a circle');
  }

  geojson.properties[ConstantsGeodesic.properties.CIRCLE_RADIUS] = radius;
}