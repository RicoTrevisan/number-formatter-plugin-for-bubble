# 🌐 Intl Plugin Expansion Plan

## Current State

The plugin has **one element** (`Number formatter`) that wraps `Intl.NumberFormat` with compact notation only. It exposes a single output state (`compacted_number`) and accepts a number, locale, compact display style, and an advanced JSON options escape hatch.

---

## Proposed New Elements

### 1. 🔢 **Number Formatter** (enhance existing element)

**Why:** The current element only does compact notation. `Intl.NumberFormat` supports currency, percentages, units, decimal precision, sign display, and grouping — all things Bubble devs constantly need.

**New fields to add:**
| Field | Type | Description |
|---|---|---|
| `style` | Dropdown: `decimal`, `currency`, `percent`, `unit` | Formatting style |
| `currency` | Text (dynamic) | ISO 4217 code, e.g. `USD`, `EUR` — shown when style=currency |
| `currencyDisplay` | Dropdown: `symbol`, `narrowSymbol`, `code`, `name` | How to show the currency |
| `unit` | Text (dynamic) | e.g. `kilometer-per-hour`, `liter`, `celsius` |
| `unitDisplay` | Dropdown: `long`, `short`, `narrow` | How to show the unit |
| `minimumFractionDigits` | Number | Min decimal places |
| `maximumFractionDigits` | Number | Max decimal places |
| `useGrouping` | Dropdown: `auto`, `always`, `false` | Thousand separators |
| `signDisplay` | Dropdown: `auto`, `always`, `exceptZero`, `negative`, `never` | When to show +/- |
| `notation` | Dropdown: `standard`, `scientific`, `engineering`, `compact` | Notation style |

**New output states:**
- `formatted_number` (text) — the formatted result
- `formatted_parts` (text/JSON) — `formatToParts()` output for advanced use

**Keep backward compat:** existing `compacted_number` state stays, old fields stay.

---

### 2. 📅 **Date & Time Formatter** (new element)

**Why:** Bubble's built-in date formatting is extremely limited. Devs constantly struggle with locale-aware date display, custom patterns, and time zone conversion. This is probably the **highest-value addition**.

**Fields:**
| Field | Type | Description |
|---|---|---|
| `date` | Date (dynamic) | The date to format |
| `locale` | Text (dynamic) | e.g. `en-US`, `ja-JP` |
| `dateStyle` | Dropdown: `full`, `long`, `medium`, `short`, `none` | Date portion style |
| `timeStyle` | Dropdown: `full`, `long`, `medium`, `short`, `none` | Time portion style |
| `timeZone` | Text (dynamic) | IANA timezone, e.g. `America/New_York` |
| `hour12` | Dropdown: `auto`, `yes`, `no` | 12h vs 24h clock |
| `weekday` | Dropdown: `long`, `short`, `narrow`, `none` | Day name display |
| `year` | Dropdown: `numeric`, `2-digit`, `none` | Year display |
| `month` | Dropdown: `numeric`, `2-digit`, `long`, `short`, `narrow`, `none` | Month display |
| `day` | Dropdown: `numeric`, `2-digit`, `none` | Day display |
| `hour` | Dropdown: `numeric`, `2-digit`, `none` | Hour display |
| `minute` | Dropdown: `numeric`, `2-digit`, `none` | Minute display |
| `second` | Dropdown: `numeric`, `2-digit`, `none` | Second display |
| `advanced_options` | Text (dynamic, JSON) | Full override |

**Output states:**
- `formatted_date` (text) — the formatted result
- `formatted_parts` (text/JSON) — `formatToParts()` for custom layouts

**Bonus: Date Range Formatting**
| Field | Type | Description |
|---|---|---|
| `end_date` | Date (dynamic, optional) | If set, uses `formatRange()` → "Jan 5 – 10, 2026" |

**Output:**
- `formatted_range` (text)

---

### 3. ⏰ **Relative Time Formatter** (new element)

