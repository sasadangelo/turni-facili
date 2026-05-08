const Company = require('../models/Company');
const logger = require('../utils/logger');

const createCompany = async (name) => {
  try {
    logger.info(`📌 [Service] Creating company with name: ${name}`);

    // Check if the company already exists
    const existingCompany = await Company.findOne({ name });
    if (existingCompany) {
      logger.warn(`⚠️ [Service] Company with name "${name}" already exists`);
      throw new Error("CompanyAlreadyExists");
    }

    const company = new Company({ name });
    const savedCompany = await company.save();
    logger.info(`✅ [Service] Company created successfully: id=${savedCompany._id} name=${name}`);
    return savedCompany;
  } catch (error) {
    if (error.message === "CompanyAlreadyExists") {
      throw error; // Relaunch the error
    }
    logger.error(`❌ [Service] Error creating company with name: ${name} - Error: ${error.message}`);
    throw new Error(`Error creating company: ${error.message}`);
  }
};

const getAllCompanies = async () => {
  try {
    logger.info(`📌 [Service] Fetching all companies`);
    const companies = await Company.find();
    logger.info(`✅ [Service] Companies fetched successfully. count=${companies.length}`);
    return companies;
  } catch (error) {
    logger.error(`❌ [Service] Error fetching companies - Error ${error.message}`);
    throw new Error(`Error fetching companies: ${error.message}`);
  }
};

const getCompanyById = async (id) => {
  try {
    logger.info(`📌 [Service] Fetching company by ID: ${id}`);
    const company = await Company.findById(id);
    if (!company) {
      logger.warn(`⚠️ [Service] Company not found with ID: ${id}`);
      return company
    }
    logger.info(`✅ [Service] Company fetched successfully with ID: ${id}`);
    return company;
  } catch (error) {
    logger.error(`❌ [Service] Error fetching company by ID: ${id} - Error: ${error.message}`);
    throw new Error(`Error fetching company by id: ${error.message}`);
  }
};

const updateCompany = async (id, name) => {
  try {
    logger.info(`📌 [Service] Updating company with ID: ${id} to new name: ${name}`);
    const company = await Company.findById(id);
    if (!company) {
      logger.warn(`⚠️ [Service] Company not found with ID: ${id}`);
      return company
    }
    company.name = name;
    const updatedCompany = await company.save();
    logger.info(`✅ [Service] Company updated successfully with ID: ${id} and Name: ${name}`);
    return updatedCompany;
  } catch (error) {
    logger.error(`❌ [Service] Error updating company with ID: ${id}, Name: ${name} - Error: ${error.message} `);
    throw new Error(`Error updating company: ${error.message} `);
  }
};

const deleteCompany = async (id) => {
  try {
    logger.info(`📌[Service] Deleting company with ID: ${id} `);
    const company = await Company.findByIdAndDelete(id);
    if (!company) {
      logger.warn(`⚠️[Service] Company not found with ID: ${id}`);
      return company
    }
    logger.info(`✅[Service] Company deleted successfully with ID: ${id}`);
    return company;
  } catch (error) {
    logger.error(`❌[Service] Error deleting company with ID: ${id} - Error: ${error.message}`);
    throw new Error(`Error deleting company: ${error.message} `);
  }
};

module.exports = {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
};
