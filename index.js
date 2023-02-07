const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectToDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
dotenv.config();

connectToDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/auth', authRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});
