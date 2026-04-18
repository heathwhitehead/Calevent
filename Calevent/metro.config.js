const { getDefaultConfig } = require('expo/metro-config');
const config = getDefaultConfig(__dirname);

// Disable package exports to bypass the 'require' error
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
