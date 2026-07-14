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

describe('EventTypes API', () => {
  test('creates an event type linked to a company', async () => {
    const companyId = await createCompany();

    const res = await request(app).post('/eventtypes').send({
      name: 'Lavoro',
      code: 'WORK',
      company: companyId,
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.eventType._id).toBeDefined();
  });

  test('rejects creation for a non-existent company', async () => {
    const res = await request(app).post('/eventtypes').send({
      name: 'Lavoro',
      code: 'WORK',
      company: '64b8f9c8f9c8f9c8f9c8f9c8',
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Company not found');
  });

  test('requires the company query parameter when listing', async () => {
    const res = await request(app).get('/eventtypes');

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('lists event types for a company', async () => {
    const companyId = await createCompany();
    await request(app).post('/eventtypes').send({ name: 'Lavoro', code: 'WORK', company: companyId });

    const res = await request(app).get(`/eventtypes?company=${companyId}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBe(1);
  });

  test('retrieves an event type by id', async () => {
    const companyId = await createCompany();
    const created = await request(app)
      .post('/eventtypes')
      .send({ name: 'Lavoro', code: 'WORK', company: companyId });
    const eventTypeId = created.body.eventType._id;

    const res = await request(app).get(`/eventtypes/${eventTypeId}`);

    expect(res.status).toBe(200);
    expect(res.body.eventType.name).toBe('Lavoro');
  });

  test('updates an event type', async () => {
    const companyId = await createCompany();
    const created = await request(app)
      .post('/eventtypes')
      .send({ name: 'Lavoro', code: 'WORK', company: companyId });
    const eventTypeId = created.body.eventType._id;

    const res = await request(app)
      .put(`/eventtypes/${eventTypeId}`)
      .send({ name: 'Ferie', code: 'VACATION' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.eventType.name).toBe('Ferie');
  });

  test('deletes an event type', async () => {
    const companyId = await createCompany();
    const created = await request(app)
      .post('/eventtypes')
      .send({ name: 'Lavoro', code: 'WORK', company: companyId });
    const eventTypeId = created.body.eventType._id;

    const deleteRes = await request(app).delete(`/eventtypes/${eventTypeId}`);
    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body.success).toBe(true);

    const listRes = await request(app).get(`/eventtypes?company=${companyId}`);
    expect(listRes.body.count).toBe(0);
  });
});