**Why:** "3 days ago", "in 2 hours", "yesterday" — devs hack this together constantly. `Intl.RelativeTimeFormat` does it natively with locale support.

**Fields:**
| Field | Type | Description |
|---|---|---|
| `value` | Number (dynamic) | The numeric value (e.g. -3) |
| `unit` | Dropdown: `year`, `quarter`, `month`, `week`, `day`, `hour`, `minute`, `second` | Time unit |
| `locale` | Text (dynamic) | e.g. `en-US` |
| `style` | Dropdown: `long`, `short`, `narrow` | Verbosity |
| `numeric` | Dropdown: `always`, `auto` | `auto` → "yesterday" vs `always` → "1 day ago" |

**Output states:**
- `relative_time` (text) — e.g. "3 days ago", "in 2 hours"

**Bonus: Auto-compute mode** (most useful for Bubble devs):
| Field | Type | Description |
|---|---|---|
| `target_date` | Date (dynamic, optional) | If set, auto-computes the value & unit relative to now |
- Automatically picks the best unit (seconds → minutes → hours → days → months → years)

---

### 4. 📋 **List Formatter** (new element)

**Why:** Bubble devs constantly need to join lists into human-readable strings. `Intl.ListFormat` handles "A, B, and C" vs "A, B, or C" with locale-aware conjunctions and Oxford commas.

**Fields:**
| Field | Type | Description |
|---|---|---|
| `items` | Text (list, dynamic) | The list of strings to join |
| `locale` | Text (dynamic) | e.g. `en-US`, `de-DE` |
| `type` | Dropdown: `conjunction`, `disjunction`, `unit` | "and" vs "or" vs plain |
| `style` | Dropdown: `long`, `short`, `narrow` | Verbosity |

**Output states:**
- `formatted_list` (text) — e.g. "Apples, Bananas, and Cherries"

---

### 5. 🏷️ **Display Names** (new element)

**Why:** Show human-readable names for languages, countries, currencies, and scripts in any locale. Perfect for building language pickers, country selectors, and currency displays.

**Fields:**
| Field | Type | Description |
|---|---|---|
| `code` | Text (dynamic) | The code to look up (e.g. `en`, `US`, `USD`) |
| `type` | Dropdown: `language`, `region`, `currency`, `script`, `calendar`, `dateTimeField` | What kind of code |
| `locale` | Text (dynamic) | Locale for the output language |
| `style` | Dropdown: `long`, `short`, `narrow` | Verbosity |
| `fallback` | Dropdown: `code`, `none` | What to show if code is unknown |

**Output states:**
- `display_name` (text) — e.g. "British English", "United States", "US Dollar"

---

### 6. 🔀 **Plural Rules** (new element)

**Why:** Useful for building dynamic UI text: "1 item" vs "2 items". Different languages have wildly different plural rules (Arabic has 6 plural forms!).

**Fields:**
| Field | Type | Description |
|---|---|---|
| `number` | Number (dynamic) | The number to check |
| `locale` | Text (dynamic) | e.g. `ar-EG`, `en-US` |
| `type` | Dropdown: `cardinal`, `ordinal` | Cardinal (1,2,3) vs ordinal (1st, 2nd, 3rd) |

**Output states:**
- `category` (text) — one of: `zero`, `one`, `two`, `few`, `many`, `other`
- `ordinal_suffix` (text) — bonus: auto-generate "st", "nd", "rd", "th" for English-like locales

---

## Implementation Priority

| Priority | Element | Effort | Value to Bubble Devs |
|---|---|---|---|
| **P0** | 📅 Date & Time Formatter | Medium | 🔥🔥🔥🔥🔥 — Bubble's #1 pain point |
| **P0** | 🔢 Number Formatter (enhance) | Small | 🔥🔥🔥🔥 — Currency alone is huge |
| **P1** | ⏰ Relative Time Formatter | Small | 🔥🔥🔥🔥 — Very commonly needed |
| **P1** | 📋 List Formatter | Small | 🔥🔥🔥 — Simple but saves tons of hacks |
| **P2** | 🏷️ Display Names | Small | 🔥🔥🔥 — Great for multilingual apps |
| **P2** | 🔀 Plural Rules | Small | 🔥🔥 — Niche but solves a real problem |

