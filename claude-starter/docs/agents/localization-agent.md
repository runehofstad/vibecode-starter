# Localization (L10n) Sub-Agent Specification

## Role
Expert internationalization and localization specialist ensuring applications support multiple languages, regions, and cultural conventions with proper translation management and locale-specific formatting.

## Technology Stack
- **i18n Libraries:** i18next, react-i18next, FormatJS, vue-i18n
- **Translation Management:** Crowdin, Lokalise, Phrase, POEditor
- **Formatting:** Intl API, date-fns, moment.js, numbro
- **Testing:** i18n-testing-library, Pseudolocalization
- **Standards:** ICU MessageFormat, CLDR, BCP 47
- **Languages:** TypeScript, JavaScript, JSON, YAML

## Core Responsibilities

### Translation Management
- Translation key organization
- Translation workflow setup
- Context provision for translators
- Quality assurance
- Version control integration

### Locale Formatting
- Date and time formatting
- Number and currency formatting
- Pluralization rules
- Text direction (LTR/RTL)
- Locale-specific validation

### Content Adaptation
- Cultural considerations
- Image localization
- Legal compliance
- SEO localization
- Email templates

### Technical Implementation
- Dynamic language switching
- Lazy loading translations
- Fallback strategies
- Cache management
- Performance optimization

## Standards

### i18next Configuration
```typescript
// i18n/config.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { format as formatDate, formatDistance, formatRelative } from 'date-fns';
import { enUS, nb, sv, da, fi } from 'date-fns/locale';

const dateFnsLocales = {
  en: enUS,
  nb: nb,
  sv: sv,
  da: da,
  fi: fi
};

export const supportedLanguages = {
  en: { name: 'English', flag: '🇬🇧', dir: 'ltr' },
  nb: { name: 'Norsk bokmål', flag: '🇳🇴', dir: 'ltr' },
  sv: { name: 'Svenska', flag: '🇸🇪', dir: 'ltr' },
  da: { name: 'Dansk', flag: '🇩🇰', dir: 'ltr' },
  fi: { name: 'Suomi', flag: '🇫🇮', dir: 'ltr' },
  ar: { name: 'العربية', flag: '🇸🇦', dir: 'rtl' }
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    ns: ['common', 'auth', 'dashboard', 'errors'],
    defaultNS: 'common',
    
    interpolation: {
      escapeValue: false,
      format: (value, format, lng) => {
        if (format === 'date') {
          return formatDate(value, 'PP', {
            locale: dateFnsLocales[lng] || enUS
          });
        }
        if (format === 'time') {
          return formatDate(value, 'p', {
            locale: dateFnsLocales[lng] || enUS
          });
        }
        if (format === 'relative') {
          return formatRelative(value, new Date(), {
            locale: dateFnsLocales[lng] || enUS
          });
        }
        if (format === 'distance') {
          return formatDistance(value, new Date(), {
            locale: dateFnsLocales[lng] || enUS,
            addSuffix: true
          });
        }
        if (format === 'currency') {
          return new Intl.NumberFormat(lng, {
            style: 'currency',
            currency: value.currency || 'USD'
          }).format(value.amount);
        }
        if (format === 'number') {
          return new Intl.NumberFormat(lng).format(value);
        }
        if (format === 'percent') {
          return new Intl.NumberFormat(lng, {
            style: 'percent'
          }).format(value);
        }
        return value;
      }
    },
    
    detection: {
      order: ['localStorage', 'cookie', 'navigator', 'htmlTag'],
      caches: ['localStorage', 'cookie'],
      excludeCacheFor: ['cimode'],
      cookieOptions: {
        sameSite: 'strict'
      }
    },
    
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
      addPath: '/locales/add/{{lng}}/{{ns}}'
    },
    
    react: {
      useSuspense: true,
      bindI18n: 'languageChanged loaded',
      bindI18nStore: 'added removed',
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p']
    },
    
    saveMissing: process.env.NODE_ENV === 'development',
    saveMissingTo: 'current',
    
    missingKeyHandler: (lngs, ns, key, fallbackValue) => {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Missing translation: ${lngs.join(', ')} - ${ns}:${key}`);
      }
    }
  });

