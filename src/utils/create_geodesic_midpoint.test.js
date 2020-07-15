import createGeodesicMidpoint from './create_geodesic_midpoint';

const START = [-10, 10];
const END = [10, 20];
const ANTIMERIDIAN_START = [START[0] + 180, START[1]];
const ANTIMERIDIAN_END = [END[0] + 180, END[1]];

describe('createGeodesicMidpoint', () => {
  it('returns a midpoint', () => {
    const expectedResult = [-0.2368335172296524, 15.22061673537366];
    const result = createGeodesicMidpoint(START, END);
    expect(result).toBeDeepCloseTo(expectedResult);
  });

  it('returns a midpoint crossing antimeridian', () => {
    const expectedResult = [179.76316648277034, 15.22061673537366];
    const result = createGeodesicMidpoint(ANTIMERIDIAN_START, ANTIMERIDIAN_END);
    expect(result).toBeDeepCloseTo(expectedResult);
  });
});