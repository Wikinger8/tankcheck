/**
 * Icon Generation Script
 *
 * This script generates PNG icons from the SVG source for the PWA manifest.
 *
 * Prerequisites:
 *   npm install sharp
 *
 * Usage:
 *   npx tsx scripts/generate-icons.ts
 *
 * It will generate:
 *   - public/icons/icon-192x192.png
 *   - public/icons/icon-512x512.png
 *   - public/icons/icon-maskable-512x512.png (with extra padding)
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

async function generateIcons() {
  try {
    // Dynamic import for sharp (optional dependency)
    const sharp = (await import('sharp')).default;

    const svgPath = join(__dirname, '..', 'public', 'icons', 'icon.svg');
    const svgBuffer = readFileSync(svgPath);

    const sizes = [192, 512];

    for (const size of sizes) {
      const png = await sharp(svgBuffer).resize(size, size).png().toBuffer();
      const outputPath = join(__dirname, '..', 'public', 'icons', `icon-${size}x${size}.png`);
      writeFileSync(outputPath, png);
      console.log(`Generated: icon-${size}x${size}.png`);
    }

    // Maskable icon: add 20% padding (safe zone)
    const maskableSize = 512;
    const innerSize = Math.round(maskableSize * 0.8);
    const offset = Math.round((maskableSize - innerSize) / 2);

    const innerPng = await sharp(svgBuffer).resize(innerSize, innerSize).png().toBuffer();
    const maskable = await sharp({
      create: {
        width: maskableSize,
        height: maskableSize,
        channels: 4,
        background: { r: 37, g: 99, b: 235, alpha: 1 }, // #2563eb
      },
    })
      .composite([{ input: innerPng, left: offset, top: offset }])
      .png()
      .toBuffer();

    const maskablePath = join(__dirname, '..', 'public', 'icons', `icon-maskable-${maskableSize}x${maskableSize}.png`);
    writeFileSync(maskablePath, maskable);
    console.log(`Generated: icon-maskable-${maskableSize}x${maskableSize}.png`);

    console.log('All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons. Make sure "sharp" is installed:', error);
    console.log('Run: npm install --save-dev sharp');
  }
}

generateIcons();