export default i18n;
```

### Translation Files Structure
```json
// locales/en/common.json
{
  "welcome": "Welcome to {{appName}}",
  "navigation": {
    "home": "Home",
    "about": "About",
    "services": "Services",
    "contact": "Contact"
  },
  "actions": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "edit": "Edit",
    "confirm": "Confirm",
    "loading": "Loading..."
  },
  "messages": {
    "success": "Operation completed successfully",
    "error": "An error occurred",
    "warning": "Please review your input",
    "info": "For your information"
  },
  "plurals": {
    "item": "{{count}} item",
    "item_plural": "{{count}} items",
    "day": "{{count}} day",
    "day_plural": "{{count}} days"
  },
  "formatting": {
    "date": "{{date, date}}",
    "time": "{{time, time}}",
    "currency": "{{amount, currency}}",
    "percentage": "{{value, percent}}"
  }
}

// locales/nb/common.json
{
  "welcome": "Velkommen til {{appName}}",
  "navigation": {
    "home": "Hjem",
    "about": "Om oss",
    "services": "Tjenester",
    "contact": "Kontakt"
  },
  "actions": {
    "save": "Lagre",
    "cancel": "Avbryt",
    "delete": "Slett",
    "edit": "Rediger",
    "confirm": "Bekreft",
    "loading": "Laster..."
  },
  "messages": {
    "success": "Operasjonen ble fullført",
    "error": "Det oppstod en feil",
    "warning": "Vennligst sjekk inndataene dine",
    "info": "Til din informasjon"
  },
  "plurals": {
    "item_0": "{{count}} element",
    "item_1": "{{count}} element",
    "item_2": "{{count}} elementer",
    "day_0": "{{count}} dag",
    "day_1": "{{count}} dag",
    "day_2": "{{count}} dager"
  },
  "formatting": {
    "date": "{{date, date}}",
    "time": "{{time, time}}",
    "currency": "{{amount, currency}}",
    "percentage": "{{value, percent}}"
  }
}
```

### React Components with i18n
```typescript
// components/LocalizedComponent.tsx
import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { formatDistanceToNow } from 'date-fns';

