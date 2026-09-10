import { expect } from '@playwright/test';
import { numberInput, dateInput } from '../inputs.mjs';

export async function openFixture(page, kind) {
  // Network dependencies must remain local; no CDN fallback can hide a missing asset.
  await page.route('**/*', route => {
    if (new URL(route.request().url()).origin !== 'http://127.0.0.1:4182') {
      return route.abort('blockedbyclient');
    }
    return route.continue();
  });
  await page.goto('/tests/browser/fixture.html');
  await page.waitForFunction(() => window.ready === true);
  await page.evaluate(kind => { window.h = window.makeHarness(kind); }, kind);
}

export async function update(page, kind, overrides = {}) {
  const properties = { ...(kind === 'number' ? numberInput : dateInput), ...overrides };
  return page.evaluate(({ kind, properties }) => {
    if (kind === 'date') {
      for (const field of ['date', 'end_date']) {
        if (properties[field] !== null) properties[field] = new Date(properties[field]);
      }
    }
    window.h.update(properties);
    return { ...window.h.states };
  }, { kind, properties });
}

export function partsOf(states, kind) {
  expect(states.error_message).toBe('');
  const parts = JSON.parse(states.formatted_parts);
  expect(parts.length).toBeGreaterThan(0);
  for (const part of parts) {
    expect(typeof part.type).toBe('string');
    expect(typeof part.value).toBe('string');
  }
  // This is a consistency check, in addition to independent expectations in tests.
  // Some ICU versions use different spaces for format versus formatToParts.
  const normalizeSpaces = value => value.replace(/[\u00a0\u202f]/g, ' ');
  expect(normalizeSpaces(parts.map(part => part.value).join('')))
    .toBe(normalizeSpaces(states[kind === 'number' ? 'formatted_number' : 'formatted_date']));
  if (kind === 'number') expect(states.compacted_number).toBe(states.formatted_number);
  return Object.fromEntries(parts.filter(part => part.type !== 'literal').map(part => [part.type, part.value]));
}

export function expectCleared(states, kind) {
  for (const key of kind === 'number'
    ? ['formatted_number', 'compacted_number', 'formatted_parts']
    : ['formatted_date', 'formatted_range', 'formatted_parts']) {
    expect(states[key]).toBe('');
  }
}
