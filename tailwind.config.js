import defaultTheme from 'tailwindcss/defaultTheme'
import flowbite from 'flowbite/plugin'

export default {
  content: [
    './resources/js/**/*.jsx',
    './resources/views/**/*.blade.php',
    './node_modules/flowbite-react/**/*.js',
    './node_modules/flowbite/**/*.js'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [
    flowbite,
  ],
}
