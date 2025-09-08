import { colord } from 'colord'
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

const generateSpacing = (prefix, units = []) => {
  const spacingObj = {}
  const baseUnit = 0.1875 // 3px in rem

  for (const unit of units) {
    const remValue = (baseUnit * unit)
    spacingObj[prefix + unit] = remValue + 'rem'
  }

  return spacingObj
}

const baseTheme = {
  borderWidth: {
    1: '1px',
  },
  colors: {
    // Prevent usage of non-zinc gray colors
    gray: {},
    neutral: {},
    slate: {},
    stone: {},

    primary: 'rgb(var(--primary) / <alpha-value>)',
    'primary-hover': 'rgb(var(--primary-hover) / <alpha-value>)',
    'primary-text': 'rgb(var(--primary-text) / <alpha-value>)',

    // Base dark theme colors
    zinc: {
      50: 'rgb(var(--zinc-50) / <alpha-value>)',
      100: 'rgb(var(--zinc-100) / <alpha-value>)',
      200: 'rgb(var(--zinc-200) / <alpha-value>)',
      300: 'rgb(var(--zinc-300) / <alpha-value>)',
      400: 'rgb(var(--zinc-400) / <alpha-value>)',
      500: 'rgb(var(--zinc-500) / <alpha-value>)',
      600: 'rgb(var(--zinc-600) / <alpha-value>)',
      700: 'rgb(var(--zinc-700) / <alpha-value>)',
      800: 'rgb(var(--zinc-800) / <alpha-value>)',
      900: 'rgb(var(--zinc-900) / <alpha-value>)',
      950: 'rgb(var(--zinc-950) / <alpha-value>)',
    },
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
    ...generateSpacing('t', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 16, 18, 24, 48]),
    '2px': '2px',
    'section-padding': linearClamp(24, 48),
    'section-gap': linearClamp(36, 48),
    'callout-padding': linearClamp(24, 36),
    'globe-top': linearClamp(6.25, 0, '%'),
  },
  fontFamily: {
    'plex-mono': ['IBM Plex Mono', 'monospace'],
  },
  backgroundImage: {
    'gradient-radial': 'radial-gradient(circle at center, var(--tw-gradient-from) 0%, var(--tw-gradient-to) 100%)',
    'gradient-radial-offset': 'radial-gradient(circle at 50% 75%, var(--tw-gradient-from) 0%, var(--tw-gradient-to) 100%)',
    'schedule-event': 'url(/schedule-event.png)',
  },
  fontSize: {
    // Homepage
    hero: [linearClamp(36, 96), linearClamp(36 * 1.25, 96 * 1.0625)],
    callout: [linearClamp(16, 20), linearClamp(16 * 1.625, 20 * 1.625)],

    // Governance Landing
    'governance-title': [linearClamp(28, 64), linearClamp(28 * 1.25, 64 * 1.125)],
    'governance-subtitle': [linearClamp(24, 48), linearClamp(24 * 1.25, 48 * 1.25)],

    'stats-title': [linearClamp(36, 72), 1.25],
    'stats-label': [linearClamp(14, 18), 2.25],
    'stats-desc': [linearClamp(12, 14), 1.5],

    'footer-title': [linearClamp(24, 36), linearClamp(24 * 1.25, 36 * 1.25)],
    'footer-base': [linearClamp(16, 16), linearClamp(16 * 1.25, 16 * 1.5)],
  },
  strokeWidth: {
    'globe-stroke': linearClamp(9, 18),
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

    // This plugin extracts color variables from the theme colors and sets them
    // as CSS variables in the :root selector
    ({ addBase, theme }) => {
      const extractColorVars = (allThemeColors) => {
        const vars = {}
        const targetColorKeys = ['red', 'yellow', 'emerald', 'sky', 'blue', 'orange', 'amber', 'teal']

        for (const colorKey of targetColorKeys) {
          const palette = allThemeColors[colorKey]

          if (typeof palette === 'object' && palette !== null) {
            for (const [shade, colorValue] of Object.entries(palette)) {
              if (typeof colorValue === 'string') {
                const { r, g, b } = colord(colorValue).toRgb()
                vars[[`--${colorKey}`, shade].join('-')] = [r, g, b].join(' ')
              }
            }
          }
        }

        return vars
      }

      addBase({ ':root': extractColorVars(theme('colors')) })
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
    extend: deepmerge(
      baseTheme,
      nightshiftTheme,
    ),
  },
}
