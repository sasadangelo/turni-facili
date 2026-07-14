const mongoose = require('mongoose');

const app = require('./app');
const logger = require('./utils/logger');
const { config, mongoUri } = require('./config');

// La configurazione è già stata caricata e validata all'require di './config':
// se siamo arrivati fin qui, host/porta/credenziali sono garantiti validi.
const port = config.get('server.port');
const host = config.get('server.host');

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
