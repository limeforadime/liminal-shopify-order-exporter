import { expect } from '@jest/globals';
import mongoose from 'mongoose';

describe('Running dumb test', () => {
  test('First dumb test', () => {
    expect(1).toEqual(1);
    expect(mongoose).toBeTruthy();
  });
});
