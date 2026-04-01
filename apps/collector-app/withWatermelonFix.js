const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

module.exports = function withWatermelonFix(config) {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      // 1. Find the physical file on your Windows hard drive
      const filePath = path.join(
        config.modRequest.projectRoot,
        'android',
        'app',
        'src',
        'main',
        'java',
        'com',
        'silkvalue',
        'collector',
        'MainApplication.kt'
      );

      // If the file doesn't exist yet, do nothing
      if (!fs.existsSync(filePath)) return config;

      // 2. Read the raw text of the file
      const fileContent = fs.readFileSync(filePath, 'utf-8');

      // 3. Split it by lines (handling Windows \r\n safely)
      const lines = fileContent.split(/\r?\n/);
      const newLines = [];
      let skipLines = 0;

      for (let i = 0; i < lines.length; i++) {
        // If we hit the bad block, skip this line and the next 2 lines
        if (skipLines > 0) {
          skipLines--;
          continue;
        }

        if (lines[i].includes('override fun getJSIModulePackage()')) {
          skipLines = 2; 
          continue;
        }

        // Strip the bad imports
        if (
          lines[i].includes('com.nozbe.watermelondb.jsi.WatermelonDBJSIPackage') ||
          lines[i].includes('com.facebook.react.bridge.JSIModulePackage')
        ) {
          continue; 
        }

        // Keep the clean lines
        newLines.push(lines[i]);
      }

      // 4. Overwrite the file with the clean code
      fs.writeFileSync(filePath, newLines.join('\n'));
      return config;
    },
  ]);
};