// src/components/TransactionForm.js
import React, { useState } from 'react';
import { TextField, Button, MenuItem, Box } from '@mui/material';

const currencies = [
  { code: 'EUR', label: 'Euro (€)' },
  { code: 'USD', label: 'Dollar ($)' },
  { code: 'GBP', label: 'Livre (£)' }
];

const TransactionForm = ({ addTransaction }) => {
  const [formData, setFormData] = useState({
    amount: '',
    date: '',
    type: 'expense',
    description: '',
    currency: 'EUR',
    location: ''
  });

  const { amount, date, type, description, currency, location } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!amount || !date) return;
    const transactionData = {
      amount: parseFloat(amount),
      date,
      type,
      description,
      currency,
      location
    };
    addTransaction(transactionData);
    setFormData({
      amount: '',
      date: '',
      type: 'expense',
      description: '',
      currency: 'EUR',
      location: ''
    });
  };

  return (
    <Box component="form" onSubmit={onSubmit} sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
      <TextField 
        label="Montant" 
        name="amount" 
        type="number" 
        value={amount} 
        onChange={onChange} 
        required 
      />
      <TextField 
        label="Date" 
        name="date" 
        type="date" 
        value={date} 
        onChange={onChange} 
        InputLabelProps={{ shrink: true }} 
        required 
      />
      <TextField 
        select 
        label="Type" 
        name="type" 
        value={type} 
        onChange={onChange}
      >
        <MenuItem value="expense">Dépense</MenuItem>
        <MenuItem value="income">Revenu</MenuItem>
      </TextField>
      <TextField 
        select
        label="Devise" 
        name="currency" 
        value={currency} 
        onChange={onChange}
      >
        {currencies.map(option => (
          <MenuItem key={option.code} value={option.code}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
      <TextField 
        label="Localisation" 
        name="location" 
        value={location} 
        onChange={onChange} 
      />
      <TextField 
        label="Description" 
        name="description" 
        value={description} 
        onChange={onChange} 
      />
      <Button type="submit" variant="contained">Ajouter</Button>
    </Box>
  );
};

export default TransactionForm;

