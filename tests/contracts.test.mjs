import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { compileCallbacks } from '@rico/bubble-element-test-harness';
import { numberInput, dateInput } from './inputs.mjs';

for (const [directory, id, input, states] of [
  ['number-formatter-AAC', 'AAC', numberInput, ['compacted_number', 'formatted_number', 'formatted_parts', 'error_message']],
  ['date-formatter-ABG', 'ABG', dateInput, ['formatted_date', 'formatted_range', 'formatted_parts', 'error_message']],
]) {
  test(`${directory}: explicit fixture and callback publications match metadata`, async () => {
    const base = new URL(`../src/elements/${directory}/`, import.meta.url);
    const metadata = JSON.parse(await readFile(new URL(`${id}.json`, base), 'utf8'));
    const fields = Object.values(metadata.fields).filter(field => field.editor !== 'Label');
    assert.deepEqual(fields.map(field => field.name).sort(), Object.keys(input).sort());
    assert.deepEqual(Object.values(metadata.states).map(state => state.name).sort(), [...states].sort());
    assert.ok(Object.values(metadata.states).every(state => state.value === 'text'));
    assert.deepEqual(metadata.actions, {});
    assert.ok(!(await readdir(base)).includes('actions'), 'add actual action bodies to the fixture if actions are introduced');
    const bodies = Object.fromEntries(await Promise.all(['initialize', 'update', 'reset'].map(async kind =>
      [kind, await readFile(new URL(`${kind}.js`, base), 'utf8')])));
    assert.doesNotThrow(() => compileCallbacks(bodies));
    // Current source uses literal publication names; detect undeclared/missing outputs.
    const published = [...bodies.update.matchAll(/instance\.publishState\("([^"]+)"/g)].map(match => match[1]);
    assert.deepEqual([...new Set(published)].sort(), [...states].sort());
    assert.equal(bodies.initialize.trim(), '', 'new initialization needs lifecycle assertions');
    assert.equal(bodies.reset.trim(), '', 'new reset behavior needs lifecycle assertions');
    assert.equal((await readFile(new URL('headers.html', base), 'utf8')).trim(), '',
      'new runtime dependencies must be installed locally and loaded in the browser fixture');
  });
}

test('vendored harness version, source archive and installed entry are pinned', async () => {
  const archive = await readFile(new URL('../vendor/rico-bubble-element-test-harness-0.1.0.tgz', import.meta.url));
  assert.equal(createHash('sha256').update(archive).digest('hex'),
    '717423e3f159b72923afac5338f8d52f1c5b4213b89e1674d97fce2d640d3fdd');
  const installed = JSON.parse(await readFile(new URL('../node_modules/@rico/bubble-element-test-harness/package.json', import.meta.url), 'utf8'));
  assert.equal(installed.name, '@rico/bubble-element-test-harness');
  assert.equal(installed.version, '0.1.0');
  const manifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
  assert.equal(manifest.devDependencies[installed.name], 'file:vendor/rico-bubble-element-test-harness-0.1.0.tgz');
});
