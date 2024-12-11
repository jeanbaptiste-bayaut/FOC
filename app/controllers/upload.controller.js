import { UploadDatamapper } from '../datamappers/index.datamapper.js';

export default class UploadController {
  static mainDatamapper = UploadDatamapper;

  static async uploadCoupons(req, res) {
    try {
      if (!req.file) {
        throw new Error('No file uploaded.');
      }

      const filePath = req.file.path;

      if (req.file.originalname.includes('freeshipping')) {
        const result = await UploadDatamapper.uploadFreeshipping(filePath);

        return res.status(200).json(result);
      }

      const result = await UploadDatamapper.uploadCoupons(filePath);

      res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}
