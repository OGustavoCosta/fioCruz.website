/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./templates/**/*.html",
    "./static/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        'blue':         '#1351b4',
        'dark-blue':    '#0c326f',
        'dark-cyan':    '#037478',
        'cyan':         '#0bb19d',
        'teal':         '#00796B',
        'teal-dark':    '#004D40',
        'teal-light':   '#E0F2F1',
        'green':        '#268744',
        'yellow':       '#ffd125',
        'red':          '#a23737',
        'neutral-900':  '#000',
        'neutral-600':  '#121212',
        'neutral-500':  '#393939',
        'neutral-400':  '#626262',
        'neutral-300':  '#9a9a9a',
        'neutral-200':  '#cacaca',
        'neutral-175':  '#dcdcdc',
        'neutral-150':  '#ebebeb',
        'neutral-100':  '#f1f1f1',
        'neutral-50':   '#f5f5f7',
        'neutral-0':    '#fff',
      },
      fontFamily: {
        'rawline': ['Rawline', 'sans-serif'],
      },
      spacing: {
        'mobile-padding': '0.75rem',
        'desktop-padding': '2rem',
      },
      maxWidth: {
        'width-size': '1280px',
      },
    }
  },
  plugins: [],
}
