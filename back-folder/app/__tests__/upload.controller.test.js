import UploadController from '../controllers/upload.controller';
import { UploadDatamapper } from '../datamappers/index.datamapper';

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
class testController extends UploadController {
  static entityName = 'Upload';
  static mainDatamapper = UploadDatamapper;
}

describe('UploadController', () => {
  describe('uploadCoupons', () => {
    beforeEach(() => {
      testController.mainDatamapper.uploadCoupons = jest.fn();
      jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    it('should return an array', async () => {
      const mockResult = {
        success: true,
        message: 'Coupons uploaded successfully.',
      };

      UploadDatamapper.uploadCoupons.mockResolvedValue(mockResult);

      const req = mockRequest({
        file: { path: '../../uploads/csvFile.csv' },
      });

      const res = mockResponse();

      await UploadController.uploadCoupons(req, res);

      expect(UploadDatamapper.uploadCoupons).toHaveBeenCalledWith(
        '../../uploads/csvFile.csv'
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it('should throw an error when no file is uploaded', async () => {
      const req = mockRequest({
        file: null,
      });

      const res = mockResponse();

      await testController.uploadCoupons(req, res);

      expect(UploadDatamapper.uploadCoupons).not.toHaveBeenCalledWith();

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'No file uploaded.' });
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
