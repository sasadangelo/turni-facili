const express = require('express');
const router = express.Router();
const companyService = require('../services/companyService');
const logger = require("../utils/logger");

// Create a new Company
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    logger.info(`📌 [POST] /companies - Create company request received - Body: ${JSON.stringify(req.body)}`);
    logger.debug(`🔍 Parameters extracted from request: ${name}`);
    const newCompany = await companyService.createCompany(name);
    logger.info("✅ Company created", { name });
    res.status(201).json({ success: true, company: newCompany });
  } catch (error) {
    logger.error("❌ Error creating Company", { error: error });
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all the companies
router.get('/', async (req, res) => {
  try {
    logger.info("📌 [GET] /companies - Request to get all companies received");
    const companies = await companyService.getAllCompanies();
    logger.info(`✅ [GET] /companies - Successfully retrieved all companies: count=${companies.length}`);
    res.json(companies);
  } catch (error) {
    logger.error(`❌ [GET] /companies - Error retrieving companies - Error: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update a company
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    logger.info(`📌 [PUT] /companies/${id} - Update company request received - name=${name}`);
    const company = await companyService.updateCompany(id, name);
    // Check if the company exists, and return 404 if not
    if (!company) {
      logger.warn(`⚠️ [GET] /companies/${id} - Company not found`);
      return res.status(404).json({ success: false, message: 'Company not found' });
    }
    logger.info(`✅ [PUT] /companies/${id} - Company updated successfully - Updated Company: ${JSON.stringify(company)}`);
    res.status(200).json({ success: true, company });
  } catch (error) {
    logger.error(`❌ [PUT] /companies/${id} - Error updating company - Error: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete a company
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    logger.info(`📌 [DELETE] /companies/${id} - Delete company request received`);
    const company = await companyService.deleteCompany(id);
    // Check if the company exists, and return 404 if not
    if (!company) {
      logger.warn(`⚠️ [GET] /companies/${id} - Company not found`);
      return res.status(404).json({ success: false, message: 'Company not found' });
    }
    logger.info(`✅ [DELETE] /companies/${id} - Company deleted successfully`);
    res.status(200).json({ success: true, message: 'Company deleted successfully' });
  } catch (error) {
    logger.error(`❌ [DELETE] /companies/${id} - Error deleting company - Error: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get a single company
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    logger.info(`📌 [GET] /companies/${id} - Get company request received`);
    const company = await companyService.getCompanyById(id);
    // Check if the company exists, and return 404 if not
    if (!company) {
      logger.warn(`⚠️ [GET] /companies/${id} - Company not found`);
      return res.status(404).json({ success: false, message: 'Company not found' });
    }
    logger.info(`✅ [GET] /companies/${id} - Company found: ${JSON.stringify(company)}`);
    res.status(200).json(company);
  } catch (error) {
    if (error.message === "CompanyAlreadyExists") {
      logger.warn("⚠️ Conflict: Company already exists", { name });
      return res.status(409).json({ success: false, message: "Company already exists" });
    }
    logger.error(`❌ [GET] /companies/${id} - Error fetching company - Error: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
