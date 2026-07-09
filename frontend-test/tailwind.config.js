/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Backgrounds
        'bg-primary': '#0A0E27',
        'bg-secondary': '#1A1F3A',
        'bg-surface': '#252E4A',
        'bg-border': '#3D4563',

        // Surface layers (from Stitch design)
        'surface': '#0D112A',
        'surface-dim': '#0D112A',
        'surface-bright': '#343752',
        'surface-container-lowest': '#080C25',
        'surface-container-low': '#161A33',
        'surface-container': '#1A1E37',
        'surface-container-high': '#242842',
        'surface-container-highest': '#2F334E',
        'on-surface': '#DEE0FF',
        'on-surface-variant': '#BBC9CE',
        'inverse-surface': '#DEE0FF',
        'inverse-on-surface': '#2B2F49',
        'outline': '#859398',
        'outline-variant': '#3C494D',
        'surface-tint': '#00D9FF',

        // Primary colors
        'primary': '#AFECFF',
        'on-primary': '#003641',
        'primary-container': '#00D9FF',
        'on-primary-container': '#005B6C',
        'inverse-primary': '#00687B',
        'primary-fixed': '#AEECFF',
        'primary-fixed-dim': '#00D9FF',
        'on-primary-fixed': '#001F26',
        'on-primary-fixed-variant': '#004E5D',

        // Secondary colors
        'secondary': '#C4C0FF',
        'on-secondary': '#2200A3',
        'secondary-container': '#3A23CF',
        'on-secondary-container': '#B5B0FF',
        'secondary-fixed': '#E3DFFF',
        'secondary-fixed-dim': '#C4C0FF',
        'on-secondary-fixed': '#120068',
        'on-secondary-fixed-variant': '#381FCD',

        // Tertiary colors
        'tertiary': '#63FF9A',
        'on-tertiary': '#003919',
        'tertiary-container': '#00E479',
        'on-tertiary-container': '#00602F',
        'tertiary-fixed': '#60FF99',
        'tertiary-fixed-dim': '#00E479',
        'on-tertiary-fixed': '#00210C',
        'on-tertiary-fixed-variant': '#005228',

        // Error colors
        'error': '#FFB4AB',
        'on-error': '#690005',
        'error-container': '#93000A',
        'on-error-container': '#FFDAD6',
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '48px',
        'grid-columns': '12',
        'gutter': '24px',
        'margin-mobile': '16px',
        'margin-desktop': '64px',
      },
      borderRadius: {
        'sm': '0.125rem',
        'DEFAULT': '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        'full': '9999px',
      },
      fontFamily: {
        'body': ['Inter', 'sans-serif'],
        'heading': ['Inter', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'display-lg': ['48px', { lineHeight: '56px', letterSpacing: '-0.02em' }],
        'display-lg-mobile': ['32px', { lineHeight: '40px', letterSpacing: '-0.02em' }],
        'headline-md': ['24px', { lineHeight: '32px', letterSpacing: '-0.01em' }],
        'body-lg': ['18px', { lineHeight: '28px', letterSpacing: '0' }],
        'body-md': ['16px', { lineHeight: '24px', letterSpacing: '0' }],
        'label-mono': ['14px', { lineHeight: '20px', letterSpacing: '0.05em' }],
        'caption': ['12px', { lineHeight: '16px', letterSpacing: '0.02em' }],
      },
      fontWeight: {
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
      },
    },
  },
  plugins: [],
}