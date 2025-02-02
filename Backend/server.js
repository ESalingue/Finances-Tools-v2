// server.js
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/transactions', require('./routes/transactions'));

const PORT = process.env.PORT || 5000;

connectDB().then(async () => {
  // Pré-créer l'utilisateur par défaut si inexistant
  const User = require('./models/User');
  const bcrypt = require('bcryptjs');

  const email = process.env.USER_EMAIL;
  if (!email) {
    console.error('USER_EMAIL non défini dans .env');
    process.exit(1);
  }

  let user = await User.findOne({ email });
  if (!user) {
    const newUser = new User({
      name: process.env.USER_NAME || 'Default User',
      email: process.env.USER_EMAIL,
      password: process.env.USER_PASSWORD
    });
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt);
    await newUser.save();
    console.log('Utilisateur par défaut créé');
  } else {
    console.log('Utilisateur par défaut déjà présent');
  }

  app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));
});

