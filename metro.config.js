const { getDefaultConfig } = require('expo/config');

module.exports = (() => {
  const config = getDefaultConfig(__dirname);
  
  config.resolver.blockList = [
    /web\/.*/,
  ];
  
  return config;
})();
