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
