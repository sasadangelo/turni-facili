const mongoose = require('mongoose');

// Stringa di connessione per MongoDB Atlas
const uri = 'mongodb+srv://sasadangelo:yKCo5bPrcXwSZaAq@mongodbcluster.ofer3.mongodb.net/?retryWrites=true&w=majority&appName=MongoDBCluster';

// Connessione a MongoDB
mongoose.connect(uri, {})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