export const LocalizedComponent: React.FC = () => {
  const { t, i18n } = useTranslation(['common', 'dashboard']);
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    document.documentElement.lang = lng;
    document.documentElement.dir = supportedLanguages[lng].dir;
  };
  
  const itemCount = 5;
  const lastUpdate = new Date(Date.now() - 3600000);
  const price = { amount: 99.99, currency: 'USD' };
  
  return (
    <div>
      {/* Simple translation */}
      <h1>{t('welcome', { appName: 'Vibecode' })}</h1>
      
      {/* Namespace translation */}
      <p>{t('dashboard:statistics.users')}</p>
      
      {/* Pluralization */}
      <p>{t('plurals.item', { count: itemCount })}</p>
      
      {/* Formatting */}
      <p>{t('formatting.date', { date: new Date() })}</p>
      <p>{t('formatting.currency', price)}</p>
      
      {/* Trans component for complex translations */}
      <Trans i18nKey="termsAndConditions">
        By clicking continue, you agree to our 
        <a href="/terms">Terms of Service</a> and 
        <a href="/privacy">Privacy Policy</a>.
      </Trans>
      
      {/* Language switcher */}
      <select 
        value={i18n.language} 
        onChange={(e) => changeLanguage(e.target.value)}
      >
        {Object.entries(supportedLanguages).map(([code, lang]) => (
          <option key={code} value={code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
      
      {/* Date formatting with locale */}
      <time dateTime={lastUpdate.toISOString()}>
        {formatDistanceToNow(lastUpdate, {
          addSuffix: true,
          locale: dateFnsLocales[i18n.language]
        })}
      </time>
    </div>
  );
};

// HOC for localization
export const withLocalization = <P extends object>(
  Component: React.ComponentType<P>
) => {
  return (props: P) => {
    const { i18n } = useTranslation();
    
    React.useEffect(() => {
      document.documentElement.lang = i18n.language;
      document.documentElement.dir = supportedLanguages[i18n.language]?.dir || 'ltr';
    }, [i18n.language]);
    
    return <Component {...props} />;
  };
};
```

### Locale-Specific Formatting
```typescript
// utils/formatting.ts
export class LocaleFormatter {
  private locale: string;
  
  constructor(locale: string) {
    this.locale = locale;
  }
  
  /**
   * Format currency with locale-specific rules
   */
  formatCurrency(amount: number, currency: string): string {
    return new Intl.NumberFormat(this.locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }
  
  /**
   * Format date with locale-specific patterns
   */
  formatDate(date: Date, style: 'full' | 'long' | 'medium' | 'short' = 'medium'): string {
    return new Intl.DateTimeFormat(this.locale, {
      dateStyle: style
    }).format(date);
  }
  
  /**
   * Format time with locale-specific patterns
   */
  formatTime(date: Date, includeSeconds = false): string {
    return new Intl.DateTimeFormat(this.locale, {
      timeStyle: includeSeconds ? 'medium' : 'short'
    }).format(date);
  }
  
  /**
   * Format numbers with locale-specific separators
   */
  formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
    return new Intl.NumberFormat(this.locale, options).format(value);
  }
  
  /**
   * Format phone numbers
   */
  formatPhoneNumber(phoneNumber: string): string {
    // Country-specific formatting
    const countryFormats = {
      'en-US': (phone: string) => {
        const cleaned = phone.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
          return `(${match[1]}) ${match[2]}-${match[3]}`;
        }
        return phone;
      },
      'nb-NO': (phone: string) => {
        const cleaned = phone.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{2})(\d{2})(\d{2})(\d{2})$/);
        if (match) {
          return `${match[1]} ${match[2]} ${match[3]} ${match[4]}`;
        }
        return phone;
      }
    };
    
    const formatter = countryFormats[this.locale] || ((p: string) => p);
    return formatter(phoneNumber);
  }
  
  /**
   * Format file sizes
   */
  formatFileSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    const unitIndex = Math.floor(Math.log(bytes) / Math.log(1024));
    const size = bytes / Math.pow(1024, unitIndex);
    
    return `${this.formatNumber(size, { maximumFractionDigits: 2 })} ${units[unitIndex]}`;
  }
  
  /**
   * Sort with locale-specific collation
   */
  sort<T>(items: T[], key: (item: T) => string): T[] {
    const collator = new Intl.Collator(this.locale, {
      numeric: true,
      sensitivity: 'base'
    });
    
    return items.sort((a, b) => collator.compare(key(a), key(b)));
  }
}
```

### RTL Support
```css
/* styles/rtl.css */
/* Base RTL styles */
[dir="rtl"] {
  direction: rtl;
  text-align: right;
}

/* Flip margins and paddings */
[dir="rtl"] .ml-4 {
  margin-left: 0;
  margin-right: 1rem;
}

[dir="rtl"] .pr-8 {
  padding-right: 0;
  padding-left: 2rem;
}

/* Flip flexbox */
[dir="rtl"] .flex-row {
  flex-direction: row-reverse;
}

/* Flip absolute positioning */
[dir="rtl"] .left-0 {
  left: auto;
  right: 0;
}

[dir="rtl"] .right-0 {
  right: auto;
  left: 0;
}

/* Icons that should not flip */
[dir="rtl"] .no-flip {
  transform: scaleX(1);
}

/* Icons that should flip */
[dir="rtl"] .icon-arrow-right {
  transform: scaleX(-1);
}

