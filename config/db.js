const mongoose = require('mongoose');

const connectToDB = async () => {
  let uri;
  if (process.env.NODE_ENV === 'development') {
    uri = process.env.MONGODB_URI_DEV;
  } else if (process.env.NODE_ENV === 'production') {
    uri = process.env.MONGODB_URI;
  }

  mongoose.set('strictQuery', false);

  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB connection established on ${conn.connection.host}`);
  } catch (err) {
    console.error(`Error connecting to MongoDB: ${err}`);
    process.exit(1);
  }
};

module.exports = connectToDB;
