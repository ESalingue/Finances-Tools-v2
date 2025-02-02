// src/components/PeriodFilter.js
import React, { useState } from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, TextField, Button } from '@mui/material';

const PeriodFilter = ({ onFilterChange }) => {
  const [periodType, setPeriodType] = useState("Tous");
  const [selectedDate, setSelectedDate] = useState("");

  const handlePeriodChange = (event) => {
    const value = event.target.value;
    setPeriodType(value);
    if (value === "Tous") {
      setSelectedDate("");
      onFilterChange({ period: "Tous", startDate: "", endDate: "" });
    }
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const applyFilter = () => {
    let startDate = "";
    let endDate = "";
    if (periodType === "Jour" && selectedDate) {
      // Pour un jour précis, on fixe le début et la fin au même jour
      startDate = selectedDate;
      endDate = selectedDate;
    } else if (periodType === "Semaine" && selectedDate) {
      // Pour une semaine, on considère le jour sélectionné et on calcule le lundi et le dimanche de cette semaine.
      const date = new Date(selectedDate);
      const day = date.getDay(); // 0 (dimanche) à 6 (samedi)
      // Supposons que la semaine commence le lundi
      const diffToMonday = day === 0 ? -6 : 1 - day; 
      const monday = new Date(date);
      monday.setDate(date.getDate() + diffToMonday);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      startDate = monday.toISOString().split('T')[0];
      endDate = sunday.toISOString().split('T')[0];
    } else if (periodType === "Mois" && selectedDate) {
      // L'input type "month" renvoie une valeur au format "YYYY-MM"
      const [year, month] = selectedDate.split("-");
      const firstDay = new Date(year, month - 1, 1);
      // Pour obtenir le dernier jour, on crée une date au mois suivant puis on recule d'un jour
      const lastDay = new Date(year, month, 0);
      startDate = firstDay.toISOString().split('T')[0];
      endDate = lastDay.toISOString().split('T')[0];
    } else if (periodType === "Année" && selectedDate) {
      // Pour l'année, on considère l'année saisie et on définit du 1er janvier au 31 décembre
      const year = selectedDate;
      const firstDay = new Date(year, 0, 1);
      const lastDay = new Date(year, 11, 31);
      startDate = firstDay.toISOString().split('T')[0];
      endDate = lastDay.toISOString().split('T')[0];
    }
    onFilterChange({ period: periodType, startDate, endDate });
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel id="period-type-label">Période</InputLabel>
        <Select
          labelId="period-type-label"
          value={periodType}
          label="Période"
          onChange={handlePeriodChange}
        >
          <MenuItem value="Tous">Tous</MenuItem>
          <MenuItem value="Jour">Jour</MenuItem>
          <MenuItem value="Semaine">Semaine</MenuItem>
          <MenuItem value="Mois">Mois</MenuItem>
          <MenuItem value="Année">Année</MenuItem>
        </Select>
      </FormControl>

      {periodType === "Jour" && (
        <TextField
          type="date"
          label="Choisir un jour"
          value={selectedDate}
          onChange={handleDateChange}
          InputLabelProps={{ shrink: true }}
        />
      )}
      {periodType === "Semaine" && (
        <TextField
          type="date"
          label="Choisir un jour (semaine)"
          value={selectedDate}
          onChange={handleDateChange}
          InputLabelProps={{ shrink: true }}
        />
      )}
      {periodType === "Mois" && (
        <TextField
          type="month"
          label="Choisir un mois"
          value={selectedDate}
          onChange={handleDateChange}
          InputLabelProps={{ shrink: true }}
        />
      )}
      {periodType === "Année" && (
        <TextField
          type="number"
          label="Choisir une année"
          value={selectedDate}
          onChange={handleDateChange}
          InputLabelProps={{ shrink: true }}
          inputProps={{ min: 2000, max: 2100 }}
        />
      )}
      <Button variant="contained" onClick={applyFilter}>Filtrer</Button>
    </Box>
  );
};

export default PeriodFilter;