---

## Architecture Decisions

### Plugin-level changes
- **Rename plugin** from "🤌 Number formatter" → "🌐 Intl Toolkit" (or similar) to reflect broader scope
- **Update description** and demo page
- **Keep the existing element fully backward-compatible** — add fields, don't remove/rename

### Per-element pattern
Each new element should follow the same pattern:
1. **Zero visual footprint** (10×10 invisible element, same as current)
2. **Locale field** on every element (with `en-US` default)
3. **Advanced options JSON escape hatch** on every element for power users
4. **Clean output states** — primary formatted text + optional parts/metadata
5. **Error handling** — wrap in try/catch, publish empty string + error state on failure

### Shared error state pattern (add to each element)
- `error_message` (text) — empty on success, descriptive message on failure
- Catches bad locale strings, invalid JSON in advanced options, etc.

### Consider: Client-side Actions alternative
Some of these (especially List Format, Plural Rules) could also work well as **client-side actions** rather than elements, since they're pure transformations with no UI. This would let Bubble devs use them in workflows without dropping invisible elements on the page. Could offer **both** — element + action versions for the most popular ones.

---

## Suggested Implementation Order

1. **Phase 1:** Enhance existing Number Formatter (add currency, percent, unit, precision fields)
2. **Phase 2:** Build Date & Time Formatter element
3. **Phase 3:** Build Relative Time Formatter element (with auto-compute from date)
4. **Phase 4:** Build List Formatter element
5. **Phase 5:** Build Display Names element
6. **Phase 6:** Build Plural Rules element
7. **Phase 7:** Add client-side action versions of each formatter
8. **Phase 8:** Update plugin metadata, demo page, documentation

Each phase is independently shippable and testable.

---

## Phase 2: Date & Time Formatter — Implementation Plan

### Overview

Create a new element `📅 Date formatter` that wraps `Intl.DateTimeFormat`. This is the highest-value addition since Bubble's built-in date formatting is one of the platform's biggest pain points — no locale awareness, limited timezone support, and no granular control over which parts to display.

### Pre-work: New element creation

Pled may not support creating new elements from scratch locally. The safest approach:

1. Create a blank element named `📅 Date formatter` in the Bubble plugin editor manually
2. Run `pled pull` to get the new element's directory and auto-assigned key (e.g. `ABG`)
3. Then edit all files locally and `pled push`

If pled does support new elements via directory creation, we can skip step 1 — but verify first.

### Element Configuration

```
src/elements/date-formatter-<KEY>/
├── <KEY>.json       # Element metadata (fields, states, actions)
├── initialize.js    # Empty
├── update.js        # Main formatting logic
├── preview.js       # Empty
├── reset.js         # Empty
├── headers.html     # Empty
├── fields.txt       # Field listing
└── actions/         # Empty
```

- `display`: `📅 Date formatter`
- `category`: `visual elements`
- `icon`: `ion-ios-calendar-outline`
- `default_dim`: `{ "height": 10, "width": 10 }` (invisible)
- `add_is_visible`: `true`

### Fields

All fields use the "none" option to mean "omit this part entirely". The `Intl.DateTimeFormat` API treats absent keys as "don't include", so any field set to `none` simply won't be added to the options object.

**Important Intl constraint:** `dateStyle`/`timeStyle` cannot be combined with individual component fields (`weekday`, `year`, `month`, etc.). The update.js logic must handle two mutually exclusive modes:
- **Preset mode:** use `dateStyle` and/or `timeStyle` (quick & easy)
- **Custom mode:** use individual component fields (full control)

We'll use a **Mode** dropdown to make this explicit in the UI.

#### Input

