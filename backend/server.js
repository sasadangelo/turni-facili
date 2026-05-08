const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const yaml = require('js-yaml');
require('dotenv').config();

const employeeRoutes = require('./routes/employees');
const companyRoutes = require('./routes/companies');
const eventRoutes = require('./routes/events');
const eventTypeRoutes = require('./routes/eventtypes');
const logger = require("./utils/logger"); // Importa il logger

// Carica la configurazione dal file YAML
const config = yaml.load(fs.readFileSync('./config.yaml', 'utf8'));

// Crea un'app Express
const app = express();
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

// Middleware per loggare tutte le richieste
app.use((req, res, next) => {
  logger.info(`📌 ${req.method} ${req.url}`, { body: req.body });
  next();
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Usa le rotte per i dipendenti
app.use('/employees', employeeRoutes);
app.use('/companies', companyRoutes);
app.use("/events", eventRoutes);
app.use("/eventtypes", eventTypeRoutes);

// Middleware di gestione errori
app.use((err, req, res, next) => {
  logger.error(`⚠️  Error: ${err.message}`, { stack: err.stack });
  res.status(500).json({ error: "Internal Server Error" });
});

// Avvia il server
app.listen(port, host, () => {
  logger.info(`🚀 Server is running on http://${host}:${port}`);
});