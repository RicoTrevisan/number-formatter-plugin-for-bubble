# Formatter callback regression tests

Run from the repository root with Node **24.19.0** (pinned in `.node-version`):

```sh
npm ci
npx playwright install --with-deps chromium firefox webkit
npm test
```

`npm run test:contract` runs three Node contract checks. `npm run test:browser`
runs 38 scenarios in each of Chromium, Firefox and WebKit (114 checks).
Playwright **1.63.0** and its browser revisions are locked. CI uses the same
commands on Ubuntu 24.04 and retains failure traces. The server binds only to
`127.0.0.1:4182`, is managed by Playwright, and refuses reuse of an existing server.
Browser requests outside that origin are blocked.

No production build or TypeScript migration is needed. Both elements execute
directly against browser-native `Intl`; their headers and `lib/index.js` are empty.
The old `lib/package.json` build placeholder is unused and preserved. Although
plugin metadata enables Bubble's jQuery support, neither formatter consumes it.
There are no external runtime dependencies to bundle or load from a CDN.

The fixture imports the installed shared harness and fetches the actual decoded
`initialize.js`, `update.js`, and `reset.js` from both `number-formatter-AAC` and
`date-formatter-ABG`. There are no element actions; metadata contracts detect if
that changes. Compilation happens via the harness's `new Function` in the browser
realm with its supplied callback signatures. No callback is substituted or wrapped
with a pretend implementation. Loading HTTP errors and malformed bodies fail tests.

Each instance receives its own actual DOM canvas, persistent data and explicit
empty context. The formatters consume no canvas methods. Inputs in `inputs.mjs`
are authored test data, checked against field names but never generated from
schema defaults. Date strings are converted to real browser Date objects before
calling update. Readiness means both sets of source bodies have loaded and
compiled; callbacks are synchronous, so no arbitrary sleeps or invented events
are needed. Shared harness state/history records observe publications, not Bubble
database persistence.

Coverage includes:

- Currency, percent scaling, units, grouping, rounding, zero/string precision,
  sign, compact/scientific notation and advanced options overriding conflicting
  fields while preserving locale.
- Malformed JSON, null and invalid options, invalid locales, currencies, units,
  timezones and dates; output clearing and recovery. Every successful numeric
  scenario checks the legacy `compacted_number` output against `formatted_number`.
- Preset/custom dates and fallbacks, UTC/New York/Tokyo, previous-day rollover,
  winter/summer offsets, hour cycles, locales and advanced date overrides.
- Equal, ascending and reversed ranges, removing an endpoint, range errors
  preserving the main date, recovery, and empty dates clearing prior success,
  range and error states (even with malformed advanced JSON).
- Repeated updates, independent instances/canvases/data, publication history,
  no emitted events, and actual empty initialize/reset behavior. Reset preserves
  prior data, states and history; the test does not invent cleanup.
- Callback compilation, declared field/state/action contracts, and package
  version/archive integrity.

Expected values are independently specified literals and semantic date/number
parts, never calculated with another Intl formatter. Parts joining the formatted
output is an additional consistency check. Only nonbreaking spaces are normalized;
range assertions check endpoint digits in order and month text without fixing ICU
range punctuation. Engine-specific error prose is not fixed; the plugin's
`formatRange error:` prefix is asserted.

Reversed ranges are intentionally not treated as errors: all three pinned engines
accept them, matching the current
[ECMA-402 range algorithm](https://tc39.es/ecma402/#sec-partitiondatetimerangepattern).
It rejects invalid clipped date values but does not require ascending endpoints.
The error regression uses a real invalid Date as the endpoint, without mocking Intl.
No production bug was demonstrated and no production source was changed.

## Shared package provenance and upgrades

- Package: `@rico/bubble-element-test-harness@0.1.0`.
- Source: [ricotrevisan/bubble-plugin-test-harness](https://github.com/ricotrevisan/bubble-plugin-test-harness),
  commit `49ddc2b45664dc1fe0329ba051d4db5502c4ddec`.
- Archive: `vendor/rico-bubble-element-test-harness-0.1.0.tgz`, copied unchanged
  from the validated Tiptap consumer at commit `20406fb`.
- SHA-256: `717423e3f159b72923afac5338f8d52f1c5b4213b89e1674d97fce2d640d3fdd`.

The root dev dependency uses a relative `file:vendor/...tgz` path; the committed
lockfile also pins SHA-512 integrity. CI needs no sibling checkout, workstation
path or npm publication. The shared source/reference repositories are read-only
for this adoption; there is no divergent local copy of the harness implementation.

For an upgrade, use a newly versioned harness archive after its source unit,
type and package checks pass. Copy it into `vendor/`, run
`npm install --save-dev --save-exact ./vendor/<new-version>.tgz`, update this
provenance and the archive contract, and run a clean `npm ci` plus `npm test`.
Commit the archive, manifest and lockfile together. Never overwrite a distributed
version or point a dependency at a developer checkout. No registry publication is
part of this procedure.

## Limits and remaining Bubble verification

This is a local callback execution seam, not a Bubble emulator. It does not test
editor/dynamic-expression resolution, actual supplied empty values, scheduling,
state delivery to dependent elements/workflows, repeating-group lifecycle or
app-specific layout. Intl locale data beyond these fixed scenarios remains
browser-dependent. Actual Bubble checks must verify both elements on the intended
authorized preview branch, including updates, errors, clearing and repeating-group
instances. No Bubble pull/push/upload/watch, app changes or remote verification
was performed for this task. There are no shared-package integration blockers.
