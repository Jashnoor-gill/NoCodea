const fs = require('fs');
const path = require('path');

const pluginsDir = path.join(__dirname, '../plugins');

function loadPlugins(app) {
  if (!fs.existsSync(pluginsDir)) {
    fs.mkdirSync(pluginsDir);
    return;
  }
  fs.readdirSync(pluginsDir).forEach(pluginFolder => {
    const pluginPath = path.join(pluginsDir, pluginFolder);
    const manifestPath = path.join(pluginPath, 'plugin.json');
    if (fs.existsSync(manifestPath)) {
      const manifest = require(manifestPath);
      const mainFile = path.join(pluginPath, manifest.main || 'index.js');
      if (fs.existsSync(mainFile)) {
        const plugin = require(mainFile);
        if (typeof plugin === 'function') {
          plugin(app); // Pass your Express app or other context
          console.log(`Loaded plugin: ${manifest.name}`);
        }
      }
    }
  });
}

module.exports = loadPlugins; 