// src/components/BalanceCard.js
import React, { useEffect, useState, useContext } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const BalanceCard = ({ refreshTrigger }) => {
  const [balance, setBalance] = useState(0);
  const { token } = useContext(AuthContext);

  const fetchBalance = async () => {
    try {
      // On appelle l'API sans aucun filtre pour obtenir le solde global
      const res = await api.get('/transactions/balance');
      setBalance(res.data.balance);
    } catch (err) {
      console.error(
        'Erreur lors du chargement du solde',
        err.response ? err.response.data : err.message
      );
    }
  };

  useEffect(() => {
    if (token) {
      fetchBalance();
    }
  }, [token, refreshTrigger]); // se met à jour si le token ou le trigger change

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6">Solde actuel</Typography>
        <Typography variant="h4">{balance.toFixed(2)} EUR</Typography>
      </CardContent>
    </Card>
  );
};

export default BalanceCard;

