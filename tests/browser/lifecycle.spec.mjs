import { test, expect } from '@playwright/test';
import { numberInput, dateInput } from '../inputs.mjs';
import { openFixture } from './helpers.mjs';

for (const kind of ['number', 'date']) {
  test(`${kind}: repeated updates, isolated instances, actual no-op initialize/reset`, async ({ page }) => {
    await openFixture(page, kind);
    const result = await page.evaluate(({ kind, numberInput, dateInput }) => {
      const first = window.h;
      const second = window.makeHarness(kind);
      const initial = { states: { ...first.states }, history: [...first.history], data: { ...first.instance.data } };
      const properties = kind === 'number' ? numberInput : {
        ...dateInput, date: new Date(dateInput.date), end_date: null,
      };
      const otherProperties = kind === 'number' ? { ...properties, number: 9 } : {
        ...properties, date: new Date('2025-02-03T12:00:00.000Z'),
      };
      const data = first.instance.data;
      // Fixture-owned marker tests identity/persistence, not plugin-created state.
      data.fixtureMarker = 'first';
      second.instance.data.fixtureMarker = 'second';
      first.update(properties);
      second.update(otherProperties);
      const secondBefore = structuredClone({ states: second.states, history: second.history });
      const firstPublication = structuredClone(first.history);
      first.update(properties);
      const repeated = structuredClone(first.history);
      first.update({ ...properties, advanced_options: '{' });
      const beforeReset = structuredClone({ states: first.states, history: first.history });
      first.reset();
      const afterReset = structuredClone({ states: first.states, history: first.history });
      first.update(otherProperties);
      return {
        initial, firstPublication, repeated, beforeReset, afterReset,
        recovered: first.states, secondBefore,
        secondAfter: { states: second.states, history: second.history },
        sameData: first.instance.data === data,
        independentData: first.instance.data !== second.instance.data,
        markers: [first.instance.data.fixtureMarker, second.instance.data.fixtureMarker],
        actualCanvas: first.instance.canvas instanceof HTMLElement,
        separateCanvas: first.instance.canvas !== second.instance.canvas,
        events: [...first.events, ...second.events],
      };
    }, { kind, numberInput, dateInput });
    expect(result.initial).toEqual({ states: {}, history: [], data: {} });
    expect(result.firstPublication).toHaveLength(4);
    expect(result.repeated).toEqual([...result.firstPublication, ...result.firstPublication]);
    expect(result.afterReset).toEqual(result.beforeReset);
    expect(result.beforeReset.states.error_message.length).toBeGreaterThan(0);
    expect(result.secondAfter).toEqual(result.secondBefore);
    expect(result.sameData).toBe(true);
    expect(result.independentData).toBe(true);
    expect(result.markers).toEqual(['first', 'second']);
    expect(result.actualCanvas && result.separateCanvas).toBe(true);
    expect(result.events).toEqual([]);
    expect(result.recovered.error_message).toBe('');
    if (kind === 'number') {
      expect(result.recovered.formatted_number).toBe('9');
      expect(result.recovered.compacted_number).toBe('9');
    } else {
      const parts = JSON.parse(result.recovered.formatted_parts);
      expect(Object.fromEntries(parts.filter(p => p.type !== 'literal').map(p => [p.type, p.value])))
        .toEqual({ month: 'Feb', day: '3', year: '2025' });
    }
  });
}

test('browser source loading rejects HTTP and syntax failures', async ({ page }) => {
  await openFixture(page, 'number');
  const errors = await page.evaluate(async () => {
    const { loadCallbacks, compileCallbacks } = await import('/node_modules/@rico/bubble-element-test-harness/src/index.js');
    const messages = [];
    for (const run of [
      () => loadCallbacks({ initialize: '/src/elements/missing/initialize.js' }),
      () => compileCallbacks({ initialize: '', update: 'if (' }),
      () => compileCallbacks({ initialize: '', reset: 42 }),
    ]) {
      try { await run(); messages.push('unexpected success'); }
      catch (error) { messages.push(error.message); }
    }
    return messages;
  });
  expect(errors[0]).toMatch(/Callback fetch failed: .*missing.*HTTP 404/);
  expect(errors[1]).toMatch(/Cannot compile update:/);
  expect(errors[2]).toMatch(/reset: expected a decoded callback body/);
});
