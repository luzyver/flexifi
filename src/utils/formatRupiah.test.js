import test from 'node:test';
import assert from 'node:assert/strict';
import { formatRupiah, parseRupiahToNumber } from './formatRupiah.js';

test('formatRupiah formats numbers correctly', () => {
  assert.strictEqual(formatRupiah(1000), 'Rp 1.000');
});

test('formatRupiah formats string numbers correctly', () => {
  assert.strictEqual(formatRupiah('2500'), 'Rp 2.500');
});

test('formatRupiah handles negative values', () => {
  assert.strictEqual(formatRupiah(-500), '-Rp 500');
});

test('formatRupiah returns Rp 0 for invalid input', () => {
  assert.strictEqual(formatRupiah('abc'), 'Rp 0');
  assert.strictEqual(formatRupiah(undefined), 'Rp 0');
});

test('parseRupiahToNumber parses formatted strings to numbers', () => {
  assert.strictEqual(parseRupiahToNumber('Rp 1.000'), 1000);
});

test('parseRupiahToNumber handles negative values by returning positive numbers', () => {
  assert.strictEqual(parseRupiahToNumber('-Rp 500'), 500);
});

test('parseRupiahToNumber returns 0 for invalid input', () => {
  assert.strictEqual(parseRupiahToNumber('invalid'), 0);
  assert.strictEqual(parseRupiahToNumber(null), 0);
});
