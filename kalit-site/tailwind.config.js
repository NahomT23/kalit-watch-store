// // // /** @type {import('tailwindcss').Config} */
// // // export default {
// // //   content: [
// // //     "./index.html",
// // //     "./src/**/*.{js,ts,jsx,tsx}",
// // //   ],
// // //   theme: {
// // //     extend: {},
// // //   },
// // //   plugins: [],
// // // }

// // // tailwind.config.js


// // /** @type {import('tailwindcss').Config} */
// // export default {
// //   content: [
// //     "./index.html",
// //     "./src/**/*.{js,ts,jsx,tsx}",
// //   ],
// //   theme: {
// //     extend: {
// //       keyframes: {
// //         typing: {
// //           'from': { width: '0%' },
// //           'to': { width: '100%' },
// //         },
// //       },
// //       animation: {
// //         typing: 'typing 1.5s steps(30, end)',
// //       },
// //     },
// //   },
// //   plugins: [],
// // }


export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        typing: {
          'from': { width: '0%' },
          'to': { width: '100%' },
        },
      },
      animation: {
        typing: 'typing 1.5s steps(30, end)',
      },
      fontFamily: {
        baskervville: ['"Baskervville SC"', 'serif'],
      },
    },
  },
  plugins: [],
}


