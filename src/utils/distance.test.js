import distance from './distance';

describe('distance', () => {
  it('returns a distance between two points', () => {
    const expectedResult = 1111.9492664455888;
    const result = distance([0, 0], [10, 0]);
    expect(result).toBeCloseTo(expectedResult);
  });
});