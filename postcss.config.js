module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    ...(process.env.NODE_ENV === 'production'
      ? {
          cssnano: {
            preset: [
              'default',
              {
                discardComments: {
                  removeAll: true,
                },
                normalizeWhitespace: false,
                colormin: false,
                minifyFontValues: false,
                minifyGradients: false,
                minifyParams: false,
                minifySelectors: false,
                reduceIdents: false,
              },
            ],
          },
        }
      : {}),
  },
}
