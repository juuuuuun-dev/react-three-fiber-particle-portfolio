import React from 'react';
import { range, maxTextlength } from '../../helpers/Num';

describe("Num", () => {
  it('range', () => {
    const result = range(1, 2);
    expect(result).toBeLessThan(2);
  });
  it('range 1000', () => {
    const result = range(10, 1000);
    expect(result).toBeLessThan(1000);
  });
  it('range NaN', () => {
    const result = range(10);
    expect(result).toBeFalsy();
  });
  it('maxTextlength', () => {
    const arr = [
      'aaa',
      'bb'
    ];
    const result = maxTextlength(arr);
    expect(result).toBe(3);
  });
});
