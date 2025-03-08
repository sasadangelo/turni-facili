const express = require('express');
const Employee = require('../models/Employee');
const router = express.Router();

// Rotta per aggiungere un dipendente
router.post('/', async (req, res) => {
  const { name, role, workingHours } = req.body;

  try {
    // Crea un nuovo dipendente
    const newEmployee = new Employee({
      name,
      role,
      workingHours,
    });

    // Salva il dipendente nel database
    await newEmployee.save();

    res.status(201).json({ success: true, employee: newEmployee });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Rotta per ottenere la lista dei dipendenti
router.get('/', async (req, res) => {
  try {
    // Recupera tutti i dipendenti
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
