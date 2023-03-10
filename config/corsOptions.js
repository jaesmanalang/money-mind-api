const allowedOrigins = [
  'http://127.0.0.1:3000',
  'http://localhost:3000',
  'https://money-mind.vercel.app',
  'https://money-mind.up.railway.app',
];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200,
  credentials: true,
};

module.exports = corsOptions;
