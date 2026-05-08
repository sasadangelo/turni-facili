const Employee = require('../models/Employee');
const Company = require('../models/Company');
const logger = require('../utils/logger');

// Create a new employee
const createEmployee = async (name, role, workingHours, companyId) => {
  logger.info(`📌 [Service] Creating new employee - name=${name}, role=${role}, workingHours=${workingHours}, companyId=${companyId}`);

  // Check if the company exists
  const companyExists = await Company.findById(companyId);
  if (!companyExists) {
    // Log the error if the company is not found
    logger.error(`❌ [Service] Company not found: ${companyId}`);
    throw new Error('Company not found');
  }

  try {
    // Create the new employee
    const newEmployee = new Employee({
      name,
      role,
      workingHours,
      company: companyId
    });

    // Save the employee to the database
    const savedEmployee = await newEmployee.save();
    logger.info(`✅ [Service] Employee created successfully - id=${savedEmployee._id}, name=${name} }`);
    return savedEmployee;
  } catch (error) {
    // Handle duplicate key error
    if (error.code === 11000) {
      logger.warn(`⚠️ [Service] Employee with name "${name}" already exists`);
      throw new Error("EmployeeAlreadyExists");
    }

    logger.error(`❌ [Service] Unexpected error creating employee: ${error.message}`);
    throw new Error(`Error creating employee: ${error.message}`);
  }
};

// Get all employees for a specific company
const getEmployeesByCompanyId = async (companyId) => {
  try {
    logger.info(`📌 [Service] Fetching employees for company ID: ${companyId}`);

    // Verifica che la company esista (opzionale ma consigliato)
    const companyExists = await Company.findById(companyId);
    if (!companyExists) {
      logger.warn(`⚠️ [Service] Company not found with ID: ${companyId}`);
      throw new Error('Company not found');
    }

    // Recupera gli employee associati a quella company
    const employees = await Employee.find({ company: companyId }).populate('company');

    logger.info(`✅ [Service] Employees fetched successfully for company ID: ${companyId} - count=${employees.length}`);
    return employees;
  } catch (error) {
    logger.error(`❌ [Service] Error fetching employees for company ID: ${companyId} - Error: ${error.message}`);
    throw new Error(`Error fetching employees by company: ${error.message}`);
  }
};

// Get an employee by ID
const getEmployeeById = async (id) => {
  logger.info(`📌 [Service] Fetching employee by ID: ${id}`);
  try {
    const employee = await Employee.findById(id).populate('company');
    if (!employee) {
      logger.warn(`⚠️ [Service] Employee not found with ID: ${id}`);
      return employee;
    }
    logger.info(`✅ [Service] Employee fetched successfully with ID: ${id}`);
    return employee;
  } catch (error) {
    logger.error(`❌ [Service] Error fetching employee by ID: ${id} - Error: ${error.message}`);
    throw new Error(`Error fetching employee by ID: ${error.message}`);
  }
};

// Update an employee by ID
const updateEmployee = async (id, name, role, workingHours, companyId) => {
  try {
    logger.info(`📌 [Service] Updating employee with ID: ${id}`);

    // Fetch the employee first
    const employee = await Employee.findById(id);
    if (!employee) {
      logger.warn(`⚠️ [Service] Employee not found with ID: ${id}`);
      return employee;
    }

    // If companyId is provided, verify the company exists
    if (companyId) {
      const company = await Company.findById(companyId);
      if (!company) {
        logger.warn(`⚠️ [Service] Company not found with ID: ${companyId}`);
        return null;
      }
      employee.company = companyId;
    }

    // Update fields
    employee.name = name;
    employee.role = role;
    employee.workingHours = workingHours;

    const updatedEmployee = await employee.save();
    logger.info(`✅ [Service] Employee updated successfully with ID: ${id}`);
    return updatedEmployee;

  } catch (error) {
    logger.error(`❌ [Service] Error updating employee with ID: ${id} - Error: ${error.message}`);
    throw new Error(`Error updating employee: ${error.message}`);
  }
};

// Delete an employee by ID
const deleteEmployee = async (id) => {
  try {
    logger.info(`📌 [Service] Deleting employee with ID: ${id}`);
    const deletedEmployee = await Employee.findByIdAndDelete(id);
    if (!deletedEmployee) {
      logger.warn(`⚠️ [Service] Employee not found with ID: ${id}`);
      return deletedEmployee;
    }
    logger.info(`✅ [Service] Employee deleted successfully with ID: ${id}`);
    return deletedEmployee;
  } catch (error) {
    logger.error(`❌ [Service] Error deleting employee with ID: ${id} - Error: ${error.message}`);
    throw new Error(`Error deleting employee: ${error.message}`);
  }
};

module.exports = {
  createEmployee,
  getEmployeesByCompanyId,
  getEmployeeById,
  updateEmployee,
  deleteEmployee
};
