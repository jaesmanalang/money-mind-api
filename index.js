const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const connectToDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const corsOptions = require('./config/corsOptions');
dotenv.config();

connectToDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(
  cors({
    origin: 'https://money-mind.vercel.app',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/expenses', expenseRoutes);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});
