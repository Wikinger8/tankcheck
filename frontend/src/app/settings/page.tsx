'use client';

import { useSettings } from '@/hooks/useSettings';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useLanguage } from '@/contexts/LanguageContext';
import { FuelTypeSelector } from '@/components/stations/FuelTypeSelector';

export default function SettingsPage() {
  const { settings, updateSettings } = useSettings();
  const { resetConsent } = useGeolocation();
  const { t, lang, setLang } = useLanguage();

  return (
    <div className="min-h-screen bg-[#0c0c0f] pb-24">
      <div className="mx-auto max-w-lg px-4 pt-6">
        <h1 className="text-2xl font-bold text-white mb-6">{t('settings.title')}</h1>

        <div className="space-y-5">
          <section>
            <h2 className="text-[10px] font-bold text-[#555566] uppercase tracking-widest mb-2 px-1">{t('settings.fuelType')}</h2>
            <div className="bg-[#141418] border border-[#2a2a34] rounded-xl p-4">
              <FuelTypeSelector value={settings.fuelType} onChange={(fuelType) => updateSettings({ fuelType })} />
            </div>
          </section>

          <section>
            <h2 className="text-[10px] font-bold text-[#555566] uppercase tracking-widest mb-2 px-1">{t('settings.radius')}</h2>
            <div className="bg-[#141418] border border-[#2a2a34] rounded-xl p-4">
              <div className="flex items-center gap-4">
                <input
                  type="range" min="1" max="25" step="1"
                  value={settings.radius}
                  onChange={(e) => updateSettings({ radius: Number(e.target.value) })}
                  className="flex-1 accent-[#00e5a0] h-2"
                />
                <span className="text-sm font-bold text-[#00e5a0] bg-[#1c1c22] border border-[#2a2a34] px-3 py-1.5 rounded-lg tabular-nums min-w-[52px] text-center">
                  {settings.radius} km
                </span>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-[10px] font-bold text-[#555566] uppercase tracking-widest mb-2 px-1">{t('settings.language')}</h2>
            <div className="bg-[#141418] border border-[#2a2a34] rounded-xl p-4">
              <div className="flex gap-1.5">
                {[{ key: 'de', label: 'Deutsch' }, { key: 'en', label: 'English' }].map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => setLang(opt.key as 'de' | 'en')}
                    className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
                      lang === opt.key
                        ? 'bg-[#00e5a0] text-[#0c0c0f]'
                        : 'bg-[#1c1c22] text-[#555566] border border-[#2a2a34]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-[10px] font-bold text-[#555566] uppercase tracking-widest mb-2 px-1">{t('settings.about')}</h2>
            <div className="bg-[#141418] border border-[#2a2a34] rounded-xl p-4 space-y-2 text-sm text-[#8888a0]">
              <p>Preisdaten: <a href="https://tankerkoenig.de" target="_blank" rel="noopener noreferrer" className="text-[#00e5a0] font-medium">Tankerk&ouml;nig</a> (CC BY 4.0)</p>
              <p>Karte: &copy; <a href="https://www.openstreetmap.org" target="_blank" rel="noopener noreferrer" className="text-[#00e5a0] font-medium">OpenStreetMap</a></p>
            </div>
          </section>

          <section>
            <h2 className="text-[10px] font-bold text-[#555566] uppercase tracking-widest mb-2 px-1">{t('settings.privacy')}</h2>
            <div className="bg-[#141418] border border-[#2a2a34] rounded-xl p-4">
              <p className="text-sm text-[#8888a0] mb-4 leading-relaxed">Standortdaten bleiben lokal. Favoriten und Einstellungen werden im Browser gespeichert.</p>
              <button
                onClick={resetConsent}
                className="w-full py-2.5 text-sm font-bold text-[#ef4444] bg-[#1c1c22] border border-[#2a2a34] rounded-lg hover:bg-[#24242c] transition-colors"
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
