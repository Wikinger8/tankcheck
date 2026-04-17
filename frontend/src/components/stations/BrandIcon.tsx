import { getBrandIcon } from '@/lib/brand-icons';

interface BrandIconProps {
  brand: string;
  size?: number;
}

export function BrandIcon({ brand, size = 32 }: BrandIconProps) {
  const { color, abbr, textColor } = getBrandIcon(brand);
  const fontSize = size < 28 ? Math.max(8, size * 0.4) : Math.max(10, size * 0.35);

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: color,
        color: textColor,
        fontSize,
        fontWeight: 800,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px solid white',
        boxShadow: '0 1px 3px rgba(0,0,0,.2)',
        letterSpacing: '-0.5px',
        flexShrink: 0,
      }}
    >
      {abbr}
    </div>
  );
}
