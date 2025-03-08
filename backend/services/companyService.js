// services/companyService.js
const Company = require('../models/Company');

const createCompany = async (name) => {
  try {
    const company = new Company({ name });
    return await company.save();
  } catch (error) {
    throw new Error(`Error creating company: ${error.message}`);
  }
};

const getAllCompanies = async () => {
  try {
    return await Company.find();
  } catch (error) {
    throw new Error(`Error fetching companies: ${error.message}`);
  }
};

const getCompanyById = async (id) => {
  try {
    const company = await Company.findById(id);
    if (!company) {
      throw new Error('Company not found');
    }
    return company;
  } catch (error) {
    throw new Error(`Error fetching company by id: ${error.message}`);
  }
};

const updateCompany = async (id, name) => {
  try {
    const company = await Company.findById(id);
    if (!company) {
      throw new Error('Company not found');
    }

    company.name = name;
    return await company.save();
  } catch (error) {
    throw new Error(`Error updating company: ${error.message}`);
  }
};

const deleteCompany = async (id) => {
  try {
    const company = await Company.findByIdAndDelete(id);
    if (!company) {
      throw new Error('Company not found');
    }
    return company;
  } catch (error) {
    throw new Error(`Error deleting company: ${error.message}`);
  }
};

module.exports = {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
};
