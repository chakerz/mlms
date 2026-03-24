import { Language } from '../domain/common/types/Language';

export const i18nConfig = {
  defaultLanguage: Language.FR,
  supportedLanguages: [Language.FR, Language.AR],
  headerKey: 'accept-language',
} as const;
