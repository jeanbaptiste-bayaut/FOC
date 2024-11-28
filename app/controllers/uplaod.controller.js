import { UploadDatamapper } from '../datamappers/index.datamapper.js';
// import fs from 'fs';
// import csv from 'csv-parser';

export default class UploadController {
  static mainDatamapper = UploadDatamapper;

  static async uploadCoupons(req, res) {
    try {
      if (!req.file) {
        throw new Error('No file uploaded.');
      }

      const filePath = req.file.path;

      const result = await UploadDatamapper.uploadCoupons(filePath);

      res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}