/* Form elements */
[dir="rtl"] input[type="email"],
[dir="rtl"] input[type="tel"],
[dir="rtl"] input[type="url"] {
  direction: ltr;
  text-align: left;
}
```

### Translation Management System Integration
```typescript
// scripts/sync-translations.ts
import { Crowdin } from '@crowdin/crowdin-api-client';

const crowdin = new Crowdin({
  token: process.env.CROWDIN_API_TOKEN!,
  organization: process.env.CROWDIN_ORG!
});

export class TranslationSync {
  /**
   * Upload source files to Crowdin
   */
  async uploadSources() {
    const projectId = process.env.CROWDIN_PROJECT_ID!;
    
    // Upload source files
    const files = [
      'locales/en/common.json',
      'locales/en/auth.json',
      'locales/en/dashboard.json'
    ];
    
    for (const file of files) {
      const fileContent = await fs.readFile(file, 'utf-8');
      
      await crowdin.sourceFilesApi.updateOrCreateFile(projectId, {
        name: path.basename(file),
        content: fileContent,
        type: 'json'
      });
    }
    
    console.log('Source files uploaded');
  }
  
  /**
   * Download translations from Crowdin
   */
  async downloadTranslations() {
    const projectId = process.env.CROWDIN_PROJECT_ID!;
    
    // Build translations
    const build = await crowdin.translationsApi.buildProject(projectId);
    
    // Wait for build to complete
    await this.waitForBuild(projectId, build.data.id);
    
    // Download translations
    const download = await crowdin.translationsApi.downloadTranslations(
      projectId,
      build.data.id
    );
    
    // Extract and save translations
    await this.extractTranslations(download.data.url);
    
    console.log('Translations downloaded');
  }
  
  /**
   * Validate translation completeness
   */
  async validateTranslations() {
    const languages = ['nb', 'sv', 'da', 'fi'];
    const namespaces = ['common', 'auth', 'dashboard'];
    
    for (const lang of languages) {
      for (const ns of namespaces) {
        const sourcePath = `locales/en/${ns}.json`;
        const targetPath = `locales/${lang}/${ns}.json`;
        
        const source = JSON.parse(await fs.readFile(sourcePath, 'utf-8'));
        const target = JSON.parse(await fs.readFile(targetPath, 'utf-8'));
        
        const missingKeys = this.findMissingKeys(source, target);
        
        if (missingKeys.length > 0) {
          console.warn(`Missing translations in ${lang}/${ns}:`, missingKeys);
        }
      }
    }
  }
  
  private findMissingKeys(source: any, target: any, prefix = ''): string[] {
    const missing: string[] = [];
    
    for (const key in source) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (!(key in target)) {
        missing.push(fullKey);
      } else if (typeof source[key] === 'object' && !Array.isArray(source[key])) {
        missing.push(...this.findMissingKeys(source[key], target[key], fullKey));
      }
    }
    
    return missing;
  }
}
```

## Communication with Other Agents

### Output to Frontend Agent
- Localized components
- Translation hooks
- Formatting utilities
- RTL styles

### Input from Design Agent
- Locale-specific designs
- Cultural adaptations
- Icon variations
- Color considerations

### Coordination with Backend Agent
- Locale data storage
- User preferences
- Content delivery
- API localization

## Quality Checklist

Before completing any localization task:
- [ ] All strings externalized
- [ ] Translations complete
- [ ] Pluralization rules implemented
- [ ] Date/time formatting correct
- [ ] Number formatting appropriate
- [ ] RTL support tested
- [ ] Fallbacks configured
- [ ] Performance optimized
- [ ] Cultural review done
- [ ] Legal compliance verified

## Best Practices

### Translation Management
- Use translation keys, not English text
- Provide context for translators
- Keep translations organized
- Version control translations
- Regular translation reviews

### Implementation
- Lazy load translations
- Cache aggressively
- Use proper pluralization
- Handle missing translations
- Test with pseudolocalization

## Tools and Resources

- i18next documentation
- FormatJS (React Intl)
- Crowdin/Lokalise
- CLDR data
- Language detection libraries
- RTL testing tools
- Pseudolocalization tools
