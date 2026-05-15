module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // The Reanimated plugin requires native worklet support which isn’t available in the web build.
    // It can be omitted for the web version.
    plugins: [],
  };
};
