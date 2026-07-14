const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const employeeRoutes = require('./routes/employees');
const companyRoutes = require('./routes/companies');
const eventRoutes = require('./routes/events');
const eventTypeRoutes = require('./routes/eventtypes');
const logger = require('./utils/logger');

const app = express();

// Middleware per loggare tutte le richieste
app.use((req, res, next) => {
  logger.info(`📌 ${req.method} ${req.url}`, { body: req.body });
  next();
});

app.use(cors());
app.use(bodyParser.json());

app.use('/employees', employeeRoutes);
app.use('/companies', companyRoutes);
app.use('/events', eventRoutes);
app.use('/eventtypes', eventTypeRoutes);

// Middleware di gestione errori
app.use((err, req, res, next) => {
  logger.error(`⚠️  Error: ${err.message}`, { stack: err.stack });
  res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;
