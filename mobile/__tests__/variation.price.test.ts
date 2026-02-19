import { computeVariationPrice } from '../src/utils/variation';

describe('computeVariationPrice', () => {
  test('mais_caro with multiple prices', () => {
    // If base is 30, and options are 10, 20, 25. Result should be 30.
    const r = computeVariationPrice('mais_caro', 30, [10, 20, 25]);
    expect(r).toBe(30);

    // If base is 10, and options are 20, 30. Result should be 30.
    const r2 = computeVariationPrice('mais_caro', 10, [20, 30]);
    expect(r2).toBe(30);
  });

  test('media with multiple prices', () => {
    const r = computeVariationPrice('media', 0, [10, 20, 30]);
    expect(r).toBeCloseTo(20);
  });

  test('fixo returns fixed when provided', () => {
    const r = computeVariationPrice('fixo', 50, [10, 20], 42);
    expect(r).toBe(42);
  });

  test('fallback to base when no prices', () => {
    const r1 = computeVariationPrice('mais_caro', 18, []);
    const r2 = computeVariationPrice('media', 18, []);
    const r3 = computeVariationPrice('fixo', 18, [], 0);
    expect(r1).toBe(18);
    expect(r2).toBe(18);
    expect(r3).toBe(18);
  });
});