| Rank | Key | Caption | Editor | Default | Options | Optional | Value | Doc |
|------|-----|---------|--------|---------|---------|----------|-------|-----|
| 0 | | Date | DynamicValue | — | — | no | date | The date to format |
| 1 | | Locale | DynamicValue | en-US | — | no | text | BCP 47 locale (e.g. en-US, ja-JP, de-DE) |
| 2 | | Time zone | DynamicValue | — | — | yes | text | IANA timezone (e.g. America/New_York, Europe/Berlin). Leave empty for user's local timezone. |

#### Mode

| Rank | Key | Caption | Editor | Default | Options | Optional | Value | Doc |
|------|-----|---------|--------|---------|---------|----------|-------|-----|
| 3 | | — Preset Mode — | Label | — | — | — | — | — |
| 4 | | Mode | Dropdown | preset | preset,custom | no | text | "preset" uses Date style / Time style. "custom" uses individual fields below. |
| 5 | | Date style | Dropdown | medium | full,long,medium,short,none | yes | text | Preset date style. "full" = Thursday, March 6, 2026. "long" = March 6, 2026. "medium" = Mar 6, 2026. "short" = 3/6/26. "none" = omit date. |
| 6 | | Time style | Dropdown | none | full,long,medium,short,none | yes | text | Preset time style. "full" = 6:43:25 AM GMT+1. "long" = 6:43:25 AM GMT+1. "medium" = 6:43:25 AM. "short" = 6:43 AM. "none" = omit time. |

#### Custom Component Fields

| Rank | Key | Caption | Editor | Default | Options | Optional | Value | Doc |
|------|-----|---------|--------|---------|---------|----------|-------|-----|
| 7 | | — Custom Mode — | Label | — | — | — | — | — |
| 8 | | Weekday | Dropdown | none | long,short,narrow,none | yes | text | "long" = Thursday. "short" = Thu. "narrow" = T. |
| 9 | | Year | Dropdown | none | numeric,2-digit,none | yes | text | "numeric" = 2026. "2-digit" = 26. |
| 10 | | Month | Dropdown | none | numeric,2-digit,long,short,narrow,none | yes | text | "numeric" = 3. "2-digit" = 03. "long" = March. "short" = Mar. "narrow" = M. |
| 11 | | Day | Dropdown | none | numeric,2-digit,none | yes | text | "numeric" = 6. "2-digit" = 06. |
| 12 | | Hour | Dropdown | none | numeric,2-digit,none | yes | text | "numeric" = 6. "2-digit" = 06. |
| 13 | | Minute | Dropdown | none | numeric,2-digit,none | yes | text | "numeric" = 43. "2-digit" = 43. |
| 14 | | Second | Dropdown | none | numeric,2-digit,none | yes | text | "numeric" = 25. "2-digit" = 25. |
| 15 | | Hour cycle | Dropdown | auto | auto,h11,h12,h23,h24 | yes | text | Clock type. "h12" = 12-hour with AM/PM. "h23" = 24-hour (0-23). "auto" = follow locale default. |

#### Date Range

| Rank | Key | Caption | Editor | Default | Options | Optional | Value | Doc |
|------|-----|---------|--------|---------|---------|----------|-------|-----|
| 16 | | — Date Range — | Label | — | — | — | — | — |
| 17 | | End date | DynamicValue | — | — | yes | date | If provided, formats a date range using formatRange() (e.g. "Jan 5 – 10, 2026"). Uses same style settings as the main date. |

#### Advanced

| Rank | Key | Caption | Editor | Default | Options | Optional | Value | Doc |
|------|-----|---------|--------|---------|---------|----------|-------|-----|
| 18 | | — Advanced — | Label | — | — | — | — | — |
| 19 | | Advanced options (JSON) | DynamicValue, long_text | — | — | yes | text | Raw JSON passed directly to Intl.DateTimeFormat. When set, ALL other options except locale are ignored. |
| 20 | | Full reference: MDN Intl.DateTimeFormat() constructor | Label | — | — | — | — | — |

### Output States

