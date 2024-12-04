import { jest } from '@jest/globals';

export const mockRequest = (overrides = {}) => {
  return {
    params: overrides.params || {},
    query: overrides.query || {},
    body: overrides.body || {},
    ...overrides,
  };
};

export const mockResponse = () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
    end: jest.fn().mockReturnThis(),
    cookie: jest.fn().mockReturnThis(),
  };
  return res;
};
