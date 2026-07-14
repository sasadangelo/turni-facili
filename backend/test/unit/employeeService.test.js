jest.mock('../../models/Employee', () => {
  const MockEmployee = jest.fn().mockImplementation(function (data) {
    Object.assign(this, data);
    this.save = jest.fn().mockResolvedValue(this);
  });
  MockEmployee.find = jest.fn();
  MockEmployee.findById = jest.fn();
  MockEmployee.findByIdAndDelete = jest.fn();
  return MockEmployee;
});

jest.mock('../../models/Company', () => ({
  findById: jest.fn(),
}));

const Employee = require('../../models/Employee');
const Company = require('../../models/Company');
const {
  createEmployee,
  getEmployeesByCompanyId,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} = require('../../services/employeeService');

const withPopulate = (value) => ({ populate: jest.fn().mockResolvedValue(value) });

beforeEach(() => {
  jest.clearAllMocks();
});

describe('createEmployee', () => {
  test('creates and returns a new employee when the company exists', async () => {
    Company.findById.mockResolvedValue({ _id: 'c1', name: 'Pharmacy A' });

    const result = await createEmployee('Mario Rossi', 'Pharmacist', 'morning', 'c1');

    expect(Company.findById).toHaveBeenCalledWith('c1');
    expect(result.name).toBe('Mario Rossi');
    expect(result.company).toBe('c1');
    expect(result.save).toHaveBeenCalled();
  });

  test('throws when the company does not exist', async () => {
    Company.findById.mockResolvedValue(null);

    await expect(
      createEmployee('Mario Rossi', 'Pharmacist', 'morning', 'missing-id')
    ).rejects.toThrow('Company not found');
  });

  test('throws EmployeeAlreadyExists on duplicate key error', async () => {
    Company.findById.mockResolvedValue({ _id: 'c1' });
    Employee.mockImplementationOnce(function (data) {
      Object.assign(this, data);
      this.save = jest.fn().mockRejectedValue({ code: 11000 });
    });

    await expect(
      createEmployee('Mario Rossi', 'Pharmacist', 'morning', 'c1')
    ).rejects.toThrow('EmployeeAlreadyExists');
  });
});

describe('getEmployeesByCompanyId', () => {
  test('returns employees for an existing company', async () => {
    Company.findById.mockResolvedValue({ _id: 'c1' });
    Employee.find.mockReturnValue(withPopulate([{ name: 'Mario' }, { name: 'Luigi' }]));

    const result = await getEmployeesByCompanyId('c1');

    expect(Employee.find).toHaveBeenCalledWith({ company: 'c1' });
    expect(result).toHaveLength(2);
  });

  test('throws when the company does not exist', async () => {
    Company.findById.mockResolvedValue(null);

    await expect(getEmployeesByCompanyId('missing-id')).rejects.toThrow('Company not found');
  });
});

describe('getEmployeeById', () => {
  test('returns the employee when found', async () => {
    Employee.findById.mockReturnValue(withPopulate({ _id: 'e1', name: 'Mario' }));

    const result = await getEmployeeById('e1');

    expect(result.name).toBe('Mario');
  });

  test('returns null when not found', async () => {
    Employee.findById.mockReturnValue(withPopulate(null));

    const result = await getEmployeeById('missing-id');

    expect(result).toBeNull();
  });
});

describe('updateEmployee', () => {
  test('updates fields and saves the employee', async () => {
    const existingEmployee = {
      name: 'Old Name',
      role: 'Old Role',
      workingHours: 'morning',
      company: 'c1',
      save: jest.fn().mockResolvedValue(true),
    };
    existingEmployee.save.mockImplementation(async () => existingEmployee);
    Employee.findById.mockResolvedValue(existingEmployee);

    const result = await updateEmployee('e1', 'New Name', 'New Role', 'afternoon', undefined);

    expect(existingEmployee.name).toBe('New Name');
    expect(existingEmployee.role).toBe('New Role');
    expect(existingEmployee.workingHours).toBe('afternoon');
    expect(existingEmployee.save).toHaveBeenCalled();
    expect(result.name).toBe('New Name');
  });

  test('returns null when the employee does not exist', async () => {
    Employee.findById.mockResolvedValue(null);

    const result = await updateEmployee('missing-id', 'New Name', 'New Role', 'afternoon', undefined);

    expect(result).toBeNull();
  });

  test('returns null when reassigned company does not exist', async () => {
    Employee.findById.mockResolvedValue({ name: 'Old Name', save: jest.fn() });
    Company.findById.mockResolvedValue(null);

    const result = await updateEmployee('e1', 'New Name', 'New Role', 'afternoon', 'missing-company');

    expect(result).toBeNull();
  });
});

describe('deleteEmployee', () => {
  test('deletes and returns the employee', async () => {
    Employee.findByIdAndDelete.mockResolvedValue({ _id: 'e1', name: 'Mario' });

    const result = await deleteEmployee('e1');

    expect(Employee.findByIdAndDelete).toHaveBeenCalledWith('e1');
    expect(result.name).toBe('Mario');
  });

  test('returns null when the employee does not exist', async () => {
    Employee.findByIdAndDelete.mockResolvedValue(null);

    const result = await deleteEmployee('missing-id');

    expect(result).toBeNull();
  });
});