| Key | Caption | Name | Value | Doc |
|-----|---------|------|-------|-----|
| | Formatted date | formatted_date | text | The formatted date string |
| | Formatted range | formatted_range | text | The formatted date range string (empty if no end date provided) |
| | Formatted parts (JSON) | formatted_parts | text | JSON from formatToParts() for custom rendering |
| | Error message | error_message | text | Empty on success, error description on failure |

### update.js Logic

```
try {
    1. Read properties: date, locale, timeZone, mode, end_date, advanced_options
    2. If advanced_options is set → parse JSON, use directly
    3. Else if mode === "preset":
        - Build options with dateStyle (if not "none") and timeStyle (if not "none")
        - Add timeZone if provided
    4. Else if mode === "custom":
        - Build options from individual component fields (weekday, year, month, day, hour, minute, second)
        - Skip any field set to "none"
        - Add hourCycle if not "auto"
        - Add timeZone if provided
    5. Create formatter: new Intl.DateTimeFormat([locale, "en-US"], options)
    6. Format: formatter.format(date)
    7. If end_date provided: formatter.formatRange(date, end_date)
    8. Publish states: formatted_date, formatted_range, formatted_parts, error_message=""
catch (e) {
    Publish empty strings + error_message = e.message
}
```

### Key Edge Cases to Handle

- **Bubble dates** arrive as JavaScript Date objects in `properties` — verify this works directly with `Intl.DateTimeFormat.format()` (it should, since it accepts Date objects)
- **"none" values** — must NOT be passed to the Intl options object (absent key = omit that part)
- **dateStyle/timeStyle vs components** — these are mutually exclusive in the Intl API; the Mode dropdown prevents mixing them, but the code should also guard against it
- **Empty timezone** — if not provided, omit from options (browser uses local timezone by default)
- **Invalid timezone string** — caught by try/catch, surfaces via error_message
- **formatRange()** — only available in modern browsers; wrap in a secondary try/catch with a clear error if unavailable

### Test Scenarios

| Scenario | Input | Expected Output |
|----------|-------|-----------------|
| Preset date only | date: 2026-03-06, locale: en-US, dateStyle: full | "Friday, March 6, 2026" |
| Preset date + time | date: 2026-03-06T06:43:00, locale: en-US, dateStyle: short, timeStyle: short | "3/6/26, 6:43 AM" |
| Custom: month + year only | date: 2026-03-06, mode: custom, month: long, year: numeric | "March 2026" |
| Custom: weekday only | date: 2026-03-06, mode: custom, weekday: long | "Friday" |
| German locale | date: 2026-03-06, locale: de-DE, dateStyle: long | "6. März 2026" |
| Japanese locale | date: 2026-03-06, locale: ja-JP, dateStyle: full | "2026年3月6日金曜日" |
| Timezone conversion | date: 2026-03-06T06:43:00Z, locale: en-US, timeZone: America/New_York, timeStyle: short | "1:43 AM" |
| Date range | date: 2026-01-05, end: 2026-01-10, dateStyle: medium | "Jan 5 – 10, 2026" |
| 24-hour clock | date: 2026-03-06T18:30:00, mode: custom, hour: 2-digit, minute: 2-digit, hourCycle: h23 | "18:30" |
| Advanced JSON override | advanced_options: {"dateStyle":"full","calendar":"persian"} | Persian calendar date |
| Error: bad timezone | timeZone: "NotATimezone" | error_message: "Invalid time zone specified: NotATimezone" |

### Implementation Steps

1. Create blank `📅 Date formatter` element in Bubble plugin editor
2. `pled pull` to get the new element directory and key
3. Write `<KEY>.json` with all fields and states defined above
4. Write `fields.txt` matching the field layout
5. Write `update.js` with the formatting logic
6. Leave `initialize.js`, `preview.js`, `reset.js`, `headers.html` empty
7. `pled push --force`
8. Test all scenarios from the test table above
9. Update CHANGELOG.md, README.md
10. Git commit and push
