module.exports = {
  future: {
    defaultLineHeights: true,
    standardFontWeights: true,
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true
  },
  purge: ["./public/**/*.html", "./src/**/*.vue"],
  theme: {
    extend: {}
  },
  variants: { backgroundColor: ["responsive", "hover", "focus"] },
  plugins: []
};
