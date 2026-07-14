jest.mock('../../models/Company', () => {
  const MockCompany = jest.fn().mockImplementation(function (data) {
    Object.assign(this, data);
    this.save = jest.fn().mockResolvedValue(this);
  });
  MockCompany.find = jest.fn();
  MockCompany.findOne = jest.fn();
  MockCompany.findById = jest.fn();
  MockCompany.findByIdAndDelete = jest.fn();
  return MockCompany;
});

const Company = require('../../models/Company');
const {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
} = require('../../services/companyService');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('createCompany', () => {
  test('creates and returns a new company when the name is not taken', async () => {
    Company.findOne.mockResolvedValue(null);

    const result = await createCompany('TechCorp');

    expect(Company.findOne).toHaveBeenCalledWith({ name: 'TechCorp' });
    expect(result.name).toBe('TechCorp');
    expect(result.save).toHaveBeenCalled();
  });

  test('throws CompanyAlreadyExists when the name is already taken', async () => {
    Company.findOne.mockResolvedValue({ _id: '1', name: 'TechCorp' });

    await expect(createCompany('TechCorp')).rejects.toThrow('CompanyAlreadyExists');
  });

  test('wraps unexpected errors with a descriptive message', async () => {
    Company.findOne.mockRejectedValue(new Error('connection lost'));

    await expect(createCompany('TechCorp')).rejects.toThrow('Error creating company: connection lost');
  });
});

describe('getAllCompanies', () => {
  test('returns all companies', async () => {
    Company.find.mockResolvedValue([{ name: 'A' }, { name: 'B' }]);

    const result = await getAllCompanies();

    expect(result).toHaveLength(2);
  });

  test('wraps unexpected errors with a descriptive message', async () => {
    Company.find.mockRejectedValue(new Error('db down'));

    await expect(getAllCompanies()).rejects.toThrow('Error fetching companies: db down');
  });
});

describe('getCompanyById', () => {
  test('returns the company when found', async () => {
    Company.findById.mockResolvedValue({ _id: '1', name: 'TechCorp' });

    const result = await getCompanyById('1');

    expect(result.name).toBe('TechCorp');
  });

  test('returns null when not found', async () => {
    Company.findById.mockResolvedValue(null);

    const result = await getCompanyById('missing-id');

    expect(result).toBeNull();
  });
});

describe('updateCompany', () => {
  test('updates the name and saves the company', async () => {
    const existingCompany = { name: 'OldName', save: jest.fn().mockResolvedValue({ name: 'NewName' }) };
    Company.findById.mockResolvedValue(existingCompany);

    const result = await updateCompany('1', 'NewName');

    expect(existingCompany.name).toBe('NewName');
    expect(existingCompany.save).toHaveBeenCalled();
    expect(result.name).toBe('NewName');
  });

  test('returns null when the company does not exist', async () => {
    Company.findById.mockResolvedValue(null);

    const result = await updateCompany('missing-id', 'NewName');

    expect(result).toBeNull();
  });
});

describe('deleteCompany', () => {
  test('deletes and returns the company', async () => {
    Company.findByIdAndDelete.mockResolvedValue({ _id: '1', name: 'TechCorp' });

    const result = await deleteCompany('1');

    expect(Company.findByIdAndDelete).toHaveBeenCalledWith('1');
    expect(result.name).toBe('TechCorp');
  });

  test('returns null when the company does not exist', async () => {
    Company.findByIdAndDelete.mockResolvedValue(null);

    const result = await deleteCompany('missing-id');

    expect(result).toBeNull();
  });
});
