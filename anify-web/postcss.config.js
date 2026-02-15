export default {
  plugins: {
    "@tailwindcss/postcss": {},
    "postcss-preset-env": {
      stage: 2,
      features: {
        "nesting-rules": true,
      },
      autoprefixer: {
        flexbox: "no-2009",
        grid: "autoplace",
      },
    },
  },
};
