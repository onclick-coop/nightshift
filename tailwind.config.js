import { deepmerge } from 'deepmerge-ts'
import twGlow from 'twglow'

const linearClamp = (min, max, unit = 'rem') => {
  min = min / 16
  max = max / 16

  const minWidth = 425 / 16 // minimum width of mobile
  const maxWidth = 1280 / 16 // maximum width of laptop

  const slope = (max - min) / (maxWidth - minWidth)
  const intercept = min - slope * minWidth
  const value = slope * 100

  return `clamp(${min}${unit}, ${intercept}${unit} + ${value}vw, ${max}${unit})`
}

const baseTheme = {
  borderWidth: {
    1: '1px',
  },
  colors: {
    primary: 'rgb(var(--primary) / <alpha-value>)',
    'primary-hover': 'rgb(var(--primary-hover) / <alpha-value>)',
    'primary-text': 'rgb(var(--primary-text) / <alpha-value>)',
  },
  flex: {
    2: '2 2 0%',
    3: '3 3 0%',
    4: '4 4 0%',
  },
  fontFamily: {
    din: ['D-DIN', 'sans-serif'],
    // 'din-cond': ['D-DIN Condensed', 'sans-serif'],
    'din-exp': ['D-DIN Expanded', 'sans-serif'],
    inter: ['Inter', 'sans-serif'],
  },
}

const nightshiftTheme = {
  screens: {
    'lt-xl': { max: '1279px' }, // Targets devices less than xl (1280px)
    print: { raw: 'print' },
    screen: { raw: 'screen' },
  },
  spacing: {
    '2px': '2px',
    // 'section-padding': linearClamp(24, 48),
    // 'section-gap': linearClamp(36, 48),
    // 'callout-padding': linearClamp(24, 36),
  },
  fontFamily: {
    'plex-mono': ['IBM Plex Mono', 'monospace'],
  },
  backgroundImage: {},
  fontSize: {
    hero: [linearClamp(36, 96), linearClamp(36 * 1.25, 96 * 1.0625)],
    callout: [linearClamp(16, 20), linearClamp(16 * 1.625, 20 * 1.625)],

    // Governance Landing
    // 'governance-title': [linearClamp(28, 64), linearClamp(28 * 1.25, 64 * 1.125)],
    // 'governance-subtitle': [linearClamp(24, 48), linearClamp(24 * 1.25, 48 * 1.25)],

    // 'stats-title': [linearClamp(36, 72), 1.25],
    // 'stats-label': [linearClamp(14, 18), 2.25],
    // 'stats-desc': [linearClamp(12, 14), 1.5],

    // 'footer-title': [linearClamp(24, 36), linearClamp(24 * 1.25, 36 * 1.25)],
    // 'footer-base': [linearClamp(16, 16), linearClamp(16 * 1.25, 16 * 1.5)],
  },
}

/** @type {import('tailwindcss').Config} */
export default {
  plugins: [
    twGlow,

    // This plugin adds variants for img, input, and svg elements
    // It allows you to use utilities like `img:w`, `input:bg`, and `svg:fill`
    ({ addVariant }) => {
      addVariant('img', '& img')
      addVariant('input', '& input')
      addVariant('svg', '& svg')
      addVariant('picker', '&::picker(select)')
      addVariant('picker-icon', '&::picker-icon')
    },

    // This plugin adds a utility to prevent autofill styles from applying
    // It uses a long transition time to override the default autofill styles
    ({ addUtilities }) => {
      addUtilities({
        '.autofill-transparent': {
          '&:-webkit-autofill, &:-webkit-autofill:hover, &:-webkit-autofill:focus': {
            transition: 'background-color 0s 600000s, color 0s 600000s',
            '-webkit-text-fill-color': 'inherit',
            '-webkit-box-shadow': 'inset 0 0 0px 1000px transparent',
          },
        },
      })
    },
  ],
  content: [
    './*.html',
    './src/**/*.{css,js,ts}',
    './layout/**/*.liquid',
    './templates/**/*.liquid',
    './sections/**/*.liquid',
    './snippets/**/*.liquid',
  ],
  theme: {
    extend: deepmerge(baseTheme, nightshiftTheme),
  },
}
