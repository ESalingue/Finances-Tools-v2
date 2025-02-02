// middleware/auth.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function (req, res, next) {
  // Récupérer le token dans le header "x-auth-token"
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ msg: 'Pas de token, accès refusé' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token invalide' });
  }
};

