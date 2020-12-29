import { distance, bearing, midpoint, destinationPoint } from './geodesy';

const START = [-10, 10];
const END = [10, 20];
const ANTIMERIDIAN_START = [START[0] + 180, START[1]];
const ANTIMERIDIAN_END = [END[0] + 180, END[1]];
const DISTANCE = 2500;
const BEARING = 45;

describe('geodesy', () => {
  describe('distance', () => {
    it('returns a distance between two points', () => {
      const expectedResult = 2415.245706566322;
      const result = distance(START, END);
      expect(result).toBeCloseTo(expectedResult);
    });
  });

  describe('bearing', () => {
    it('returns a bearing between two points', () => {
      const expectedResult = 60.27725948947449;
      const result = bearing(START, END);
      expect(result).toBeCloseTo(expectedResult);
    });
  });

  describe('midpoint', () => {
    it('returns a midpoint', () => {
      const expectedResult = [-0.2368335172296524, 15.22061673537366];
      const result = midpoint(START, END);
      expect(result).toBeDeepCloseTo(expectedResult);
    });

    it('returns a midpoint crossing antimeridian', () => {
      const expectedResult = [179.76316648277034, 15.22061673537366];
      const result = midpoint(ANTIMERIDIAN_START, ANTIMERIDIAN_END);
      expect(result).toBeDeepCloseTo(expectedResult);
    });
  });

  describe('destinationPoint', () => {
    it('returns a destination point', () => {
      const expectedResult = [7.397366003472031, 25.26122691668291];
      const result = destinationPoint(START, DISTANCE, BEARING);
      expect(result).toBeDeepCloseTo(expectedResult);
    });
    it('returns a destination point crossing antimeridian', () => {
      const expectedResult = [187.39736600347203, 25.26122691668291];
      const result = destinationPoint(ANTIMERIDIAN_START, DISTANCE, BEARING);
      expect(result).toBeDeepCloseTo(expectedResult);
    });
  });
});