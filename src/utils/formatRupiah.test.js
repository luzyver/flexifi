import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseRupiahToNumber } from './formatRupiah.js';

test('parseRupiahToNumber parses positive values', () => {
  assert.equal(parseRupiahToNumber('Rp 1.000'), 1000);
});

test('parseRupiahToNumber parses negative values', () => {
  assert.equal(parseRupiahToNumber('-Rp 1.000'), -1000);
});
