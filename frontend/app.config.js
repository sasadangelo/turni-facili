const path = require('path');
const yaml = require('js-yaml');
const convict = require('convict');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// This file runs in Node (Expo CLI), never in the app bundle: it's safe to
// read config.yaml and .env here even though React Native code can't.
convict.addFormat({
  name: 'required-string',
  validate: (val) => {
    if (typeof val !== 'string' || val.trim() === '') {
      throw new Error('is required and must be a non-empty string');
    }
  }
});
convict.addParser({ extension: ['yml', 'yaml'], parse: yaml.load });

const schema = {
  api: {
    host: {
      doc: 'Hostname of the turni-facili backend',
      format: 'required-string',
      default: null
    },
    port: {
      doc: 'Port of the turni-facili backend',
      format: 'port',
      default: null
    }
  }
  // Add secret fields here as { env: 'SOME_SECRET', sensitive: true, default: null },
  // sourced from frontend/.env — never commit real values or put them in config.yaml.
};

const config = convict(schema);
config.loadFile(path.join(__dirname, 'config.yaml'));

try {
  config.validate({ allowed: 'strict' });
} catch (error) {
  // Fail fast: an invalid frontend config must stop the Expo CLI at startup,
  // not surface as confusing fetch failures once the app is running.
  console.error(`❌ Invalid configuration (frontend/config.yaml): ${error.message}`);
  process.exit(1);
}

const api = config.get('api');

module.exports = {
  expo: {
    name: 'turni-facili',
    slug: 'turni-facili',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    newArchEnabled: true,
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff'
    },
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff'
      }
    },
    web: {
      favicon: './assets/favicon.png'
    },
    extra: {
      apiBaseUrl: `http://${api.host}:${api.port}`
    }
  }
};
