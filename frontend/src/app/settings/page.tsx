'use client';

import { useSettings } from '@/hooks/useSettings';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useLanguage } from '@/contexts/LanguageContext';
import { FuelTypeSelector } from '@/components/stations/FuelTypeSelector';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function SettingsPage() {
  const { settings, updateSettings } = useSettings();
  const { resetConsent } = useGeolocation();
  const { t, lang, setLang } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-white/20 dark:border-gray-700/30 px-4 py-4">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">{t('settings.title')}</h1>
      </header>

      <main className="px-4 py-4 max-w-lg mx-auto space-y-4">
        <Card>
          <h2 className="font-semibold text-gray-900 dark:text-white mb-3">{t('settings.fuelType')}</h2>
          <FuelTypeSelector
            value={settings.fuelType}
            onChange={(fuelType) => updateSettings({ fuelType })}
          />
        </Card>

        <Card>
          <h2 className="font-semibold text-gray-900 dark:text-white mb-3">{t('settings.radius')}</h2>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="1"
              max="25"
              step="1"
              value={settings.radius}
              onChange={(e) => updateSettings({ radius: Number(e.target.value) })}
              className="flex-1 accent-blue-600"
            />
            <span className="text-sm font-medium text-gray-900 dark:text-white w-12 text-right">
              {settings.radius} km
            </span>
          </div>
        </Card>

        <Card>
          <h2 className="font-semibold text-gray-900 dark:text-white mb-3">{t('settings.darkMode')}</h2>
          <ThemeToggle />
        </Card>

        <Card>
          <h2 className="font-semibold text-gray-900 dark:text-white mb-3">{t('settings.language')}</h2>
          <div className="flex rounded-xl bg-gray-100 dark:bg-gray-800 p-1">
            <button
              onClick={() => setLang('de')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                lang === 'de'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              Deutsch
            </button>
            <button
              onClick={() => setLang('en')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                lang === 'en'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              English
            </button>
          </div>
        </Card>

        <Card>
          <h2 className="font-semibold text-gray-900 dark:text-white mb-3">{t('settings.about')}</h2>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <p>
              Preisdaten bereitgestellt von{' '}
              <a
                href="https://tankerkoenig.de"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 underline"
              >
                Tankerk&ouml;nig
              </a>{' '}
              (CC BY 4.0)
            </p>
            <p>
              Kartendaten: &copy;{' '}
              <a
                href="https://www.openstreetmap.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 underline"
              >
                OpenStreetMap-Mitwirkende
              </a>
            </p>
          </div>
        </Card>

        <Card>
          <h2 className="font-semibold text-gray-900 dark:text-white mb-3">{t('settings.privacy')}</h2>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
            <p>
              Standortdaten werden nur lokal in Ihrem Browser verwendet und nicht
              an Dritte weitergegeben.
            </p>
            <p>
              Favoriten und Einstellungen werden nur in Ihrem Browser gespeichert
              (LocalStorage).
            </p>
          </div>
          <Button
            variant="secondary"
            size="md"
            className="w-full"
            onClick={resetConsent}
          >
            {t('settings.resetLocation')}
          </Button>
        </Card>
      </main>
    </div>
  );
}
