import ExportController from '../controllers/export.controller';
import { ExportDataMapper } from '../datamappers/index.datamapper';

import { mockRequest, mockResponse } from '../utils/testUtils';
import {
  describe,
  it,
  expect,
  beforeEach,
  jest,
  afterEach,
} from '@jest/globals';

// Configuration de CouponController pour les tests
class testController extends ExportController {
  static entityName = 'Export';
  static mainDatamapper = ExportDataMapper;
}

describe('ExportController', () => {
  describe('exportCoupons', () => {
    beforeEach(() => {
      testController.mainDatamapper.getCouponsByTimePeriod = jest.fn();
      jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    it('should return an array of coupon with additionnal data', async () => {
      const req = mockRequest({
        body: { startDate: '2024-11-01', endDate: '2024-11-30' },
      });
      const res = mockResponse();

      const mockData = [
        {
          coupon: 'coupon',
          brand: 'france',
          country: 'france',
          facturation_code: 'factu1',
          currency: 'eur',
          email: 'email@email.com',
          service: 'service',
          date: '2024-11-01',
        },
      ];

      testController.mainDatamapper.getCouponsByTimePeriod.mockResolvedValue(
        mockData
      );

      await testController.exportCoupons(req, res);

      expect(res.json).toHaveBeenCalledWith(mockData);
    });

    it('should throw an error if no input is provided', async () => {
      const req = mockRequest({
        body: { startDate: null, endDate: '2024-11-30' },
      });
      const res = mockResponse();

      testController.mainDatamapper.getCouponsByTimePeriod.mockResolvedValue(
        null
      );

      await expect(testController.exportCoupons(req, res)).rejects.toThrow(
        'Missing input data'
      );
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });
  });
});
