import UserController from '../controllers/user.controller';
import { UserDataMapper } from '../datamappers/index.datamapper';
import jwt from 'jsonwebtoken';

import { mockRequest, mockResponse } from '../utils/testUtils';
import {
  describe,
  it,
  expect,
  beforeEach,
  jest,
  afterEach,
} from '@jest/globals';

// Configuration de UserController pour les tests
class testController extends UserController {
  static entityName = 'User';
  static mainDatamapper = UserDataMapper;
}

describe('UserController', () => {
  describe('getUserByID', () => {
    beforeEach(() => {
      testController.mainDatamapper.getUserById = jest.fn();
      jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    it('shoul return a user found by its id', async () => {
      const req = mockRequest({ params: { id: 1 } });
      const res = mockResponse();

      const mockData = {
        id: 1,
        email: 'email@email.com',
      };

      testController.mainDatamapper.getUserById.mockResolvedValue(mockData);

      await testController.getUserByID(req, res);

      expect(res.json).toHaveBeenCalledWith(mockData);
    });

    it('should throw an error if id is missing', async () => {
      const req = mockRequest({ params: { id: null } });
      const res = mockResponse();

      testController.mainDatamapper.getUserById.mockResolvedValue(null);

      await expect(testController.getUserByID(req, res)).rejects.toThrow(
        'Missing id'
      );
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });
  });

  describe('getUserByEmail', () => {
    beforeEach(() => {
      testController.mainDatamapper.findByEmail = jest.fn();
      jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    it('should return a user found by its email', async () => {
      const req = mockRequest({ body: { email: 'email@email.com' } });
      const res = mockResponse();

      const mockData = {
        id: 1,
        email: 'email@email.com',
      };

      testController.mainDatamapper.findByEmail.mockResolvedValue(mockData);

      await testController.getUserByEmail(req, res);

      expect(res.json).toHaveBeenCalledWith(mockData);
    });

    it('should throw an error if id is missing', async () => {
      const req = mockRequest({ body: { email: null } });
      const res = mockResponse();

      testController.mainDatamapper.findByEmail.mockResolvedValue(null);

      await expect(testController.getUserByEmail(req, res)).rejects.toThrow(
        'Missing email'
      );
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });
  });

  describe('login', () => {
    beforeEach(() => {
      testController.mainDatamapper.login = jest.fn();
      jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    it('should check if user exists and return cookie with token and json of user information', async () => {
      const req = mockRequest({
        body: { email: 'email@email.com', password: 'password' },
      });
      const res = mockResponse();

      const mockUserData = {
        user: { id: 1, role: 'role' },
        facturationCodeList: ['factu1', 'factu2'],
      };

      const token = 'mockedToken';
      jest.spyOn(jwt, 'sign').mockReturnValue(token);

      testController.mainDatamapper.login.mockResolvedValue(mockUserData);

      await testController.login(req, res);

      expect(res.cookie).toHaveBeenCalledWith('token', token, {
        httpOnly: true,
      });

      expect(res.json).toHaveBeenCalledWith({
        userId: 1,
        token,
        facturationCodeList: mockUserData.facturationCodeList,
        role: mockUserData.user.role,
        email: req.body.email,
      });
    });

    it('should throw an error if user is not found', async () => {
      const req = mockRequest({
        body: { email: 'email@email.com', password: 'password' },
      });
      const res = mockResponse();

      await testController.login(req, res);

      expect(UserDataMapper.login).not.toHaveBeenCalledWith();

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });
  });

  describe('signin', () => {
    beforeEach(() => {
      testController.mainDatamapper.createUser = jest.fn();
      jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    it('should return a user', async () => {
      const req = mockRequest({
        body: {
          email: 'email@email.com',
          password: 'password',
          service: 'service',
          facturationCodeList: ['factu1, factu2'],
          role: 'role',
        },
      });

      const res = mockResponse();

      const mockData = {
        email: 'email@email.com',
        service: 'service',
        facturationCodeList: ['factu1, factu2'],
        role: 'role',
      };

      testController.mainDatamapper.createUser.mockResolvedValue(mockData);

      await testController.signin(req, res);

      expect(res.json).toHaveBeenCalledWith(mockData);
    });

    it('should throw an error when data input is missing', async () => {
      const req = mockRequest({
        body: {
          email: 'email@email.com',
          password: 'password',
          service: null,
          facturationCodeList: ['factu1, factu2'],
          role: 'role',
        },
      });

      const res = mockResponse();

      testController.mainDatamapper.createUser.mockResolvedValue(null);

      await expect(testController.signin(req, res)).rejects.toThrow(
        'Missing input data'
      );
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });
  });
});
