// Scenario inputs, deliberately authored here rather than inferred from Bubble metadata.
export const numberInput = {
  number: 1234.5, locale: 'en-US', style: 'decimal', notation: 'standard',
  compactDisplay: 'short', currency: '', currencyDisplay: 'symbol',
  unit: '', unitDisplay: 'short', minimumFractionDigits: null,
  maximumFractionDigits: null, useGrouping: 'auto', signDisplay: 'auto',
  advanced_options: '',
};

// ISO strings are transport only; the browser runner creates actual Date objects.
export const dateInput = {
  date: '2024-01-02T00:30:45.000Z', end_date: null, locale: 'en-US',
  timeZone: 'UTC', mode: 'preset', dateStyle: 'medium', timeStyle: 'none',
  weekday: 'none', year: 'none', month: 'none', day: 'none',
  hour: 'none', minute: 'none', second: 'none', hourCycle: 'auto',
  advanced_options: '',
};
