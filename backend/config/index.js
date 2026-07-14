const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const convict = require('convict');
require('dotenv').config();

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
  server: {
    host: {
      doc: 'Bind address for the HTTP server',
      format: String,
      default: '0.0.0.0'
    },
    port: {
      doc: 'Port for the HTTP server',
      format: 'port',
      default: 5001
    }
  },
  mongodb: {
    host: {
      doc: 'MongoDB Atlas cluster host',
      format: 'required-string',
      default: null
    },
    username: {
      doc: 'MongoDB username',
      format: 'required-string',
      default: null
    },
    database: {
      doc: 'MongoDB database name',
      format: 'required-string',
      default: null
    },
    password: {
      doc: 'MongoDB password',
      format: 'required-string',
      default: null,
      env: 'MONGODB_PASSWORD',
      sensitive: true
    },
    options: {
      retryWrites: {
        doc: 'Enable MongoDB retryable writes',
        format: Boolean,
        default: true
      },
      w: {
        doc: 'MongoDB write concern',
        format: String,
        default: 'majority'
      },
      appName: {
        doc: 'Application name reported to MongoDB',
        format: String,
        default: 'MongoDBCluster'
      }
    }
  }
};

const config = convict(schema);

const configFile = path.join(__dirname, '..', 'config.yaml');
config.loadFile(configFile);

try {
  config.validate({ allowed: 'strict' });
} catch (error) {
  // Fail fast: an invalid configuration must stop the app at startup,
  // not surface as a confusing error deep inside mongoose/express later.
  // eslint-disable-next-line no-console
  console.error(`❌ Invalid configuration (${configFile}): ${error.message}`);
  process.exit(1);
}

const mongodb = config.get('mongodb');
const mongoUri = `mongodb+srv://${mongodb.username}:${mongodb.password}@${mongodb.host}/${mongodb.database}` +
  `?retryWrites=${mongodb.options.retryWrites}&w=${mongodb.options.w}&appName=${mongodb.options.appName}`;

module.exports = { config, mongoUri };
