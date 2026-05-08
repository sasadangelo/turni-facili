const express = require('express');
const router = express.Router();
const employeeService = require('../services/employeeService');
const logger = require("../utils/logger");

// Route to add an employee
router.post('/', async (req, res) => {
  try {
    // Destructure data from the request body
    const { name, role, workingHours, company } = req.body;
    logger.info(`📌 [POST] /employees - Add employee request received - Body: ${JSON.stringify(req.body)}`);
    const newEmployee = await employeeService.createEmployee(name, role, workingHours, company);
    logger.info(`✅ [POST] /employees - Employee created successfully. name=${name}, role=${role}, workingHours=${workingHours}, company=${company}`);
    res.status(201).json({ success: true, employee: newEmployee });
  } catch (error) {
    logger.error(`❌ [POST] /employees - Error creating employee - Error: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Route to get employees by company ID (via query string)
router.get('/', async (req, res) => {
  const { companyId } = req.query;
  logger.info(`📌 [GET] /employees - Fetch employees request received for companyId=${companyId}`);

  if (!companyId) {
    logger.warn("⚠️ [GET] /employees - Missing companyId in query");
    return res.status(400).json({ success: false, message: "Missing companyId in query parameters" });
  }

  try {
    const employees = await employeeService.getEmployeesByCompanyId(companyId);
    logger.info(`✅ [GET] /employees - Successfully retrieved employees for companyId=${companyId}. count=${employees.length}`);
    res.status(200).json(employees);
  } catch (error) {
    logger.error(`❌ [GET] /employees - Error fetching employees - Error: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Route to get a single employee by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    logger.info(`📌 [GET] /employees/${id} - Fetch employee by ID request received`);
    const employee = await employeeService.getEmployeeById(id);
    if (!employee) {
      logger.warn(`⚠️ [GET] /employees/${id} - Employee not found`);
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    logger.info(`✅ [GET] /employees/${id} - Employee found: ${JSON.stringify(employee)}`);
    res.status(200).json(employee);
  } catch (error) {
    logger.error(`❌ [GET] /employees/${id} - Error fetching employee: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
});


// Route to update an employee's details
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, role, workingHours, company } = req.body;

  try {
    logger.info(`📌 [PUT] /employees/${id} - Update employee request received - name=${name}, role=${role}, workingHours=${workingHours}, company=${company}`);
    const updatedEmployee = await employeeService.updateEmployee(id, name, role, workingHours, company);
    if (!updatedEmployee) {
      logger.warn(`⚠️ [PUT] /employees/${id} - Employee not found`);
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    logger.info(`✅ [PUT] /employees/${id} - Employee updated successfully - Updated Employee: ${JSON.stringify(updatedEmployee)}`);
    res.status(200).json({ success: true, employee: updatedEmployee });
  } catch (error) {
    logger.error(`❌ [PUT] /employees/${id} - Error updating employee: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Route to delete an employee
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    logger.info(`📌 [DELETE] /employees/${id} - Delete employee request received`);
    const deletedEmployee = await employeeService.deleteEmployee(id);
    if (!deletedEmployee) {
      logger.warn(`⚠️ [DELETE] /employees/${id} - Employee not found`);
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    logger.info(`✅ [DELETE] /employees/${id} - Employee deleted successfully`);
    res.status(200).json({ success: true, message: 'Employee deleted successfully' });
  } catch (error) {
    logger.error(`❌ [DELETE] /employees/${id} - Error deleting employee: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
