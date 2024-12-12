import CoreController from '../controllers/core.controller';
import { mockRequest, mockResponse } from '../utils/testUtils';
import {
  describe,
  it,
  expect,
  beforeEach,
  jest,
  afterEach,
} from '@jest/globals';
import mainDatamapper from '../datamappers/index.datamapper';

jest.mock('../datamappers/index.datamapper', () => ({
  findAll: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
}));

// Configuration de CoreController pour les tests
class TestController extends CoreController {
  static entityName = 'TestEntity';
  static mainDatamapper = mainDatamapper;
}

describe('CoreController', () => {
  describe('getAll', () => {
    beforeEach(() => {
      // Configuration avant chaque test
      mainDatamapper.findAll.mockReset();
      jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    it('should return all rows when data is found', async () => {
      const req = mockRequest();
      const res = mockResponse();

      // Simuler une réponse pour `findAll`
      const mockData = [{ id: 1, name: 'Item 1' }];
      mainDatamapper.findAll.mockResolvedValue(mockData);

      await TestController.getAll(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockData);
    });

    it('should throw an error if no data is found', async () => {
      const req = mockRequest();
      const res = mockResponse();

      mainDatamapper.findAll.mockResolvedValue([]);

      await expect(TestController.getAll(req, res)).rejects.toThrow(
        'No data found for TestEntity'
      );
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });
  });

  describe('getOne', () => {
    beforeEach(() => {
      // Réinitialiser le mock avant chaque test
      mainDatamapper.findByPk.mockReset();
      jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    it('should return a row when data is found', async () => {
      const req = mockRequest({ params: { id: 1 } }); // Assurez-vous que l'ID est inclus ici
      const res = mockResponse();

      // Simuler une réponse pour `findByPk`
      const mockData = { id: 1, name: 'Item 1' };
      mainDatamapper.findByPk.mockResolvedValue(mockData);

      await TestController.getOne(req, res);

      expect(res.json).toHaveBeenCalledWith(mockData);
    });

    it('should throw an error if no data is found', async () => {
      const req = mockRequest({ params: { id: 1 } }); // Assurez-vous que l'ID est inclus ici
      const res = mockResponse();

      mainDatamapper.findByPk.mockResolvedValue(null);

      await expect(TestController.getOne(req, res)).rejects.toThrow(
        'TestEntity with id 1 not found'
      );
    });

    it('should handle unexpected errors gracefully', async () => {
      const req = mockRequest({ params: { id: 1 } }); // Assurez-vous que l'ID est inclus ici
      const res = mockResponse();

      mainDatamapper.findByPk.mockRejectedValue(new Error('Database error'));

      await expect(TestController.getOne(req, res)).rejects.toThrow(
        'Failed to recover one TestEntity'
      );
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });
  });

  describe('create', () => {
    beforeEach(() => {
      // Réinitialiser le mock avant chaque test
      mainDatamapper.create.mockReset();
      jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    it('should create a new row when input is provided', async () => {
      const req = mockRequest({ body: { id: 1, name: 'Item 1' } });
      const res = mockResponse();

      // Simuler une réponse pour `create`
      const mockData = { id: 1, name: 'Item 1' };
      mainDatamapper.create.mockResolvedValue(mockData);

      await TestController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockData);
    });

    it('should throw an error if no input is provided', async () => {
      const req = mockRequest({ body: null });
      const res = mockResponse();

      await expect(TestController.create(req, res)).rejects.toThrow(
        'Input data is missing'
      );
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });
  });

  describe('update', () => {
    beforeEach(() => {
      // Réinitialiser le mock avant chaque test
      mainDatamapper.create.mockReset();
      jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    it('should update a row when input is provided', async () => {
      const req = mockRequest({ params: { id: 1 }, body: { name: 'Item 1' } });
      const res = mockResponse();

      // Simuler une réponse pour `update`
      const mockData = { id: 1, name: 'Item 1' };
      mainDatamapper.update.mockResolvedValue(mockData);

      await TestController.update(req, res);

      expect(res.json).toHaveBeenCalledWith(mockData);
    });

    it('should throw an error if no input is provided', async () => {
      const req = mockRequest({ params: { id: 1 }, body: null });
      const res = mockResponse();

      await expect(TestController.update(req, res)).rejects.toThrow(
        'Input data is missing'
      );
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });
  });
});
