# 🤌 Number Formatter — Bubble.io Plugin

A lightweight Bubble.io plugin that formats numbers using the browser's built-in [`Intl.NumberFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat) API. Locale-aware currency, percentages, units, compact notation, and full precision control — no external libraries needed.

## What it does

Drop an invisible element on your page, feed it a number, and get back a beautifully formatted string in any locale.

**Examples:**

| Input | Settings | Output |
|---|---|---|
| `1234567` | locale: `en-US`, notation: `compact` | `1.2M` |
| `1234567` | locale: `de-DE`, notation: `compact`, compact display: `long` | `1,2 Millionen` |
| `42.5` | locale: `en-US`, style: `currency`, currency: `USD` | `$42.50` |
| `42.5` | locale: `ja-JP`, style: `currency`, currency: `JPY` | `￥43` |
| `0.8542` | locale: `en-US`, style: `percent` | `85%` |
| `100` | locale: `en-US`, style: `unit`, unit: `kilometer-per-hour` | `100 km/h` |
| `25` | locale: `de-DE`, style: `unit`, unit: `celsius`, unit display: `long` | `25 Grad Celsius` |
| `1234.5` | locale: `en-US`, min fraction digits: `2`, max fraction digits: `2` | `1,234.50` |
| `42` | locale: `en-US`, sign display: `always` | `+42` |

## How to use

1. Place the **🤌 Number formatter** element on your page (it's invisible — 10×10px)
2. Set the **Number** input to any dynamic or static number
3. Set the **Locale** (e.g. `en-US`, `de-DE`, `pt-BR`, `ja-JP`)
4. Pick a **Style** and configure the relevant options
5. Read the **Formatted number** state wherever you need the result

## Element Fields

### Formatting

| Field | Type | Default | Description |
|---|---|---|---|
| **Number to format** | Number (dynamic) | — | The number to format |
| **Locale** | Text (dynamic) | `en-US` | BCP 47 locale string |
| **Style** | Dropdown | `decimal` | `decimal`, `currency`, `percent`, or `unit` |
| **Notation** | Dropdown | `standard` | `standard`, `compact`, `scientific`, or `engineering` |
| **Compact display** | Dropdown | `short` | `short` or `long` — only used with compact notation |

### Currency (when style = `currency`)

| Field | Type | Default | Description |
|---|---|---|---|
| **Currency code** | Text (dynamic) | — | ISO 4217 code: `USD`, `EUR`, `GBP`, `JPY`, `BRL`, etc. |
| **Currency display** | Dropdown | `symbol` | `symbol` ($), `narrowSymbol` ($), `code` (USD), `name` (US dollars) |

### Unit (when style = `unit`)

| Field | Type | Default | Description |
|---|---|---|---|
| **Unit** | Text (dynamic) | — | e.g. `kilometer-per-hour`, `liter`, `celsius`, `mile`, `byte`, `kilogram` |
| **Unit display** | Dropdown | `short` | `long` (16 litres), `short` (16 l), `narrow` (16l) |

### Precision

| Field | Type | Default | Description |
|---|---|---|---|
| **Minimum fraction digits** | Number (dynamic) | — | Force minimum decimal places (e.g. 2 → `1.00`) |
| **Maximum fraction digits** | Number (dynamic) | — | Cap decimal places (e.g. 2 → `1.23` from `1.2345`) |
| **Use grouping** | Dropdown | `auto` | Thousands separators: `auto`, `always`, or `false` |
| **Sign display** | Dropdown | `auto` | `auto`, `always`, `exceptZero`, `negative`, `never` |

### Advanced

| Field | Type | Description |
|---|---|---|
| **Advanced options (JSON)** | Text (dynamic) | Raw JSON passed directly to `Intl.NumberFormat`. When set, **all other options except locale are ignored**. |

## Output States

| State | Type | Description |
|---|---|---|
| **Formatted number** | Text | The formatted result |
| **Compacted number** | Text | Legacy output — identical to Formatted number (kept for backward compatibility) |
| **Formatted parts (JSON)** | Text | JSON array from [`formatToParts()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/formatToParts) — useful for custom rendering |
| **Error message** | Text | Empty on success. Contains a description if formatting fails |

## Advanced Options examples

The **Advanced options** field accepts any valid [`Intl.NumberFormat` options object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat#options) as JSON:

```json
{ "style": "currency", "currency": "EUR", "currencyDisplay": "name" }
```

```json
{ "style": "unit", "unit": "kilometer-per-hour", "unitDisplay": "long" }
```

```json
{ "notation": "compact", "compactDisplay": "long", "maximumSignificantDigits": 3 }
```

```json
{ "minimumFractionDigits": 2, "maximumFractionDigits": 2, "useGrouping": false }
```

## Supported Units

The `unit` field accepts any [sanctioned unit identifier](https://tc39.es/ecma402/#table-sanctioned-single-unit-identifiers). Common ones:

| Category | Units |
|---|---|
| **Length** | `meter`, `kilometer`, `mile`, `foot`, `inch`, `centimeter`, `millimeter`, `yard` |
| **Speed** | `kilometer-per-hour`, `mile-per-hour`, `meter-per-second` |
| **Temperature** | `celsius`, `fahrenheit` |
| **Volume** | `liter`, `milliliter`, `gallon`, `fluid-ounce` |
| **Weight** | `kilogram`, `gram`, `milligram`, `pound`, `ounce` |
| **Data** | `byte`, `kilobyte`, `megabyte`, `gigabyte`, `terabyte` |
| **Time** | `second`, `minute`, `hour`, `day`, `week`, `month`, `year` |
| **Other** | `percent`, `degree`, `acre`, `hectare` |

Compound units use the `X-per-Y` format: `liter-per-100-kilometer`, `mile-per-gallon`, etc.

## Error Handling

If formatting fails (e.g. missing currency code when style is `currency`, invalid unit name, malformed JSON in advanced options), the plugin:
- Sets **Formatted number** and **Compacted number** to empty
- Publishes the error description to the **Error message** state

You can use the Error message state to conditionally show a fallback or debug the issue.

## Links

- **Demo:** https://nocode-to-knowcode.bubbleapps.io/version-test/formatter
- **Forum:** https://forum.bubble.io/t/number-formatter-plugin/241249
- **MDN Reference:** https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
- **License:** Open source
