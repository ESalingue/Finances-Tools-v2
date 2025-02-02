// src/pages/Dashboard.js
import React, { useEffect, useState, useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import ChartDashboard from '../components/ChartDashboard';
import PeriodFilter from '../components/PeriodFilter';
import BalanceCard from '../components/BalanceCard';

const Dashboard = () => {
  const { logout, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState({ period: 'Tous', startDate: '', endDate: '' });
  const [balanceRefreshTrigger, setBalanceRefreshTrigger] = useState(0);
  
  // État pour gérer les notifications
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  const fetchTransactions = async () => {
    try {
      const params = {};
      if (filter.period !== 'Tous') {
        params.startDate = filter.startDate;
        params.endDate = filter.endDate;
      }
      const res = await api.get('/transactions', { params });
      setTransactions(res.data);
    } catch (err) {
      console.error(
        'Erreur lors du chargement des transactions',
        err.response ? err.response.data : err.message
      );
      setNotification({ open: true, message: "Erreur lors du chargement des transactions", severity: "error" });
    }
  };

  // Nouvelle fonction qui rafraîchit transactions ET le solde global
  const refreshData = async () => {
    await fetchTransactions();
    setBalanceRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    if (token) {
      fetchTransactions();
    }
  }, [token, filter]);

  const addTransaction = async (transactionData) => {
    try {
      const res = await api.post('/transactions', transactionData);
      setTransactions([res.data, ...transactions]);
      // Mise à jour du solde global après ajout
      setBalanceRefreshTrigger(prev => prev + 1);
      setNotification({ open: true, message: "Transaction ajoutée avec succès", severity: "success" });
    } catch (err) {
      console.error(
        'Erreur lors de l’ajout de la transaction',
        err.response ? err.response.data : err.message
      );
      setNotification({ open: true, message: "Erreur lors de l’ajout de la transaction", severity: "error" });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setNotification({ open: true, message: "Déconnexion réussie", severity: "info" });
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const handleNotificationClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setNotification(prev => ({ ...prev, open: false }));
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Gestion d'argent
          </Typography>
          <Button color="inherit" onClick={handleLogout}>Déconnexion</Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <BalanceCard refreshTrigger={balanceRefreshTrigger} />
        <PeriodFilter onFilterChange={handleFilterChange} />
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>Ajouter une transaction</Typography>
          <TransactionForm addTransaction={addTransaction} />
        </Box>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>Statistiques</Typography>
          <ChartDashboard transactions={transactions} />
        </Box>
        <Box>
          <Typography variant="h5" gutterBottom>Transactions récentes</Typography>
          {/* Passage de refreshData pour rafraîchir à la fois transactions et solde */}
          <TransactionList transactions={transactions} refreshTransactions={refreshData} setNotification={setNotification} />
        </Box>
      </Container>
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}  // Position en haut à droite
      >
        <Alert onClose={handleNotificationClose} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Dashboard;

