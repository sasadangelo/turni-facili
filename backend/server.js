const mongoose = require('mongoose');
const fs = require('fs');
const yaml = require('js-yaml');
require('dotenv').config();

const app = require('./app');
const logger = require('./utils/logger');

// Carica la configurazione dal file YAML
const config = yaml.load(fs.readFileSync('./config.yaml', 'utf8'));
const port = config.server.port;
const host = config.server.host;

// Costruisci l'URI di MongoDB usando le variabili d'ambiente e la configurazione
const mongoPassword = process.env.MONGODB_PASSWORD;
const mongoUri = `mongodb+srv://${config.mongodb.username}:${mongoPassword}@${config.mongodb.host}/${config.mongodb.database}?retryWrites=${config.mongodb.options.retryWrites}&w=${config.mongodb.options.w}&appName=${config.mongodb.options.appName}`;

// Connessione a MongoDB
mongoose.connect(mongoUri, {})
  .then(() => {
    logger.info('✅ Connected to MongoDB');
  })
  .catch((error) => {
    logger.error('❌ Error connecting to MongoDB:', { error: error.message });
  });

// Avvia il server
app.listen(port, host, () => {
  logger.info(`🚀 Server is running on http://${host}:${port}`);
});
