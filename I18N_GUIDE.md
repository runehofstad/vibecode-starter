# 🌐 Internationalization (i18n) Guide - Vibecode Starter

## Translation Workflow
- Store translations in `src/locales/en.json` and `src/locales/nb.json`
- Use i18next or a similar library for runtime translation
- Extract all user-facing strings to translation files
- Use descriptive keys (e.g., `common.save`, `auth.login`)

## Pluralization
- Use i18next pluralization features
- Provide plural forms for all count-based strings

## Date/Time Formatting
- Use date-fns or Intl.DateTimeFormat for formatting
- Format dates and times according to user locale

## Currency Formatting
- Use Intl.NumberFormat for currency
- Support multiple currencies if needed

## RTL Language Support
- Use logical CSS properties (margin-inline, padding-inline)
- Test layouts with RTL locales (e.g., Arabic, Hebrew)

## Best Practices
- Review translations with native speakers
- Avoid hardcoding text in components
- Test with both English and Norwegian 