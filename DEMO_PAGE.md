# 🌐 Intl Toolkit — Demo Page Examples

4 wow-factor examples to showcase on the demo page. Two for the new Date formatter, two for the enhanced Number formatter.

---

## 📅 Example 1: "World Clock Dashboard"

Show the **same moment in time** formatted for 4 different locales and timezones, proving just how powerful one element is.

| Config | Output |
|--------|--------|
| Locale: `en-US`, Timezone: `America/New_York`, Mode: preset, Date style: full, Time style: short | **Friday, March 6, 2026 at 12:43 AM** |
| Locale: `ja-JP`, Timezone: `Asia/Tokyo`, Mode: preset, Date style: full, Time style: short | **2026年3月6日金曜日 14:43** |
| Locale: `ar-EG`, Timezone: `Africa/Cairo`, Mode: preset, Date style: full, Time style: short | **الجمعة، ٦ مارس ٢٠٢٦ في ٧:٤٣ ص** |
| Locale: `de-DE`, Timezone: `Europe/Berlin`, Mode: preset, Date style: full, Time style: short | **Freitag, 6. März 2026 um 06:43** |

**Why it wows:** One plugin element, one date — but it naturally speaks every language. No custom formatting hacks, no regex, no moment.js. Bubble devs struggle with this constantly.

---

## 📅 Example 2: "Event Date Range + Custom Parts"

Show a date range for an event, plus a custom "blog post style" output using custom mode.

### Range example

- Date: Jan 5, 2026 → End date: Jan 10, 2026
- Locale: `en-US`, Mode: preset, Date style: medium
- **Output:** `Jan 5 – 10, 2026` ← the API is smart enough to not repeat "Jan" and "2026"

### Custom mode example — "blog post style"

- Date: March 6, 2026
- Mode: custom, Weekday: long, Month: long, Day: numeric
- **Output:** `Friday, March 6`

This shows the two modes side by side — preset for "just give me a nice date" and custom for "I only want the weekday and month."

---

## 🔢 Example 3: "Multi-Currency Price Display"

Show the same number (`1234567.89`) formatted as 4 different currencies, proving that the plugin handles all the locale-specific nuances automatically.

| Config | Output |
|--------|--------|
| Style: currency, Currency: `USD`, Locale: `en-US` | **$1,234,567.89** |
| Style: currency, Currency: `EUR`, Locale: `de-DE` | **1.234.567,89 €** |
| Style: currency, Currency: `JPY`, Locale: `ja-JP` | **￥1,234,568** ← no decimals for yen! |
| Style: currency, Currency: `BRL`, Locale: `pt-BR`, Currency display: name | **1.234.567,89 reais brasileiros** |

**Why it wows:** Notice how EUR goes *after* the number in German, JPY drops decimals automatically (because yen doesn't use them), and BRL spells out the full currency name in Portuguese. The plugin handles ALL of this — no custom code needed.

---

## 🔢 Example 4: "Dashboard KPI Card"

Show a single number formatted 4 different ways, like you'd see on a finance dashboard.

| Config | Output |
|--------|--------|
| Value: `-0.1572`, Style: percent, Max fraction digits: 1, Sign display: always | **-15.7%** |
| Value: `0.2381`, Style: percent, Max fraction digits: 1, Sign display: always | **+23.8%** |
| Value: `8471000`, Style: decimal, Notation: compact, Compact display: long | **8.5 million** |
| Value: `342`, Style: unit, Unit: `kilometer-per-hour`, Unit display: long | **342 kilometers per hour** |

**Why it wows:** Every SaaS dashboard needs percentage changes with +/- signs, compact large numbers, and unit formatting. Bubble devs currently hack this together with `:formatted as` and regex — this plugin does it natively and correctly for every locale.
