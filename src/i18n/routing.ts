import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'es', 'de', 'ja'],
  defaultLocale: 'en',
  localePrefix: 'as-needed' // English has no prefix, others have /es, /de, /ja
});

export type Locale = (typeof routing.locales)[number];
