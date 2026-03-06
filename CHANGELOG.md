# Changelog

## [1.4.0] — 2026-03-06

### Enhanced: Number Formatter element

**New formatting fields:**
- **Style** — choose between `decimal`, `currency`, `percent`, or `unit`
- **Notation** — `standard`, `compact`, `scientific`, or `engineering`
- **Currency code** — dynamic ISO 4217 code (e.g. `USD`, `EUR`, `JPY`)
- **Currency display** — `symbol` ($), `narrowSymbol`, `code` (USD), or `name` (US dollars)
- **Unit** — any supported unit (e.g. `kilometer-per-hour`, `celsius`, `liter`)
- **Unit display** — `long`, `short`, or `narrow`

**New precision fields:**
- **Minimum fraction digits** — force a minimum number of decimal places
- **Maximum fraction digits** — cap the number of decimal places
- **Use grouping** — control thousands separators (`auto`, `always`, or `false`)
- **Sign display** — control +/- sign (`auto`, `always`, `exceptZero`, `negative`, `never`)

**New output states:**
- **Formatted number** — clearer-named output (identical to legacy "Compacted number")
- **Formatted parts (JSON)** — `formatToParts()` output for custom rendering
- **Error message** — surfaces formatting errors (bad currency code, invalid JSON, etc.)

**Other improvements:**
- Full try/catch error handling
- Reorganized fields with section labels for clarity
- Updated captions and docs across all fields
- Fully backward compatible — existing `Compacted number` state still works

## [1.0.0 – 1.3.2]

Previous versions. Core functionality: takes a number and formats it using `Intl.NumberFormat` with compact notation.

- Compact display: `long`, `short`, `narrow`
- Locale support
- Advanced options JSON escape hatch
