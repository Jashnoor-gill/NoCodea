const fs = require('fs');
const path = require('path');

const themesDir = path.join(__dirname, '../themes');

function loadThemes(app) {
  if (!fs.existsSync(themesDir)) {
    fs.mkdirSync(themesDir);
    return;
  }
  fs.readdirSync(themesDir).forEach(themeFolder => {
    const themePath = path.join(themesDir, themeFolder);
    const manifestPath = path.join(themePath, 'theme.json');
    if (fs.existsSync(manifestPath)) {
      const manifest = require(manifestPath);
      const mainFile = path.join(themePath, manifest.main || 'index.js');
      if (fs.existsSync(mainFile)) {
        const theme = require(mainFile);
        if (typeof theme === 'function') {
          theme(app); // Pass your Express app or other context
          console.log(`Loaded theme: ${manifest.name}`);
        }
      }
    }
  });
}

module.exports = loadThemes; 