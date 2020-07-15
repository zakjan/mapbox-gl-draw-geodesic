(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@mapbox/mapbox-gl-draw')) :
  typeof define === 'function' && define.amd ? define(['exports', '@mapbox/mapbox-gl-draw'], factory) :
  (global = global || self, factory(global.MapboxDrawGeodesic = {}, global.MapboxDraw));
}(this, (function (exports, MapboxDraw) { 'use strict';

  MapboxDraw = MapboxDraw && Object.prototype.hasOwnProperty.call(MapboxDraw, 'default') ? MapboxDraw['default'] : MapboxDraw;

  const cursors = {
    ADD: 'add',
    MOVE: 'move',
    DRAG: 'drag',
    POINTER: 'pointer',
    NONE: 'none'
  };
  const geojsonTypes = {
    FEATURE: 'Feature',
    POLYGON: 'Polygon',
    LINE_STRING: 'LineString',
    POINT: 'Point',
    FEATURE_COLLECTION: 'FeatureCollection',
    MULTI_PREFIX: 'Multi',
    MULTI_POINT: 'MultiPoint',
    MULTI_LINE_STRING: 'MultiLineString',
    MULTI_POLYGON: 'MultiPolygon'
  };
  const modes = {
    DRAW_LINE_STRING: 'draw_line_string',
    DRAW_POLYGON: 'draw_polygon',
    DRAW_POINT: 'draw_point',
    SIMPLE_SELECT: 'simple_select',
    DIRECT_SELECT: 'direct_select',
    STATIC: 'static'
  };
  const events = {
    CREATE: 'draw.create',
    DELETE: 'draw.delete',
    UPDATE: 'draw.update',
    SELECTION_CHANGE: 'draw.selectionchange',
    MODE_CHANGE: 'draw.modechange',
    ACTIONABLE: 'draw.actionable',
    RENDER: 'draw.render',
    COMBINE_FEATURES: 'draw.combine',
    UNCOMBINE_FEATURES: 'draw.uncombine'
  };
  const meta = {
    FEATURE: 'feature',
    MIDPOINT: 'midpoint',
    VERTEX: 'vertex'
  };
  const activeStates = {
    ACTIVE: 'true',
    INACTIVE: 'false'
  };

  const modes$1 = {
    DRAW_CIRCLE: 'draw_circle'
  };
  const properties = {
    CIRCLE_RADIUS: 'circleRadius'
  };

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  var defineProperty = _defineProperty;

  /**
   * Returns GeoJSON for a Point representing the
   * vertex of another feature.
   *
   * @param {string} parentId
   * @param {Array<number>} coordinates
   * @param {string} path - Dot-separated numbers indicating exactly
   *   where the point exists within its parent feature's coordinates.
   * @param {boolean} selected
   * @return {GeoJSON} Point
   */

  function createVertex (parentId, coordinates, path, selected) {
    return {
      type: geojsonTypes.FEATURE,
      properties: {
        meta: meta.VERTEX,
        parent: parentId,
        coord_path: path,
        active: selected ? activeStates.ACTIVE : activeStates.INACTIVE
      },
      geometry: {
        type: geojsonTypes.POINT,
        coordinates
      }
    };
  }

  function createCommonjsModule(fn, basedir, module) {
  	return module = {
  	  path: basedir,
  	  exports: {},
  	  require: function (path, base) {
        return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
      }
  	}, fn(module, module.exports), module.exports;
  }

  function commonjsRequire () {
  	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
  }

  var hat_1 = createCommonjsModule(function (module) {
    var hat = module.exports = function (bits, base) {
      if (!base) base = 16;
      if (bits === undefined) bits = 128;
      if (bits <= 0) return '0';
      var digits = Math.log(Math.pow(2, bits)) / Math.log(base);

      for (var i = 2; digits === Infinity; i *= 2) {
        digits = Math.log(Math.pow(2, bits / i)) / Math.log(base) * i;
      }

      var rem = digits - Math.floor(digits);
      var res = '';

      for (var i = 0; i < Math.floor(digits); i++) {
        var x = Math.floor(Math.random() * base).toString(base);
        res = x + res;
      }

      if (rem) {
        var b = Math.pow(base, rem);
        var x = Math.floor(Math.random() * b).toString(base);
        res = x + res;
      }

      var parsed = parseInt(res, base);

      if (parsed !== Infinity && parsed >= Math.pow(2, bits)) {
        return hat(bits, base);
      } else return res;
    };

    hat.rack = function (bits, base, expandBy) {
      var fn = function fn(data) {
        var iters = 0;

        do {
          if (iters++ > 10) {
            if (expandBy) bits += expandBy;else throw new Error('too many ID collisions, use more bits');
          }

          var id = hat(bits, base);
        } while (Object.hasOwnProperty.call(hats, id));

        hats[id] = data;
        return id;
      };

      var hats = fn.hats = {};

      fn.get = function (id) {
        return fn.hats[id];
      };

      fn.set = function (id, value) {
        fn.hats[id] = value;
        return fn;
      };

      fn.bits = bits || 128;
      fn.base = base || 16;
      return fn;
    };
  });

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  function createCircle(center, radius, properties$1 = {}) {
    if (!(radius > 0)) {
      throw new Error('Radius has to be greater then 0');
    }

    return {
      id: hat_1(),
      type: geojsonTypes.FEATURE,
      properties: _objectSpread({
        [properties.CIRCLE_RADIUS]: radius
      }, properties$1),
      geometry: {
        type: geojsonTypes.POLYGON,
        coordinates: [[center, center, center, center, center]] // four handles (NSEW)

      }
    };
  }
  function isCircle(geojson) {
    return geojson.geometry.type === geojsonTypes.POLYGON && typeof geojson.properties[properties.CIRCLE_RADIUS] === 'number' && geojson.properties[properties.CIRCLE_RADIUS] > 0;
  }
  function getCircleCenter(geojson) {
    if (!isCircle(geojson)) {
      throw new Error('GeoJSON is not a circle');
    }

    return geojson.geometry.coordinates[0][0];
  }
  function setCircleCenter(geojson, center) {
    if (!isCircle(geojson)) {
      throw new Error('GeoJSON is not a circle');
    }

    geojson.geometry.coordinates = [[center, center, center, center, center]]; // four handles (NSEW)
  }
  function getCircleRadius(geojson) {
    if (!isCircle(geojson)) {
      throw new Error('GeoJSON is not a circle');
    }

    return geojson.properties[properties.CIRCLE_RADIUS];
  }
  function setCircleRadius(geojson, radius) {
    if (!isCircle(geojson)) {
      throw new Error('GeoJSON is not a circle');
    }

    geojson.properties[properties.CIRCLE_RADIUS] = radius;
  }

  var arc_1 = createCommonjsModule(function (module) {

    var D2R = Math.PI / 180;
    var R2D = 180 / Math.PI;

    var Coord = function Coord(lon, lat) {
      this.lon = lon;
      this.lat = lat;
      this.x = D2R * lon;
      this.y = D2R * lat;
    };

    Coord.prototype.view = function () {
      return String(this.lon).slice(0, 4) + ',' + String(this.lat).slice(0, 4);
    };

    Coord.prototype.antipode = function () {
      var anti_lat = -1 * this.lat;
      var anti_lon = this.lon < 0 ? 180 + this.lon : (180 - this.lon) * -1;
      return new Coord(anti_lon, anti_lat);
    };

    var LineString = function LineString() {
      this.coords = [];
      this.length = 0;
    };

    LineString.prototype.move_to = function (coord) {
      this.length++;
      this.coords.push(coord);
    };

    var Arc = function Arc(properties) {
      this.properties = properties || {};
      this.geometries = [];
    };

    Arc.prototype.json = function () {
      if (this.geometries.length <= 0) {
        return {
          'geometry': {
            'type': 'LineString',
            'coordinates': null
          },
          'type': 'Feature',
          'properties': this.properties
        };
      } else if (this.geometries.length == 1) {
        return {
          'geometry': {
            'type': 'LineString',
            'coordinates': this.geometries[0].coords
          },
          'type': 'Feature',
          'properties': this.properties
        };
      } else {
        var multiline = [];

        for (var i = 0; i < this.geometries.length; i++) {
          multiline.push(this.geometries[i].coords);
        }

        return {
          'geometry': {
            'type': 'MultiLineString',
            'coordinates': multiline
          },
          'type': 'Feature',
          'properties': this.properties
        };
      }
    }; // TODO - output proper multilinestring


    Arc.prototype.wkt = function () {
      var wkt_string = '';
      var wkt = 'LINESTRING(';

      var collect = function collect(c) {
        wkt += c[0] + ' ' + c[1] + ',';
      };

      for (var i = 0; i < this.geometries.length; i++) {
        if (this.geometries[i].coords.length === 0) {
          return 'LINESTRING(empty)';
        } else {
          var coords = this.geometries[i].coords;
          coords.forEach(collect);
          wkt_string += wkt.substring(0, wkt.length - 1) + ')';
        }
      }

      return wkt_string;
    };
    /*
     * http://en.wikipedia.org/wiki/Great-circle_distance
     *
     */


    var GreatCircle = function GreatCircle(start, end, properties) {
      if (!start || start.x === undefined || start.y === undefined) {
        throw new Error("GreatCircle constructor expects two args: start and end objects with x and y properties");
      }

      if (!end || end.x === undefined || end.y === undefined) {
        throw new Error("GreatCircle constructor expects two args: start and end objects with x and y properties");
      }

      this.start = new Coord(start.x, start.y);
      this.end = new Coord(end.x, end.y);
      this.properties = properties || {};
      var w = this.start.x - this.end.x;
      var h = this.start.y - this.end.y;
      var z = Math.pow(Math.sin(h / 2.0), 2) + Math.cos(this.start.y) * Math.cos(this.end.y) * Math.pow(Math.sin(w / 2.0), 2);
      this.g = 2.0 * Math.asin(Math.sqrt(z));

      if (this.g == Math.PI) {
        throw new Error('it appears ' + start.view() + ' and ' + end.view() + " are 'antipodal', e.g diametrically opposite, thus there is no single route but rather infinite");
      } else if (isNaN(this.g)) {
        throw new Error('could not calculate great circle between ' + start + ' and ' + end);
      }
    };
    /*
     * http://williams.best.vwh.net/avform.htm#Intermediate
     */


    GreatCircle.prototype.interpolate = function (f) {
      var A = Math.sin((1 - f) * this.g) / Math.sin(this.g);
      var B = Math.sin(f * this.g) / Math.sin(this.g);
      var x = A * Math.cos(this.start.y) * Math.cos(this.start.x) + B * Math.cos(this.end.y) * Math.cos(this.end.x);
      var y = A * Math.cos(this.start.y) * Math.sin(this.start.x) + B * Math.cos(this.end.y) * Math.sin(this.end.x);
      var z = A * Math.sin(this.start.y) + B * Math.sin(this.end.y);
      var lat = R2D * Math.atan2(z, Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)));
      var lon = R2D * Math.atan2(y, x);
      return [lon, lat];
    };
    /*
     * Generate points along the great circle
     */


    GreatCircle.prototype.Arc = function (npoints, options) {
      var first_pass = [];

      if (!npoints || npoints <= 2) {
        first_pass.push([this.start.lon, this.start.lat]);
        first_pass.push([this.end.lon, this.end.lat]);
      } else {
        var delta = 1.0 / (npoints - 1);

        for (var i = 0; i < npoints; ++i) {
          var step = delta * i;
          var pair = this.interpolate(step);
          first_pass.push(pair);
        }
      }
      /* partial port of dateline handling from:
        gdal/ogr/ogrgeometryfactory.cpp
         TODO - does not handle all wrapping scenarios yet
      */


      var bHasBigDiff = false;
      var dfMaxSmallDiffLong = 0; // from http://www.gdal.org/ogr2ogr.html
      // -datelineoffset:
      // (starting with GDAL 1.10) offset from dateline in degrees (default long. = +/- 10deg, geometries within 170deg to -170deg will be splited)

      var dfDateLineOffset = options && options.offset ? options.offset : 10;
      var dfLeftBorderX = 180 - dfDateLineOffset;
      var dfRightBorderX = -180 + dfDateLineOffset;
      var dfDiffSpace = 360 - dfDateLineOffset; // https://github.com/OSGeo/gdal/blob/7bfb9c452a59aac958bff0c8386b891edf8154ca/gdal/ogr/ogrgeometryfactory.cpp#L2342

      for (var j = 1; j < first_pass.length; ++j) {
        var dfPrevX = first_pass[j - 1][0];
        var dfX = first_pass[j][0];
        var dfDiffLong = Math.abs(dfX - dfPrevX);

        if (dfDiffLong > dfDiffSpace && (dfX > dfLeftBorderX && dfPrevX < dfRightBorderX || dfPrevX > dfLeftBorderX && dfX < dfRightBorderX)) {
          bHasBigDiff = true;
        } else if (dfDiffLong > dfMaxSmallDiffLong) {
          dfMaxSmallDiffLong = dfDiffLong;
        }
      }

      var poMulti = [];

      if (bHasBigDiff && dfMaxSmallDiffLong < dfDateLineOffset) {
        var poNewLS = [];
        poMulti.push(poNewLS);

        for (var k = 0; k < first_pass.length; ++k) {
          var dfX0 = parseFloat(first_pass[k][0]);

          if (k > 0 && Math.abs(dfX0 - first_pass[k - 1][0]) > dfDiffSpace) {
            var dfX1 = parseFloat(first_pass[k - 1][0]);
            var dfY1 = parseFloat(first_pass[k - 1][1]);
            var dfX2 = parseFloat(first_pass[k][0]);
            var dfY2 = parseFloat(first_pass[k][1]);

            if (dfX1 > -180 && dfX1 < dfRightBorderX && dfX2 == 180 && k + 1 < first_pass.length && first_pass[k - 1][0] > -180 && first_pass[k - 1][0] < dfRightBorderX) {
              poNewLS.push([-180, first_pass[k][1]]);
              k++;
              poNewLS.push([first_pass[k][0], first_pass[k][1]]);
              continue;
            } else if (dfX1 > dfLeftBorderX && dfX1 < 180 && dfX2 == -180 && k + 1 < first_pass.length && first_pass[k - 1][0] > dfLeftBorderX && first_pass[k - 1][0] < 180) {
              poNewLS.push([180, first_pass[k][1]]);
              k++;
              poNewLS.push([first_pass[k][0], first_pass[k][1]]);
              continue;
            }

            if (dfX1 < dfRightBorderX && dfX2 > dfLeftBorderX) {
              // swap dfX1, dfX2
              var tmpX = dfX1;
              dfX1 = dfX2;
              dfX2 = tmpX; // swap dfY1, dfY2

              var tmpY = dfY1;
              dfY1 = dfY2;
              dfY2 = tmpY;
            }

            if (dfX1 > dfLeftBorderX && dfX2 < dfRightBorderX) {
              dfX2 += 360;
            }

            if (dfX1 <= 180 && dfX2 >= 180 && dfX1 < dfX2) {
              var dfRatio = (180 - dfX1) / (dfX2 - dfX1);
              var dfY = dfRatio * dfY2 + (1 - dfRatio) * dfY1;
              poNewLS.push([first_pass[k - 1][0] > dfLeftBorderX ? 180 : -180, dfY]);
              poNewLS = [];
              poNewLS.push([first_pass[k - 1][0] > dfLeftBorderX ? -180 : 180, dfY]);
              poMulti.push(poNewLS);
            } else {
              poNewLS = [];
              poMulti.push(poNewLS);
            }

            poNewLS.push([dfX0, first_pass[k][1]]);
          } else {
            poNewLS.push([first_pass[k][0], first_pass[k][1]]);
          }
        }
      } else {
        // add normally
        var poNewLS0 = [];
        poMulti.push(poNewLS0);

        for (var l = 0; l < first_pass.length; ++l) {
          poNewLS0.push([first_pass[l][0], first_pass[l][1]]);
        }
      }

      var arc = new Arc(this.properties);

      for (var m = 0; m < poMulti.length; ++m) {
        var line = new LineString();
        arc.geometries.push(line);
        var points = poMulti[m];

        for (var j0 = 0; j0 < points.length; ++j0) {
          line.move_to(points[j0]);
        }
      }

      return arc;
    };

    {
      // nodejs
      module.exports.Coord = Coord;
      module.exports.Arc = Arc;
      module.exports.GreatCircle = GreatCircle;
    }
  });

  var arc = arc_1;

  function coordinatesEqual(x, y) {
    return x[0] === y[0] && x[1] === y[1];
  }

  function coordinatePairs(array) {
    return array.slice(0, -1).map((value, index) => [value, array[index + 1]]).filter(pair => !coordinatesEqual(pair[0], pair[1]));
  }

  function createGeodesicLine(coordinates, steps = 32) {
    const segments = coordinatePairs(coordinates);
    const geodesicSegments = segments.map(segment => {
      const greatCircle = new arc.GreatCircle({
        x: segment[0][0],
        y: segment[0][1]
      }, {
        x: segment[1][0],
        y: segment[1][1]
      });
      return greatCircle.Arc(steps, {
        offset: 90
      }).json();
    }); // arc.js returns the line crossing antimeridian split into two MultiLineString segments
    // (the first going towards to antimeridian, the second going away from antimeridian, both in range -180..180 longitude)
    // fix Mapbox rendering by merging them together, adding 360 to longitudes on the right side

    let crossed = false;
    const geodesicCoordinates = geodesicSegments.map(geodesicSegment => {
      if (geodesicSegment.geometry.type === geojsonTypes.MULTI_LINE_STRING) {
        crossed = !crossed;
        const direction = geodesicSegment.geometry.coordinates[0][0][0] > geodesicSegment.geometry.coordinates[1][0][0];
        return [...geodesicSegment.geometry.coordinates[0].map(x => [x[0] + (direction ? 0 : 360), x[1]]), ...geodesicSegment.geometry.coordinates[1].map(x => [x[0] + (direction ? 360 : 0), x[1]])];
      } else {
        return geodesicSegment.geometry.coordinates.map(x => [x[0] + (crossed ? 360 : 0), x[1]]);
      }
    }).flat();
    return geodesicCoordinates.filter((coord, index) => index === geodesicCoordinates.length - 1 || !coordinatesEqual(coord, geodesicCoordinates[index + 1]));
  }

  function toRadians(value) {
    return value / 180 * Math.PI;
  }

  function toDegrees(value) {
    return value / Math.PI * 180;
  } // copied from https://stackoverflow.com/questions/57675924/calculated-midpoint-on-map-doesnt-overlap-with-geodesic-polyline
  // see also https://www.movable-type.co.uk/scripts/latlong.html


  function getGeodesicMidpoint(startCoord, endCoord) {
    const deltaLongitude = toRadians(endCoord[0] - startCoord[0]);
    const latitude1 = toRadians(startCoord[1]);
    const latitude2 = toRadians(endCoord[1]);
    const longitude1 = toRadians(startCoord[0]);
    const Bx = Math.cos(latitude2) * Math.cos(deltaLongitude);
    const By = Math.cos(latitude2) * Math.sin(deltaLongitude);
    const latitude = Math.atan2(Math.sin(latitude1) + Math.sin(latitude2), Math.sqrt((Math.cos(latitude1) + Bx) * (Math.cos(latitude1) + Bx) + By * By));
    const longitude = longitude1 + Math.atan2(By, Math.cos(latitude1) + Bx);
    return [toDegrees(longitude), toDegrees(latitude)];
  }

  function toRadians$1(angleInDegrees) {
    return angleInDegrees * Math.PI / 180;
  }

  function toDegrees$1(angleInRadians) {
    return angleInRadians * 180 / Math.PI;
  }

  function offset(c1, distance, bearing) {
    var lat1 = toRadians$1(c1[1]);
    var lon1 = toRadians$1(c1[0]);
    var dByR = distance / 6378137; // distance divided by 6378137 (radius of the earth) wgs84

    var lat = Math.asin(Math.sin(lat1) * Math.cos(dByR) + Math.cos(lat1) * Math.sin(dByR) * Math.cos(bearing));
    var lon = lon1 + Math.atan2(Math.sin(bearing) * Math.sin(dByR) * Math.cos(lat1), Math.cos(dByR) - Math.sin(lat1) * Math.sin(lat));
    return [toDegrees$1(lon), toDegrees$1(lat)];
  }

  function validateCenter(center) {
    const validCenterLengths = [2, 3];

    if (!Array.isArray(center) || !validCenterLengths.includes(center.length)) {
      throw new Error("ERROR! Center has to be an array of length two or three");
    }

    const [lng, lat] = center;

    if (typeof lng !== "number" || typeof lat !== "number") {
      throw new Error("ERROR! Longitude and Latitude has to be numbers but where ".concat(typeof lng, " and ").concat(typeof lat));
    }

    if (lng > 180 || lng < -180) {
      throw new Error("ERROR! Longitude has to be between -180 and 180 but was ".concat(lng));
    }

    if (lat > 90 || lat < -90) {
      throw new Error("ERROR! Latitude has to be between -90 and 90 but was ".concat(lat));
    }
  }

  function validateRadius(radius) {
    if (typeof radius !== "number") {
      throw new Error("ERROR! Radius has to be a positive number but was: ".concat(typeof radius));
    }

    if (radius <= 0) {
      throw new Error("ERROR! Radius has to be a positive number but was: ".concat(radius));
    }
  }

  function validateNumberOfSegments(numberOfSegments) {
    if (typeof numberOfSegments !== "number" && numberOfSegments !== undefined) {
      throw new Error("ERROR! Number of segments has to be a number but was: ".concat(typeof numberOfSegments));
    }

    if (numberOfSegments < 3) {
      throw new Error("ERROR! Number of segments has to be at least 3 but was: ".concat(numberOfSegments));
    }
  }

  function validateInput({
    center,
    radius,
    numberOfSegments
  }) {
    validateCenter(center);
    validateRadius(radius);
    validateNumberOfSegments(numberOfSegments);
  }

  var circleToPolygon = function circleToPolygon(center, radius, numberOfSegments) {
    var n = numberOfSegments ? numberOfSegments : 32; // validateInput() throws error on invalid input and do nothing on valid input

    validateInput({
      center,
      radius,
      numberOfSegments
    });
    var coordinates = [];

    for (var i = 0; i < n; ++i) {
      coordinates.push(offset(center, radius, 2 * Math.PI * -i / n));
    }

    coordinates.push(coordinates[0]);
    return {
      type: "Polygon",
      coordinates: [coordinates]
    };
  };

  function createGeodesicCircle(center, radius, steps) {
    // circleToPolygon expects center in -180..180
    const shiftedCenter = [((center[0] + 180) % 360 + 360) % 360 - 180, center[1]];
    const shiftedPolygon = circleToPolygon(shiftedCenter, radius * 1000, steps);
    const coordinates = shiftedPolygon.coordinates[0].map(x => [x[0] + (center[0] - shiftedCenter[0]), x[1]]);
    return coordinates;
  }

  function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$1(Object(source), true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$1(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  const STEPS = 32;

  function minBy(array, func) {
    const min = Math.min(...array.map(func));
    return array.find(item => func(item) === min);
  }

  function maxBy(array, func) {
    const max = Math.max(...array.map(func));
    return array.find(item => func(item) === max);
  }

  function getCoordinate(coordinates, path) {
    const ids = path.split('.').map(x => parseInt(x, 10));
    const coordinate = ids.reduce((coordinates, id) => coordinates[id], coordinates);
    return JSON.parse(JSON.stringify(coordinate));
  }

  function createGeodesicGeojson(geojson, options) {
    options = _objectSpread$1({
      steps: STEPS
    }, options);
    const properties = geojson.properties;
    const type = geojson.geometry.type;
    const coordinates = geojson.geometry.coordinates;
    const featureId = properties.parent || properties.id;
    const featureGeojson = options.ctx.store.get(featureId).toGeoJSON();

    if (type === geojsonTypes.POINT) {
      if ((properties.meta === meta.VERTEX || properties.meta === meta.MIDPOINT) && featureGeojson && isCircle(featureGeojson)) {
        return []; // hide circle points, they are displayed in processCircle instead
      } else if (properties.meta === meta.MIDPOINT) {
        return processMidpoint(); // calculate geodesic midpoint
      } else {
        return [geojson]; // pass point as is
      }
    } else if (type === geojsonTypes.LINE_STRING) {
      return processLine(); // calculate geodesic line
    } else if (type === geojsonTypes.POLYGON) {
      if (featureGeojson && isCircle(featureGeojson)) {
        return processCircle(); // calculate geodesic circle
      } else {
        return processPolygon(); // calculate geodesic polygon
      }
    } else
      /* istanbul ignore else */
      if (type.indexOf(geojsonTypes.MULTI_PREFIX) === 0) {
        return processMultiGeometry();
      }

    function isSelectedPath(path) {
      if (!options.selectedPaths) {
        return false;
      }

      return options.selectedPaths.indexOf(path) !== -1;
    }

    function processMidpoint() {
      const coordPath = properties.coord_path; // subtract 1 from the last coord path id

      const coordPathIds = coordPath.split('.').map(x => parseInt(x, 10));
      const startCoordPath = coordPathIds.map((x, i) => x + (i === coordPathIds.length - 1 ? -1 : 0)).join('.');
      const endCoordPath = coordPath;
      const startCoord = getCoordinate(featureGeojson.geometry.coordinates, startCoordPath);
      const endCoord = getCoordinate(featureGeojson.geometry.coordinates, endCoordPath);
      const midCoord = getGeodesicMidpoint(startCoord, endCoord);

      const geodesicGeojson = _objectSpread$1(_objectSpread$1({}, geojson), {}, {
        properties: _objectSpread$1(_objectSpread$1({}, properties), {}, {
          lng: midCoord[0],
          lat: midCoord[1]
        }),
        geometry: _objectSpread$1(_objectSpread$1({}, geojson.geometry), {}, {
          coordinates: midCoord
        })
      });

      return [geodesicGeojson];
    }

    function processLine() {
      const geodesicCoordinates = createGeodesicLine(coordinates, options.steps);

      const geodesicGeojson = _objectSpread$1(_objectSpread$1({}, geojson), {}, {
        geometry: _objectSpread$1(_objectSpread$1({}, geojson.geometry), {}, {
          coordinates: geodesicCoordinates
        })
      });

      return [geodesicGeojson];
    }

    function processPolygon() {
      const geodesicCoordinates = coordinates.map(subCoordinates => {
        return createGeodesicLine(subCoordinates);
      });

      const geodesicGeojson = _objectSpread$1(_objectSpread$1({}, geojson), {}, {
        geometry: _objectSpread$1(_objectSpread$1({}, geojson.geometry), {}, {
          coordinates: geodesicCoordinates
        })
      });

      return [geodesicGeojson];
    }

    function processCircle() {
      const center = getCircleCenter(featureGeojson);
      const radius = getCircleRadius(featureGeojson);
      const geodesicCoordinates = createGeodesicCircle(center, radius, options.steps * 4);

      const geodesicGeojson = _objectSpread$1(_objectSpread$1({}, geojson), {}, {
        geometry: _objectSpread$1(_objectSpread$1({}, geojson.geometry), {}, {
          coordinates: [geodesicCoordinates]
        })
      }); // circle handles


      if (properties.active === activeStates.ACTIVE) {
        const points = [maxBy(geodesicCoordinates, x => x[0]), // north
        minBy(geodesicCoordinates, x => x[0]), // south
        maxBy(geodesicCoordinates, x => x[1]), // east
        minBy(geodesicCoordinates, x => x[1]) // west
        ];
        const vertices = points.map((point, i) => {
          return createVertex(properties.id, point, "0.".concat(i), isSelectedPath("0.".concat(i)));
        });
        return [geodesicGeojson, ...vertices];
      } else {
        return [geodesicGeojson];
      }
    }

    function processMultiGeometry() {
      const subType = type.replace(geojsonTypes.MULTI_PREFIX, '');
      const geodesicFeatures = coordinates.map(subCoordinates => {
        const subFeature = {
          type: geojsonTypes.FEATURE,
          properties: properties,
          geometry: {
            type: subType,
            coordinates: subCoordinates
          }
        };
        return createGeodesicGeojson(subFeature, options);
      }).flat();
      const geodesicCoordinates = geodesicFeatures.map(subFeature => {
        return subFeature.geometry.coordinates;
      });

      const geodesicGeojson = _objectSpread$1(_objectSpread$1({}, geojson), {}, {
        geometry: _objectSpread$1(_objectSpread$1({}, geojson.geometry), {}, {
          coordinates: geodesicCoordinates
        })
      });

      return [geodesicGeojson];
    }
  }

  function ownKeys$2(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$2(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$2(Object(source), true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$2(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  const DrawLineString = MapboxDraw.modes[modes.DRAW_LINE_STRING];

  const DrawLineStringGeodesic = _objectSpread$2({}, DrawLineString);

  DrawLineStringGeodesic.toDisplayFeatures = function (state, geojson, display) {
    const displayGeodesic = geojson => {
      const geodesicGeojson = createGeodesicGeojson(geojson, {
        ctx: this._ctx
      });
      geodesicGeojson.forEach(display);
    };

    DrawLineString.toDisplayFeatures.call(this, state, geojson, displayGeodesic);
  };

  function ownKeys$3(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$3(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$3(Object(source), true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$3(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  const DrawPolygon = MapboxDraw.modes[modes.DRAW_POLYGON];

  const DrawPolygonGeodesic = _objectSpread$3({}, DrawPolygon);

  DrawPolygonGeodesic.toDisplayFeatures = function (state, geojson, display) {
    const displayGeodesic = geojson => {
      const geodesicGeojson = createGeodesicGeojson(geojson, {
        ctx: this._ctx
      });
      geodesicGeojson.forEach(display);
    };

    DrawPolygon.toDisplayFeatures.call(this, state, geojson, displayGeodesic);
  };

  function isEscapeKey(e) {
    return e.keyCode === 27;
  }
  function isEnterKey(e) {
    return e.keyCode === 13;
  }

  var doubleClickZoom = {
    enable(ctx) {
      setTimeout(() => {
        // First check we've got a map and some context.
        if (!ctx.map || !ctx.map.doubleClickZoom || !ctx._ctx || !ctx._ctx.store || !ctx._ctx.store.getInitialConfigValue) return; // Now check initial state wasn't false (we leave it disabled if so)

        if (!ctx._ctx.store.getInitialConfigValue('doubleClickZoom')) return;
        ctx.map.doubleClickZoom.enable();
      }, 0);
    },

    disable(ctx) {
      setTimeout(() => {
        if (!ctx.map || !ctx.map.doubleClickZoom) return; // Always disable here, as it's necessary in some cases.

        ctx.map.doubleClickZoom.disable();
      }, 0);
    }

  };

  var haversineJs = haversine;
  const earth = {
    MILE: 3959,
    KM: 6371,
    M: 6371000,
    NMI: 3440
  };
  haversine.EARTH = earth;

  function haversine(start, end, options) {
    options = defaults(options);
    const startLatitude = getRadians(start.latitude, options.isRadians);
    const endLatitude = getRadians(end.latitude, options.isRadians);
    const longitudeDelta = coordinateDifference(start.longitude, end.longitude, options.isRadians);
    const c = Math.acos(Math.sin(startLatitude) * Math.sin(endLatitude) + Math.cos(startLatitude) * Math.cos(endLatitude) * Math.cos(longitudeDelta));
    return options.radius * c;
  }

  function coordinateDifference(a, b, isRadians) {
    const delta = b - a;
    return getRadians(delta, isRadians);
  }

  function getRadians(input, isRadians) {
    return isRadians ? input : input * (Math.PI / 180);
  }

  function defaults(options) {
    options = options || {};
    options.radius = options.radius || earth.MILE;
    options.isRadians = typeof options.isRadians === 'boolean' ? options.isRadians : false;
    return options;
  }

  function distance(start, end) {
    return haversineJs({
      latitude: start[1],
      longitude: start[0]
    }, {
      latitude: end[1],
      longitude: end[0]
    }, {
      radius: haversineJs.EARTH.KM
    });
  }

  const dragPan = {
    enable(ctx) {
      setTimeout(() => {
        // First check we've got a map and some context.
        if (!ctx.map || !ctx.map.dragPan || !ctx._ctx || !ctx._ctx.store || !ctx._ctx.store.getInitialConfigValue) return; // Now check initial state wasn't false (we leave it disabled if so)

        if (!ctx._ctx.store.getInitialConfigValue('dragPan')) return;
        ctx.map.dragPan.enable();
      }, 0);
    },

    disable(ctx) {
      setTimeout(() => {
        if (!ctx.map || !ctx.map.doubleClickZoom) return; // Always disable here, as it's necessary in some cases.

        ctx.map.dragPan.disable();
      }, 0);
    }

  };

  const DrawCircleGeodesic = {};

  DrawCircleGeodesic.onSetup = function (opts) {
    this.clearSelectedFeatures();
    doubleClickZoom.disable(this);
    dragPan.disable(this);
    this.updateUIClasses({
      mouse: cursors.ADD
    });
    this.setActionableState(); // default actionable state is false for all actions

    return {};
  };

  DrawCircleGeodesic.onMouseDown = DrawCircleGeodesic.onTouchStart = function (state, e) {
    const center = [e.lngLat.lng, e.lngLat.lat];
    const circle = this.newFeature(createCircle(center, Number.EPSILON));
    this.addFeature(circle);
    state.circle = circle;
  };

  DrawCircleGeodesic.onDrag = DrawCircleGeodesic.onTouchMove = function (state, e) {
    const point = [e.lngLat.lng, e.lngLat.lat];

    if (state.circle) {
      const geojson = state.circle.toGeoJSON();
      const center = getCircleCenter(geojson);
      const radius = distance(center, point);
      state.circle.setProperty(properties.CIRCLE_RADIUS, radius);
      state.circle.changed();
    }
  };

  DrawCircleGeodesic.onMouseUp = DrawCircleGeodesic.onTouchEnd = function (state, e) {
    this.map.fire(events.CREATE, {
      features: [state.circle.toGeoJSON()]
    });
    return this.changeMode(modes.SIMPLE_SELECT, {
      featureIds: [state.circle.id]
    });
  };

  DrawCircleGeodesic.onKeyUp = function (state, e) {
    if (isEscapeKey(e)) {
      if (state.circle) {
        this.deleteFeature([state.circle.id], {
          silent: true
        });
      }

      this.changeMode(modes.SIMPLE_SELECT);
    } else if (isEnterKey(e)) {
      this.changeMode(modes.SIMPLE_SELECT, {
        featureIds: [state.circle.id]
      });
    }
  };

  DrawCircleGeodesic.onStop = function () {
    this.updateUIClasses({
      mouse: cursors.NONE
    });
    doubleClickZoom.enable(this);
    dragPan.enable(this);
    this.activateUIButton();
  };

  DrawCircleGeodesic.toDisplayFeatures = function (state, geojson, display) {
    if (state.circle) {
      const isActivePolygon = geojson.properties.id === state.circle.id;
      geojson.properties.active = isActivePolygon ? activeStates.ACTIVE : activeStates.INACTIVE;
    }

    const displayGeodesic = geojson => {
      const geodesicGeojson = createGeodesicGeojson(geojson, {
        ctx: this._ctx
      });
      geodesicGeojson.forEach(display);
    };

    displayGeodesic(geojson);
  };

  function ownKeys$4(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$4(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$4(Object(source), true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$4(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  const DrawPoint = MapboxDraw.modes[modes.DRAW_POINT];

  const DrawPointGeodesic = _objectSpread$4({}, DrawPoint);

  DrawPointGeodesic.toDisplayFeatures = function (state, geojson, display) {
    const displayGeodesic = geojson => {
      const geodesicGeojson = createGeodesicGeojson(geojson, {
        ctx: this._ctx
      });
      geodesicGeojson.forEach(display);
    };

    DrawPoint.toDisplayFeatures.call(this, state, geojson, displayGeodesic);
  };

  function ownKeys$5(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$5(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$5(Object(source), true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$5(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  const SimpleSelect = MapboxDraw.modes[modes.SIMPLE_SELECT];

  const SimpleSelectGeodesic = _objectSpread$5({}, SimpleSelect);

  SimpleSelectGeodesic.toDisplayFeatures = function (state, geojson, display) {
    const displayGeodesic = geojson => {
      const geodesicGeojson = createGeodesicGeojson(geojson, {
        ctx: this._ctx
      });
      geodesicGeojson.forEach(display);
    };

    SimpleSelect.toDisplayFeatures.call(this, state, geojson, displayGeodesic);
  };

  function ownKeys$6(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$6(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$6(Object(source), true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$6(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  const DirectSelect = MapboxDraw.modes[modes.DIRECT_SELECT];

  const DirectSelectGeodesic = _objectSpread$6({}, DirectSelect);

  DirectSelectGeodesic.dragVertex = function (state, e, delta) {
    const point = [e.lngLat.lng, e.lngLat.lat];
    const geojson = state.feature.toGeoJSON();

    if (isCircle(geojson)) {
      const center = getCircleCenter(geojson);
      const radius = distance(center, point);
      state.feature.setProperty(properties.CIRCLE_RADIUS, radius);
      state.feature.changed();
    } else {
      DirectSelect.dragVertex.call(this, state, e, delta);
    }
  };

  DirectSelectGeodesic.toDisplayFeatures = function (state, geojson, display) {
    const displayGeodesic = geojson => {
      const geodesicGeojson = createGeodesicGeojson(geojson, {
        ctx: this._ctx,
        selectedPaths: state.selectedCoordPaths
      });
      geodesicGeojson.forEach(display);
    };

    DirectSelect.toDisplayFeatures.call(this, state, geojson, displayGeodesic);
  };

  const StaticGeodesic = {};

  StaticGeodesic.onSetup = function () {
    this.setActionableState(); // default actionable state is false for all actions

    return {};
  };

  StaticGeodesic.toDisplayFeatures = function (state, geojson, display) {
    const displayGeodesic = geojson => {
      const geodesicGeojson = createGeodesicGeojson(geojson, {
        ctx: this._ctx
      });
      geodesicGeojson.forEach(display);
    };

    displayGeodesic(geojson);
  };

  const modes$2 = {
    [modes.DRAW_LINE_STRING]: DrawLineStringGeodesic,
    [modes.DRAW_POLYGON]: DrawPolygonGeodesic,
    [modes$1.DRAW_CIRCLE]: DrawCircleGeodesic,
    [modes.DRAW_POINT]: DrawPointGeodesic,
    [modes.SIMPLE_SELECT]: SimpleSelectGeodesic,
    [modes.DIRECT_SELECT]: DirectSelectGeodesic,
    [modes.STATIC]: StaticGeodesic
  };

  exports.createCircle = createCircle;
  exports.getCircleCenter = getCircleCenter;
  exports.getCircleRadius = getCircleRadius;
  exports.isCircle = isCircle;
  exports.modes = modes$2;
  exports.setCircleCenter = setCircleCenter;
  exports.setCircleRadius = setCircleRadius;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=mapbox-gl-draw-geodesic.js.map
