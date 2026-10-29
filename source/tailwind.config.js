/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: '#0F1B2D', 2: '#16253B', 3: '#1B2D47', 4: '#24395A' },
        // theme-aware tokens (switch per section with .theme-light / .theme-dark)
        fg: 'rgb(var(--fg) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        muted2: 'rgb(var(--muted2) / <alpha-value>)',
        muted3: 'rgb(var(--muted3) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        surface2: 'rgb(var(--surface2) / <alpha-value>)',
        surface3: 'rgb(var(--surface3) / <alpha-value>)',
        acc: 'rgb(var(--acc) / <alpha-value>)',
        sun: { DEFAULT: '#FACC2C', deep: '#E9A800', soft: '#FFE68A' },
        mist: { DEFAULT: '#C9D3E3', 2: '#8C9AB2', 3: '#5D6B84' },
        sky: '#7CC6FF',
        ember: '#FF7A45',
        leaf: '#3DDC97',
      },
      fontFamily: {
        // fivesdigital.com brand fonts: PT Serif (headings, copy) + Inter (UI, labels, numbers)
        display: ['"PT Serif"', 'Georgia', 'serif'],
        serif: ['"PT Serif"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        mono: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
