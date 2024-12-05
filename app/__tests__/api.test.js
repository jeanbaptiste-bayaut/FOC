import request from 'supertest';
import app from '../index.app.js';
import { describe, it, expect } from '@jest/globals';

describe('API Tests (ES6)', () => {
  it("GET /api/hello should return 'Hello, ES6 World!'", async () => {
    const response = await request(app).get('/api/hello');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Hello, ES6 World!' });
  });
});
