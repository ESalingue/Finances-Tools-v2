// routes/transactions.js
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');

// @route   POST /api/transactions
// @desc    Ajouter une transaction
// @access  Privé
router.post(
  '/',
  [
    auth,
    [
      check('amount', 'Le montant est obligatoire').not().isEmpty(),
      check('date', 'La date est obligatoire').not().isEmpty(),
      check('type', 'Le type doit être "income" ou "expense"').isIn(['income', 'expense'])
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { amount, type, description, date, currency, location } = req.body;
    try {
      const newTransaction = new Transaction({
        user: req.user.id,
        amount,
        type,
        description,
        date,
        currency,
        location
      });
      const transaction = await newTransaction.save();
      res.json(transaction);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Erreur serveur');
    }
  }
);

// @route   GET /api/transactions
// @desc    Récupérer toutes les transactions de l’utilisateur connecté
// @access  Privé
router.get('/', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let filter = { user: req.user.id };
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    const transactions = await Transaction.find(filter).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// routes/transactions.js (GET /balance)
router.get('/balance', auth, async (req, res) => {
  const { startDate, endDate } = req.query;
  let filter = { user: req.user.id };
  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }
  try {
    const transactions = await Transaction.find(filter);
    const balance = transactions.reduce((acc, tx) => {
      return tx.type === 'income' ? acc + tx.amount : acc - tx.amount;
    }, 0);
    res.json({ balance });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// @route   PUT /api/transactions/:id
// @desc    Mettre à jour une transaction
// @access  Privé
router.put('/:id', auth, async (req, res) => {
  const { amount, type, description, date } = req.body;
  // Construction de l'objet de mise à jour
  const transactionFields = {};
  if (amount) transactionFields.amount = amount;
  if (type) transactionFields.type = type;
  if (description) transactionFields.description = description;
  if (date) transactionFields.date = date;

  try {
    let transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(404).json({ msg: 'Transaction non trouvée' });
    // Vérifier l'utilisateur
    if (transaction.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Accès non autorisé' });
    }
    transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { $set: transactionFields },
      { new: true }
    );
    res.json(transaction);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// @route   DELETE /api/transactions/:id
// @desc    Supprimer une transaction
// @access  Privé
router.delete('/:id', auth, async (req, res) => {
  try {
    let transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(404).json({ msg: 'Transaction non trouvée' });
    // Vérifier l'utilisateur
    if (transaction.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Accès non autorisé' });
    }
    await Transaction.findByIdAndRemove(req.params.id);
    res.json({ msg: 'Transaction supprimée' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

module.exports = router;

