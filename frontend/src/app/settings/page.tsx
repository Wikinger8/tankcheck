'use client';

import { useSettings } from '@/hooks/useSettings';
import { useGeolocation } from '@/hooks/useGeolocation';
import { FuelTypeSelector } from '@/components/stations/FuelTypeSelector';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function SettingsPage() {
  const { settings, updateSettings } = useSettings();
  const { resetConsent } = useGeolocation();

  const handleDarkModeToggle = () => {
    const next = !settings.darkMode;
    updateSettings({ darkMode: next });
    if (next) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <h1 className="text-xl font-bold text-gray-900">Einstellungen</h1>
      </header>

      <main className="px-4 py-4 max-w-lg mx-auto space-y-4">
        {/* Default fuel type */}
        <Card>
          <h2 className="font-semibold text-gray-900 mb-3">Kraftstoffart</h2>
          <FuelTypeSelector
            value={settings.fuelType}
            onChange={(fuelType) => updateSettings({ fuelType })}
          />
        </Card>

        {/* Search radius */}
        <Card>
          <h2 className="font-semibold text-gray-900 mb-3">Suchradius</h2>
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
            <span className="text-sm font-medium text-gray-900 w-12 text-right">
              {settings.radius} km
            </span>
          </div>
        </Card>

        {/* Dark mode */}
        <Card>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Dunkelmodus</h2>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.darkMode}
                onChange={handleDarkModeToggle}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
            </label>
          </div>
        </Card>

        {/* About */}
        <Card>
          <h2 className="font-semibold text-gray-900 mb-3">Über TankCheck</h2>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              Preisdaten bereitgestellt von{' '}
              <a
                href="https://tankerkoenig.de"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Tankerkönig
              </a>{' '}
              (CC BY 4.0)
            </p>
            <p>
              Kartendaten: © {' '}
              <a
                href="https://www.openstreetmap.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                OpenStreetMap-Mitwirkende
              </a>
            </p>
          </div>
        </Card>

        {/* Privacy */}
        <Card>
          <h2 className="font-semibold text-gray-900 mb-3">Datenschutz</h2>
          <div className="space-y-2 text-sm text-gray-600 mb-4">
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
            Standortfreigabe zurücksetzen
          </Button>
        </Card>
      </main>
    </div>
  );
}
