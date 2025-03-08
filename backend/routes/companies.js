const express = require('express');
const router = express.Router();
const companyService = require('../services/companyService');

// Creare una nuova company
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    const company = await companyService.createCompany(name);
    res.status(201).json(company);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Ottenere tutte le company
router.get('/', async (req, res) => {
  try {
    const companies = await companyService.getAllCompanies();
    res.json(companies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rotta per aggiornare una company
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ success: false, message: 'Name is required' });
  }

  try {
    const company = await companyService.updateCompany(id, name);
    res.status(200).json({ success: true, company });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Rotta per eliminare una company
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await companyService.deleteCompany(id);
    res.status(200).json({ success: true, message: 'Company deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Ottenere una singola company
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const company = await companyService.getCompanyById(id);
    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
