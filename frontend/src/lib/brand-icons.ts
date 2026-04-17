const BRAND_CONFIG: Record<string, { color: string; abbr: string; textColor?: string }> = {
  'ARAL': { color: '#0051A5', abbr: 'A' },
  'Shell': { color: '#FFD500', abbr: 'S', textColor: '#E2001A' },
  'ESSO': { color: '#E2001A', abbr: 'E' },
  'JET': { color: '#FFD700', abbr: 'J', textColor: '#1A1A1A' },
  'TotalEnergies': { color: '#E2001A', abbr: 'T' },
  'TOTAL': { color: '#E2001A', abbr: 'T' },
  'HEM': { color: '#004B93', abbr: 'H' },
  'STAR': { color: '#FFB800', abbr: '★', textColor: '#1A1A1A' },
  'AGIP ENI': { color: '#FFD700', abbr: 'ENI', textColor: '#1A1A1A' },
  'AGIP': { color: '#FFD700', abbr: 'AG', textColor: '#1A1A1A' },
  'Sprint': { color: '#E30613', abbr: 'Sp' },
  'ELAN': { color: '#009640', abbr: 'EL' },
  'Q1': { color: '#E30613', abbr: 'Q1' },
  'bft-Tankstelle': { color: '#003D7A', abbr: 'bft' },
  'bft': { color: '#003D7A', abbr: 'bft' },
  'ORLEN': { color: '#E30613', abbr: 'OR' },
  'ORLEN Express': { color: '#E30613', abbr: 'OR' },
  'Access': { color: '#FF6600', abbr: 'Ac' },
  'Bavaria Petrol': { color: '#0066B3', abbr: 'BP' },
  'Supermarkt-Tankstelle': { color: '#6B7280', abbr: 'SM' },
  'SB': { color: '#6B7280', abbr: 'SB' },
  'OMV': { color: '#003A70', abbr: 'OMV' },
  'Westfalen': { color: '#009FE3', abbr: 'W' },
  'CLASSIC': { color: '#1E3A5F', abbr: 'CL' },
  'Raiffeisen': { color: '#006633', abbr: 'R' },
  'Avia': { color: '#E2001A', abbr: 'AV' },
  'Calpam': { color: '#FF6600', abbr: 'CP' },
  'Globus': { color: '#0072BC', abbr: 'GL' },
  'Markant': { color: '#E30613', abbr: 'M' },
};

function findBrand(brand: string): { color: string; abbr: string; textColor: string } {
  const upper = brand.toUpperCase();
  for (const [key, val] of Object.entries(BRAND_CONFIG)) {
    if (upper === key.toUpperCase() || upper.includes(key.toUpperCase())) {
      return { color: val.color, abbr: val.abbr, textColor: val.textColor ?? '#ffffff' };
    }
  }
  return { color: '#6B7280', abbr: brand.charAt(0).toUpperCase() || '?', textColor: '#ffffff' };
}

export function getBrandIcon(brand: string): { color: string; abbr: string; textColor: string } {
  return findBrand(brand);
}

export function getBrandIconHtml(brand: string, size: number = 24): string {
  const { color, abbr, textColor } = findBrand(brand);
  const fontSize = size < 28 ? Math.max(8, size * 0.4) : Math.max(10, size * 0.35);
  return `<div style="
    width:${size}px;height:${size}px;
    border-radius:50%;
    background:${color};
    color:${textColor};
    font-size:${fontSize}px;
    font-weight:800;
    display:flex;align-items:center;justify-content:center;
    border:2px solid white;
    box-shadow:0 1px 3px rgba(0,0,0,.3);
    letter-spacing:-0.5px;
    flex-shrink:0;
  ">${abbr}</div>`;
}
