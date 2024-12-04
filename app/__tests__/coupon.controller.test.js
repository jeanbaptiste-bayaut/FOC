import CouponController from '../controllers/coupon.controller';
import { CouponDataMapper } from '../datamappers/index.datamapper';

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
class testController extends CouponController {
  static entityName = 'Coupon';
  static mainDatamapper = CouponDataMapper;
}

describe('CouponController', () => {
  describe('getCouponByBrandCountry', () => {
    beforeEach(() => {
      testController.mainDatamapper.getCouponByBrandCountry = jest.fn();
      jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    it('should return an array of coupon when data is found', async () => {
      const req = mockRequest({
        user: { userId: 1 },
        body: {
          brand: 'quiksilver',
          country: 'france',
          nbcoupons: 5,
          amount: 400,
          wetsuit: 'false',
          facturationCode: 'factu1',
        },
      });
      const res = mockResponse();

      const mockData = [
        {
          coupon_id: 1,
          country_name: 'france',
          brand_name: 'quiksilver',
          coupon_code: 'coupon',
          coupon_amount: 400,
          coupon_status: 0,
          coupon_wetsuit: 'false',
          country_currency: 'eur',
        },
      ];

      testController.mainDatamapper.getCouponByBrandCountry.mockResolvedValue(
        mockData
      );

      await testController.getCouponByBrandCountry(req, res);

      expect(res.json).toHaveBeenCalledWith(mockData);
    });

    it('should throw an error if no input is provided', async () => {
      const req = mockRequest({
        user: { userId: 1 },
        body: {
          brand: null,
          country: null,
          nbcoupons: 5,
          amount: 400,
          wetsuit: 'false',
          facturationCode: 'factu1',
        },
      });
      const res = mockResponse();

      await expect(
        testController.getCouponByBrandCountry(req, res)
      ).rejects.toThrow('Input data is missing');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });
  });

  describe('getFreeshippingByBrandCountry', () => {
    beforeEach(() => {
      testController.mainDatamapper.getFreeshippingByBrandCountry = jest.fn();
      jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    it('should return an array of coupon when data is found', async () => {
      const req = mockRequest({
        body: {
          brand: 'quiksilver',
          country: 'france',
          nbcoupons: 5,
        },
      });
      const res = mockResponse();

      const mockData = [
        {
          brand: 'quiksilver',
          country: 'france',
          coupon: 'coupon',
        },
      ];

      testController.mainDatamapper.getFreeshippingByBrandCountry.mockResolvedValue(
        mockData
      );

      await testController.getFreeshippingByBrandCountry(req, res);

      expect(res.json).toHaveBeenCalledWith(mockData);
    });

    it('should throw an error if no input is provided', async () => {
      const req = mockRequest({
        body: {
          brand: 'quiksilver',
          country: null,
          nbcoupons: 5,
        },
      });
      const res = mockResponse();

      await expect(
        testController.getFreeshippingByBrandCountry(req, res)
      ).rejects.toThrow('Input data is missing');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });
  });
});
