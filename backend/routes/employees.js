const express = require('express');
const employeeService = require('../services/employeeService');
const router = express.Router();

// Rotta per aggiungere un dipendente
router.post('/', async (req, res) => {
  const { name, role, workingHours, company } = req.body;
  console.log('Request body:', req.body);

  try {
    const newEmployee = await employeeService.createEmployee(name, role, workingHours, company);
    res.status(201).json({ success: true, employee: newEmployee });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Rotta per ottenere la lista dei dipendenti
router.get('/', async (req, res) => {
  try {
    // Recupera tutti i dipendenti
    const employees = await employeeService.getAllEmployees();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Ottenere un singolo employee
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const employee = await employeeService.getEmployeeById(id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


// Rotta per aggiornare un dipendente
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, role, workingHours, company } = req.body;

  try {
    // Verifica se l'azienda esiste
    const updatedEmployee = await employeeService.updateEmployee(id, name, role, workingHours, company);
    if (!updatedEmployee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    res.status(200).json({ success: true, employee: updatedEmployee });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Rotta per eliminare un dipendente
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Elimina il dipendente
    const deletedEmployee = await employeeService.deleteEmployee(id);
    if (!deletedEmployee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    res.status(200).json({ success: true, message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
