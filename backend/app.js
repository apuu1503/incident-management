require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const { sequelize } = require('./models');
const userRoutes = require('./routes/users');
const incidentRoutes = require('./routes/incidents');

const app = express();

// ✅ Enable CORS (before routes)
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// ✅ Parse JSON bodies
app.use(bodyParser.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/incidents', incidentRoutes);

const PORT = process.env.PORT || 4000;

sequelize.authenticate()
  .then(() => {
    console.log('DB connected');
    return sequelize.sync(); // use sync({force:true}) only in dev
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
  })
  .catch(err => {
    console.error('Unable to connect to DB', err);
  });
