# Changelog

## [1.5.0] — 2026-03-06

### New: 📅 Date formatter element

A brand-new element wrapping `Intl.DateTimeFormat` — full locale-aware date and time formatting with zero external dependencies.

**Two formatting modes:**
- **Preset mode** — quick formatting via `dateStyle` / `timeStyle` (`full`, `long`, `medium`, `short`)
- **Custom mode** — granular control over individual components (weekday, year, month, day, hour, minute, second)

**Core fields:**
- **Date** — the date to format
- **Locale** — any BCP 47 locale (e.g. `en-US`, `ja-JP`, `de-DE`, `ar-EG`)
- **Time zone** — any IANA timezone (e.g. `America/New_York`, `Asia/Tokyo`)

**Preset mode fields:**
- **Date style** — `full`, `long`, `medium`, `short`, or `none`
- **Time style** — `full`, `long`, `medium`, `short`, or `none`

**Custom mode fields:**
- **Weekday** — `long`, `short`, `narrow`
- **Year** — `numeric`, `2-digit`
- **Month** — `numeric`, `2-digit`, `long`, `short`, `narrow`
- **Day** — `numeric`, `2-digit`
- **Hour** / **Minute** / **Second** — `numeric`, `2-digit`
- **Hour cycle** — `h12`, `h23`, `h24`, `h11`, or `auto`

**Date range formatting:**
- **End date** — when provided, uses `formatRange()` for natural ranges like "Jan 5 – 10, 2026"

**Advanced:**
- **Advanced options (JSON)** — raw JSON override for full `Intl.DateTimeFormat` access

**Output states:**
- **Formatted date** — the formatted date string
- **Formatted range** — the formatted range (empty if no end date)
- **Formatted parts (JSON)** — `formatToParts()` output for custom rendering
- **Error message** — empty on success, descriptive error on failure

---

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
