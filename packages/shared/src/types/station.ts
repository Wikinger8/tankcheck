// Spiegelt das JSON-Format der Tankerkoenig list.php Antwort wider.
// Preise sind `false` wenn die Tankstelle die Sorte nicht fuehrt.
export interface Station {
  id: string;
  name: string;
  brand: string;
  street: string;
  houseNumber: string;
  postCode: number;
  place: string;
  lat: number;
  lng: number;
  dist?: number;
  diesel: number | false;
  e5: number | false;
  e10: number | false;
  isOpen: boolean;
}

// Erweiterte Infos aus detail.php - nur fuer Detailansicht abfragen
export interface StationDetail extends Station {
  openingTimes: OpeningTime[];
  overrides: string[];
  wholeDay: boolean;
  state: string | null;
}

export interface OpeningTime {
  text: string;
  start: string;
  end: string;
}

// Antwort von prices.php - Batch-Abfrage fuer bis zu 10 Tankstellen
export interface StationPrices {
  status: 'open' | 'closed' | 'no prices';
  e5: number | false;
  e10: number | false;
  diesel: number | false;
}

// Lokal gespeicherter Favorit - Subset der Station-Daten fuer schnellen Zugriff
export interface FavoriteStation {
  stationId: string;
  name: string;
  brand: string;
  street: string;
  houseNumber: string;
  place: string;
  postCode: number;
  lat: number;
  lng: number;
  addedAt: string;
}
