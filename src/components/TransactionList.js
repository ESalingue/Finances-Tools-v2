// src/components/TransactionList.js
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../services/api';

const TransactionList = ({ transactions, refreshTransactions, setNotification }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);

  const handleDeleteClick = (id) => {
    setTransactionToDelete(id);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setTransactionToDelete(null);
  };

  const confirmDelete = async () => {
  try {
    await api.delete(`/transactions/${transactionToDelete}`);
    setNotification({ open: true, message: "Transaction supprimée avec succès", severity: "success" });
    refreshTransactions(); // refreshData est appelé ici pour rafraîchir la liste et le solde
  } catch (err) {
    setNotification({ open: true, message: "Erreur lors de la suppression de la transaction", severity: "error" });
  } finally {
    handleDialogClose();
  }
};

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Type</TableCell>
              <TableCell align="right">Montant</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((tx) => (
              <TableRow key={tx._id}>
                <TableCell>{new Date(tx.date).toLocaleDateString()}</TableCell>
                <TableCell>{tx.description}</TableCell>
                <TableCell>{tx.type === 'income' ? 'Revenu' : 'Dépense'}</TableCell>
                <TableCell align="right">{tx.amount}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleDeleteClick(tx._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer cette transaction ? Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Annuler
          </Button>
          <Button onClick={confirmDelete} color="error">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TransactionList;

