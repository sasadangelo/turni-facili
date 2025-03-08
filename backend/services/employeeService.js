const Employee = require('../models/Employee');
const Company = require('../models/Company');

// Crea un nuovo dipendente
const createEmployee = async (name, role, workingHours, companyId) => {
  // Verifica se l'azienda esiste
  const companyExists = await Company.findById(companyId);
  if (!companyExists) {
    throw new Error('Company not found');
  }

  const newEmployee = new Employee({
    name,
    role,
    workingHours,
    company: companyId
  });

  // Salva il dipendente nel database
  return await newEmployee.save();
};

// Ottieni tutti i dipendenti
const getAllEmployees = async () => {
  return await Employee.find().populate('company');
};

// Ottieni un dipendente tramite ID
const getEmployeeById = async (id) => {
  return await Employee.findById(id).populate('company');
};

// Aggiorna un dipendente tramite ID
const updateEmployee = async (id, name, role, workingHours, companyId) => {
  // Verifica se l'azienda esiste
  if (companyId) {
    const companyExists = await Company.findById(companyId);
    if (!companyExists) {
      throw new Error('Company not found');
    }
  }

  return await Employee.findByIdAndUpdate(
    id,
    { name, role, workingHours, company: companyId },
    { new: true }  // Restituisce il documento aggiornato
  );
};

// Elimina un dipendente tramite ID
const deleteEmployee = async (id) => {
  return await Employee.findByIdAndDelete(id);
};

module.exports = {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee
};
