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

const createEmployee = async (companyId) => {
  const res = await request(app).post('/employees').send({
    name: 'Mario Rossi',
    role: 'Manager',
    workingHours: '40',
    company: companyId,
  });
  return res.body.employee._id;
};

const createEventType = async (companyId) => {
  const res = await request(app).post('/eventtypes').send({
    name: 'Lavoro',
    code: 'WORK',
    company: companyId,
  });
  return res.body.eventType._id;
};

describe('Events API', () => {
  test('creates an event', async () => {
    const companyId = await createCompany();
    const employeeId = await createEmployee(companyId);
    const eventTypeId = await createEventType(companyId);

    const res = await request(app).post('/events').send({
      title: 'Team Meeting',
      summary: 'Weekly team sync',
      dtStart: '2026-07-15T09:00:00.000Z',
      dtEnd: '2026-07-15T17:00:00.000Z',
      allDay: false,
      typeFk: eventTypeId,
      companyFk: companyId,
      employeeFk: employeeId,
      status: 'confirmed',
    });

    expect(res.status).toBe(201);
    expect(res.body._id).toBeDefined();
    expect(res.body.title).toBe('Team Meeting');
  });

  test('retrieves an event by id', async () => {
    const companyId = await createCompany();
    const created = await request(app).post('/events').send({
      title: 'Team Meeting',
      dtStart: '2026-07-15T09:00:00.000Z',
      dtEnd: '2026-07-15T17:00:00.000Z',
      companyFk: companyId,
    });

    const res = await request(app).get(`/events/${created.body._id}`);

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Team Meeting');
  });

  test('lists all events', async () => {
    const companyId = await createCompany();
    await request(app).post('/events').send({
      title: 'Team Meeting',
      dtStart: '2026-07-15T09:00:00.000Z',
      dtEnd: '2026-07-15T17:00:00.000Z',
      companyFk: companyId,
    });

    const res = await request(app).get('/events');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });

  test('updates an event', async () => {
    const companyId = await createCompany();
    const created = await request(app).post('/events').send({
      title: 'Team Meeting',
      summary: 'Weekly team sync',
      dtStart: '2026-07-15T09:00:00.000Z',
      dtEnd: '2026-07-15T17:00:00.000Z',
      companyFk: companyId,
      status: 'confirmed',
    });

    const res = await request(app).put(`/events/${created.body._id}`).send({
      title: 'Updated Team Meeting',
      summary: 'Monthly team sync',
      status: 'tentative',
    });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated Team Meeting');
    expect(res.body.summary).toBe('Monthly team sync');
  });

  test('creates a recurring event and preserves recurrence fields', async () => {
    const companyId = await createCompany();
    const employeeId = await createEmployee(companyId);
    const eventTypeId = await createEventType(companyId);

    const created = await request(app).post('/events').send({
      title: 'Daily Standup',
      summary: 'Daily team standup',
      dtStart: '2026-07-16T10:00:00.000Z',
      dtEnd: '2026-07-16T11:00:00.000Z',
      recurring: true,
      frequency: 3,
      interval: 1,
      byweekday: [0, 1, 2, 3, 4],
      untilType: 2,
      untilOccurrences: 10,
      typeFk: eventTypeId,
      companyFk: companyId,
      employeeFk: employeeId,
    });

    expect(created.status).toBe(201);

    const res = await request(app).get(`/events/${created.body._id}`);

    expect(res.body.recurring).toBe(true);
    expect(res.body.frequency).toBe(3);
  });

  test('deletes an event', async () => {
    const companyId = await createCompany();
    const created = await request(app).post('/events').send({
      title: 'Team Meeting',
      dtStart: '2026-07-15T09:00:00.000Z',
      dtEnd: '2026-07-15T17:00:00.000Z',
      companyFk: companyId,
    });

    const deleteRes = await request(app).delete(`/events/${created.body._id}`);
    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body.message).toBe('Evento eliminato');

    const listRes = await request(app).get('/events');
    expect(listRes.body).toHaveLength(0);
  });
});
