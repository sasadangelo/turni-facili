const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const employeeRoutes = require('./routes/employees');
const companyRoutes = require('./routes/companies');

// Crea un'app Express
const app = express();
const port = 5000;

// Connessione a MongoDB
const uri = 'mongodb+srv://sasadangelo:yKCo5bPrcXwSZaAq@mongodbcluster.ofer3.mongodb.net/?retryWrites=true&w=majority&appName=MongoDBCluster';
mongoose.connect(uri, {})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Usa le rotte per i dipendenti
app.use('/employees', employeeRoutes);
app.use('/companies', companyRoutes);

// Avvia il server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
