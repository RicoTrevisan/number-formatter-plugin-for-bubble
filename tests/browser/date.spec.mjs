import { test, expect } from '@playwright/test';
import { openFixture, update, partsOf, expectCleared } from './helpers.mjs';

test.beforeEach(async ({ page }) => openFixture(page, 'date'));

test('fixed preset date and both-none fallback', async ({ page }) => {
  for (const options of [{}, { dateStyle: 'none', timeStyle: 'none' }]) {
    const states = await update(page, 'date', options);
    expect(partsOf(states, 'date')).toEqual({ month: 'Jan', day: '2', year: '2024' });
    expect(states.formatted_range).toBe('');
  }
});

test('custom fallback and explicit locale', async ({ page }) => {
  expect(partsOf(await update(page, 'date', { mode: 'custom' }), 'date'))
    .toEqual({ month: 'January', day: '2', year: '2024' });
  expect(partsOf(await update(page, 'date', {
    mode: 'custom', locale: 'de-DE', year: 'numeric', month: '2-digit', day: '2-digit',
  }), 'date')).toEqual({ day: '02', month: '01', year: '2024' });
});

test('timezone crosses the previous day and honors custom hour cycle', async ({ page }) => {
  const input = { mode: 'custom', year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'long',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' };
  expect(partsOf(await update(page, 'date', input), 'date')).toEqual({
    weekday: 'Tuesday', year: '2024', month: '01', day: '02', hour: '00', minute: '30', second: '45',
  });
  expect(partsOf(await update(page, 'date', { ...input, timeZone: 'America/New_York' }), 'date')).toEqual({
    weekday: 'Monday', year: '2024', month: '01', day: '01', hour: '19', minute: '30', second: '45',
  });
  expect(partsOf(await update(page, 'date', { ...input, timeZone: 'America/New_York', hourCycle: 'h12' }), 'date'))
    .toMatchObject({ hour: '07', dayPeriod: 'PM' });
});

test('fixed summer timezone offset and time-only preset', async ({ page }) => {
  const states = await update(page, 'date', {
    date: '2024-07-02T00:30:45.000Z', timeZone: 'America/New_York', dateStyle: 'none', timeStyle: 'medium',
  });
  expect(partsOf(states, 'date')).toEqual({ hour: '8', minute: '30', second: '45', dayPeriod: 'PM' });
});

test('advanced overrides timezone and component/preset fields, retaining locale', async ({ page }) => {
  const states = await update(page, 'date', {
    locale: 'de-DE', timeZone: 'Invalid/Zone', mode: 'custom', year: 'invalid',
    dateStyle: 'full', timeStyle: 'full', hourCycle: 'h12',
    advanced_options: '{"timeZone":"Asia/Tokyo","year":"numeric","month":"long","day":"numeric","hour":"2-digit","minute":"2-digit","hourCycle":"h23"}',
  });
  expect(partsOf(states, 'date')).toEqual({ year: '2024', month: 'Januar', day: '2', hour: '09', minute: '30' });
});

test('range includes both independently specified endpoints and clears on removal', async ({ page }) => {
  const states = await update(page, 'date', { end_date: '2024-01-05T00:30:45.000Z' });
  expect(partsOf(states, 'date')).toEqual({ month: 'Jan', day: '2', year: '2024' });
  // ICU may collapse shared month/year and vary range punctuation/spacing.
  expect(states.formatted_range).toMatch(/Jan/);
  expect(states.formatted_range.match(/\d+/g)).toEqual(['2', '5', '2024']);
  const equal = await update(page, 'date', { end_date: '2024-01-02T00:30:45.000Z' });
  expect(equal.formatted_range).toBe(equal.formatted_date);
  expect((await update(page, 'date')).formatted_range).toBe('');
});

test('reversed range preserves endpoint order with the pinned engines', async ({ page }) => {
  // Current ECMA-402 permits reversed endpoints. Do not invent plugin validation.
  const states = await update(page, 'date', { end_date: '2024-01-01T00:30:45.000Z' });
  partsOf(states, 'date');
  expect(states.formatted_range).toMatch(/Jan/);
  expect(states.formatted_range.match(/\d+/g)).toEqual(['2', '1', '2024']);
});

test('invalid range endpoint preserves main date and recovers', async ({ page }) => {
  await update(page, 'date', { end_date: '2024-01-05T00:30:45.000Z' });
  const states = await update(page, 'date', { end_date: 'invalid-date' });
  expect(states.formatted_range).toBe('');
  expect(states.error_message).toMatch(/^formatRange error: .+/);
  expect(partsOf({ ...states, error_message: '' }, 'date'))
    .toEqual({ month: 'Jan', day: '2', year: '2024' });
  const recovered = await update(page, 'date', { end_date: '2024-01-05T00:30:45.000Z' });
  partsOf(recovered, 'date');
  expect(recovered.formatted_range.match(/\d+/g)).toEqual(['2', '5', '2024']);
});

for (const [name, input] of [
  ['malformed JSON', { advanced_options: '{' }],
  ['null options', { advanced_options: 'null' }],
  ['conflicting advanced options', { advanced_options: '{"dateStyle":"short","year":"numeric","timeZone":"UTC"}' }],
  ['invalid timezone', { timeZone: 'Invalid/Zone' }],
  ['invalid custom option', { mode: 'custom', month: 'invalid' }],
  ['invalid date', { date: 'invalid-date' }],
  ['invalid locale', { locale: 'not_a_locale' }],
]) {
  test(`${name} clears all states and recovers`, async ({ page }) => {
    await update(page, 'date', { end_date: '2024-01-05T00:30:45.000Z' });
    const states = await update(page, 'date', input);
    expectCleared(states, 'date');
    expect(states.error_message.trim().length).toBeGreaterThan(0);
    expect(partsOf(await update(page, 'date'), 'date')).toEqual({ month: 'Jan', day: '2', year: '2024' });
  });
}

test('empty date clears prior success, range and error states before parsing options', async ({ page }) => {
  for (const input of [
    { end_date: '2024-01-05T00:30:45.000Z' },
    { end_date: 'invalid-date' },
    { advanced_options: '{' },
  ]) {
    await update(page, 'date', input);
    const states = await update(page, 'date', { date: null, end_date: '2024-01-05T00:30:45.000Z', advanced_options: '{' });
    expectCleared(states, 'date');
    expect(states.error_message).toBe('');
  }
  partsOf(await update(page, 'date'), 'date');
});
