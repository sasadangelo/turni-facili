const request = require('supertest');
const app = require('../../app');
const db = require('./setupTestDb');

beforeAll(async () => await db.connect());
afterEach(async () => await db.clearDatabase());
afterAll(async () => await db.closeDatabase());

describe('Companies API', () => {
  test('creates a company', async () => {
    const res = await request(app).post('/companies').send({ name: 'TechCorp' });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.company._id).toBeDefined();
    expect(res.body.company.name).toBe('TechCorp');
  });

  test('prevents duplicate company names', async () => {
    await request(app).post('/companies').send({ name: 'TechCorp' });

    const res = await request(app).post('/companies').send({ name: 'TechCorp' });

    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('CompanyAlreadyExists');
  });

  test('retrieves a company by id', async () => {
    const created = await request(app).post('/companies').send({ name: 'TechCorp' });
    const companyId = created.body.company._id;

    const res = await request(app).get(`/companies/${companyId}`);

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('TechCorp');
  });

  test('lists all companies', async () => {
    await request(app).post('/companies').send({ name: 'TechCorp' });

    const res = await request(app).get('/companies');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });

  test('updates a company', async () => {
    const created = await request(app).post('/companies').send({ name: 'TechCorp' });
    const companyId = created.body.company._id;

    const res = await request(app).put(`/companies/${companyId}`).send({ name: 'NewTechCorp' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.company.name).toBe('NewTechCorp');
  });

  test('deletes a company', async () => {
    const created = await request(app).post('/companies').send({ name: 'TechCorp' });
    const companyId = created.body.company._id;

    const deleteRes = await request(app).delete(`/companies/${companyId}`);
    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body.success).toBe(true);

    const listRes = await request(app).get('/companies');
    expect(listRes.body).toHaveLength(0);
  });
});
