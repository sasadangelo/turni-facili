const request = require('supertest');
const app = require('../../app');
const db = require('./setupTestDb');

beforeAll(async () => await db.connect());
afterEach(async () => await db.clearDatabase());
afterAll(async () => await db.closeDatabase());

const createCompany = async (name = 'TechCorp') => {
  const res = await request(app).post('/companies').send({ name });
  return res.body.company._id;
};

describe('Employees API', () => {
  test('creates an employee linked to a company', async () => {
    const companyId = await createCompany();

    const res = await request(app).post('/employees').send({
      name: 'Mario Rossi',
      role: 'Manager',
      workingHours: '40',
      company: companyId,
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.employee._id).toBeDefined();
    expect(res.body.employee.name).toBe('Mario Rossi');
  });

  test('rejects employee creation for a non-existent company', async () => {
    const res = await request(app).post('/employees').send({
      name: 'Mario Rossi',
      role: 'Manager',
      workingHours: '40',
      company: '64b8f9c8f9c8f9c8f9c8f9c8',
    });

    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/Company not found/);
  });

  test('requires companyId query parameter when listing employees', async () => {
    const res = await request(app).get('/employees');

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('lists employees for a company', async () => {
    const companyId = await createCompany();
    await request(app).post('/employees').send({
      name: 'Mario Rossi',
      role: 'Manager',
      workingHours: '40',
      company: companyId,
    });

    const res = await request(app).get(`/employees?companyId=${companyId}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });

  test('retrieves an employee by id', async () => {
    const companyId = await createCompany();
    const created = await request(app).post('/employees').send({
      name: 'Mario Rossi',
      role: 'Manager',
      workingHours: '40',
      company: companyId,
    });
    const employeeId = created.body.employee._id;

    const res = await request(app).get(`/employees/${employeeId}`);

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Mario Rossi');
  });

  test('updates an employee', async () => {
    const companyId = await createCompany();
    const created = await request(app).post('/employees').send({
      name: 'Mario Rossi',
      role: 'Manager',
      workingHours: '40',
      company: companyId,
    });
    const employeeId = created.body.employee._id;

    const res = await request(app).put(`/employees/${employeeId}`).send({
      name: 'Mario Rossi',
      role: 'Senior Manager',
      workingHours: '35',
      company: companyId,
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.employee.role).toBe('Senior Manager');
  });

  test('deletes an employee', async () => {
    const companyId = await createCompany();
    const created = await request(app).post('/employees').send({
      name: 'Mario Rossi',
      role: 'Manager',
      workingHours: '40',
      company: companyId,
    });
    const employeeId = created.body.employee._id;

    const deleteRes = await request(app).delete(`/employees/${employeeId}`);
    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body.success).toBe(true);

    const listRes = await request(app).get(`/employees?companyId=${companyId}`);
    expect(listRes.body).toHaveLength(0);
  });
});
