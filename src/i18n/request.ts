import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

type Messages = Record<string, unknown>;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function deepMerge(base: Messages, override: Messages): Messages {
  const result: Messages = { ...base };

  for (const [key, overrideValue] of Object.entries(override)) {
    const baseValue = result[key];
    if (isPlainObject(baseValue) && isPlainObject(overrideValue)) {
      result[key] = deepMerge(baseValue, overrideValue);
    } else {
      result[key] = overrideValue;
    }
  }

  return result;
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // Validate locale
  if (!locale || !routing.locales.includes(locale as typeof routing.locales[number])) {
    locale = routing.defaultLocale;
  }

  // English is the source of truth. Merge locale-specific messages on top so
  // missing keys fall back to English instead of throwing at runtime.
  const enMessages = (await import(`../../messages/en.json`)).default as Messages;
  const localeMessages =
    locale === 'en'
      ? enMessages
      : deepMerge(
          enMessages,
          (await import(`../../messages/${locale}.json`)).default as Messages
        );

  return {
    locale,
    messages: localeMessages
  };
});
