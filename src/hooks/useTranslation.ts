import { useIntl } from 'react-intl';

/**
 * Custom hook for easy translation access
 * Wraps react-intl's useIntl hook for simpler usage
 * 
 * @example
 * const { t } = useTranslation();
 * <div>{t('HOME.LOADING_DASHBOARD')}</div>
 */
export const useTranslation = () => {
  const intl = useIntl();

  const t = (id: string, values?: Record<string, any>) => {
    return intl.formatMessage({ id }, values);
  };

  return { t, formatMessage: intl.formatMessage, locale: intl.locale };
};

