import MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as Constants from '../constants.js';
import { isCircleByTypeAndProperties, getCircleCenter, getCircleRadius } from './circle_geojson.js';
import createGeodesicLine from './create_geodesic_line.js';
import createGeodesicCircle from './create_geodesic_circle.js';
import { midpoint, destinationPoint } from './geodesy.js';

const STEPS = 32;
const HANDLE_BEARING = 45;

function isCircleFeature(feature) {
  return isCircleByTypeAndProperties(feature.type, feature.properties);
}

// returns path with the last coord id subtracted by 1
function getMidpointStartCoordPath(path) {
  return path.split('.').map((x, i, array) => i === array.length - 1 ? (parseInt(x, 10) - 1).toString() : x).join('.');
}

// returns path with the last coord id of a polygon overridden to 0
// see https://github.com/mapbox/mapbox-gl-draw/pull/998
function getMidpointEndCoordPath(feature, path) {
  if (feature.type === Constants.geojsonTypes.POLYGON || feature.type === Constants.geojsonTypes.MULTI_POLYGON) {
    try {
      feature.getCoordinate(path);
      return path;
    } catch (e) {
      return path.split('.').map((x, i, array) => i === array.length - 1 ? '0' : x).join('.');
    }
  } else {
    return path;
  }
}

function createGeodesicGeojson(geojson, options) {
  options = { steps: STEPS, ...options };

  const properties = geojson.properties;
  const type = geojson.geometry.type;
  const coordinates = geojson.geometry.coordinates;

  const featureId = properties.parent || properties.id;
  const feature = options.ctx.store.get(featureId);

  if (type === Constants.geojsonTypes.POINT) {
    if (isCircleFeature(feature)) {
      return []; // hide circle points, they are displayed in processCircle instead
    } else if (properties.meta === Constants.meta.MIDPOINT) {
      return processMidpoint(); // calculate geodesic midpoint
    } else {
      return [geojson]; // pass point as is
    }
  } else if (type === Constants.geojsonTypes.LINE_STRING) {
    return processLine(); // calculate geodesic line
  } else if (type === Constants.geojsonTypes.POLYGON) {
    if (isCircleFeature(feature)) {
      return processCircle(); // calculate geodesic circle
    } else {
      return processPolygon(); // calculate geodesic polygon
    }
  } else /* istanbul ignore else */ if (type.indexOf(Constants.geojsonTypes.MULTI_PREFIX) === 0) {
    return processMultiGeometry(); 
  }

  function isSelectedPath(path) {
    if (!options.selectedPaths) {
      return false;
    }
    return options.selectedPaths.indexOf(path) !== -1;
  }

  function processMidpoint() {
    const coordPath = properties.coord_path;

    const startCoordPath = getMidpointStartCoordPath(coordPath);
    const endCoordPath = getMidpointEndCoordPath(feature, coordPath);

    const startCoord = feature.getCoordinate(startCoordPath);
    const endCoord = feature.getCoordinate(endCoordPath);
    const midCoord = midpoint(startCoord, endCoord);

    const geodesicGeojson = {
      ...geojson,
      properties: {
        ...properties,
        lng: midCoord[0],
        lat: midCoord[1]
      },
      geometry: {
        ...geojson.geometry,
        coordinates: midCoord
      },
    };
    return [geodesicGeojson];
  }

  function processLine() {
    const geodesicCoordinates = createGeodesicLine(coordinates, options.steps);
    const geodesicGeojson = {
      ...geojson,
      geometry: {
        ...geojson.geometry,
        coordinates: geodesicCoordinates
      }
    };
    return [geodesicGeojson];
  }

  function processPolygon() {
    const geodesicCoordinates = coordinates.map((subCoordinates) => {
      return createGeodesicLine(subCoordinates);
    });
    const geodesicGeojson = {
      ...geojson,
      geometry: {
        ...geojson.geometry,
        coordinates: geodesicCoordinates
      }
    };
    return [geodesicGeojson];
  }

  function processCircle() {
    const featureGeojson = feature.toGeoJSON();
    const center = getCircleCenter(featureGeojson);
    const radius = getCircleRadius(featureGeojson);
    const handleBearing = feature[Constants.properties.CIRCLE_HANDLE_BEARING] || HANDLE_BEARING;
    const geodesicCoordinates = createGeodesicCircle(center, radius, handleBearing, options.steps * 4);
    const geodesicGeojson = {
      ...geojson,
      geometry: {
        ...geojson.geometry,
        coordinates: [geodesicCoordinates]
      }
    };

    // circle handles
    if (properties.active === Constants.activeStates.ACTIVE) {
      const handle = destinationPoint(center, radius, handleBearing);
      const points = [center, handle];
      const vertices = points.map((point, i) => {
        return MapboxDraw.lib.createVertex(properties.id, point, `0.${i}`, isSelectedPath(`0.${i}`));
      })
  
      return [geodesicGeojson, ...vertices];
    } else {
      return [geodesicGeojson];
    }
  }

  function processMultiGeometry() {
    const subType = type.replace(Constants.geojsonTypes.MULTI_PREFIX, '');
    const geodesicFeatures = coordinates.map((subCoordinates) => {
      const subFeature = {
        type: Constants.geojsonTypes.FEATURE,
        properties: properties,
        geometry: {
          type: subType,
          coordinates: subCoordinates
        }
      };
      return createGeodesicGeojson(subFeature, options);
    }).flat();
    const geodesicCoordinates = geodesicFeatures.map((subFeature) => {
      return subFeature.geometry.coordinates;
    });
    const geodesicGeojson = {
      ...geojson,
      geometry: {
        ...geojson.geometry,
        coordinates: geodesicCoordinates
      }
    };
    return [geodesicGeojson];
  }
}

export default createGeodesicGeojson;