import { test, expect } from '@playwright/test';
import { openFixture, update, partsOf, expectCleared } from './helpers.mjs';

test.beforeEach(async ({ page }) => openFixture(page, 'number'));

const cases = [
  ['currency with cents', { number: 42.5, style: 'currency', currency: 'USD' }, '$42.50', { currency: '$', integer: '42', fraction: '50' }],
  ['percent scales by 100', { number: 0.8542, style: 'percent', maximumFractionDigits: 2 }, '85.42%', { percentSign: '%', fraction: '42' }],
  ['compound unit', { number: 100, style: 'unit', unit: 'kilometer-per-hour' }, '100 km/h', { integer: '100', unit: 'km/h' }],
  ['long unit', { number: 3, style: 'unit', unit: 'liter', unitDisplay: 'long' }, '3 liters', { unit: 'liters' }],
  ['grouping auto', {}, '1,234.5', { group: ',', decimal: '.', fraction: '5' }],
  ['grouping always', { useGrouping: 'always' }, '1,234.5', { group: ',' }],
  ['grouping disabled and precision strings', { useGrouping: 'false', minimumFractionDigits: '2', maximumFractionDigits: '2' }, '1234.50', { integer: '1234', fraction: '50' }],
  ['rounding and positive sign', { number: 1.236, maximumFractionDigits: 2, signDisplay: 'always' }, '+1.24', { plusSign: '+', fraction: '24' }],
  ['zero precision is honored', { number: 42.8, maximumFractionDigits: 0 }, '43', { integer: '43' }],
  ['compact legacy output', { number: 1234567, notation: 'compact' }, '1.2M', { compact: 'M', fraction: '2' }],
  ['scientific notation', { number: 1234, notation: 'scientific' }, '1.234E3', { exponentInteger: '3' }],
  ['advanced overrides every conflicting option but locale', {
    number: 1234.56, locale: 'de-DE', style: 'currency', currency: 'INVALID',
    notation: 'compact', useGrouping: 'always', signDisplay: 'never',
    minimumFractionDigits: 9, maximumFractionDigits: 1,
    advanced_options: '{"style":"decimal","useGrouping":false,"minimumFractionDigits":1,"maximumFractionDigits":1,"signDisplay":"always"}',
  }, '+1234,6', { plusSign: '+', integer: '1234', decimal: ',', fraction: '6' }],
];

for (const [name, input, expected, expectedParts] of cases) {
  test(name, async ({ page }) => {
    const states = await update(page, 'number', input);
    expect(states.formatted_number.replace(/[\u00a0\u202f]/g, ' ')).toBe(expected);
    expect(partsOf(states, 'number')).toMatchObject(expectedParts);
    if (input.useGrouping === 'false') {
      expect(JSON.parse(states.formatted_parts).some(part => part.type === 'group')).toBe(false);
    }
  });
}

for (const [name, input] of [
  ['malformed JSON', { advanced_options: '{' }],
  ['null options', { advanced_options: 'null' }],
  ['invalid advanced option', { advanced_options: '{"notation":"invalid"}' }],
  ['missing currency', { style: 'currency', currency: '' }],
  ['invalid unit', { style: 'unit', unit: 'not-a-unit' }],
  ['inverted precision', { minimumFractionDigits: 3, maximumFractionDigits: 1 }],
  ['invalid locale', { locale: 'not_a_locale' }],
]) {
  test(`${name} clears outputs and recovers`, async ({ page }) => {
    partsOf(await update(page, 'number'), 'number');
    const error = await update(page, 'number', input);
    expectCleared(error, 'number');
    expect(error.error_message.trim().length).toBeGreaterThan(0);
    const recovered = await update(page, 'number', { number: 7 });
    expect(recovered.formatted_number).toBe('7');
    expect(partsOf(recovered, 'number')).toEqual({ integer: '7' });
  });
}
