const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Tell Metro to watch the root folder for packages
config.watchFolders = [workspaceRoot];

// Tell Metro how to resolve those packages
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// Prevent Metro from resolving packages using the default heuristic
config.resolver.disableHierarchicalLookup = true;

module.exports = config;
