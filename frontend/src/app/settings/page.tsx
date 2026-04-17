'use client';

import { useSettings } from '@/hooks/useSettings';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useLanguage } from '@/contexts/LanguageContext';
import { FuelTypeSelector } from '@/components/stations/FuelTypeSelector';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export default function SettingsPage() {
  const { settings, updateSettings } = useSettings();
  const { resetConsent } = useGeolocation();
  const { t, lang, setLang } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24">
      <div className="mx-auto max-w-lg px-4 pt-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('settings.title')}</h1>

        <div className="space-y-6">
          <section>
            <h2 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 px-1">{t('settings.fuelType')}</h2>
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4">
              <FuelTypeSelector value={settings.fuelType} onChange={(fuelType) => updateSettings({ fuelType })} />
            </div>
          </section>

          <section>
            <h2 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 px-1">{t('settings.radius')}</h2>
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4">
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="1"
                  max="25"
                  step="1"
                  value={settings.radius}
                  onChange={(e) => updateSettings({ radius: Number(e.target.value) })}
                  className="flex-1 accent-blue-600 h-2"
                />
                <span className="text-sm font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg tabular-nums">
                  {settings.radius} km
                </span>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 px-1">{t('settings.darkMode')}</h2>
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4">
              <ThemeToggle />
            </div>
          </section>

          <section>
            <h2 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 px-1">{t('settings.language')}</h2>
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4">
              <div className="flex rounded-xl bg-gray-100 dark:bg-gray-800 p-1 gap-1">
                {[{ key: 'de', label: 'Deutsch' }, { key: 'en', label: 'English' }].map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => setLang(opt.key as 'de' | 'en')}
                    className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                      lang === opt.key
                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 px-1">{t('settings.about')}</h2>
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p>Preisdaten: <a href="https://tankerkoenig.de" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 font-medium">Tankerk&ouml;nig</a> (CC BY 4.0)</p>
              <p>Karte: &copy; <a href="https://www.openstreetmap.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 font-medium">OpenStreetMap</a></p>
            </div>
          </section>

          <section>
            <h2 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 px-1">{t('settings.privacy')}</h2>
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
                Standortdaten werden nur lokal verwendet. Favoriten und Einstellungen werden im Browser gespeichert (LocalStorage).
              </p>
              <button
                onClick={resetConsent}
                className="w-full py-2.5 text-sm font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 rounded-xl hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
              >
                {t('settings.resetLocation')}
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
