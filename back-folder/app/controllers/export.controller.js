import CoreController from './core.controller.js';
import { ExportDataMapper } from '../datamappers/index.datamapper.js';

export default class ExportController extends CoreController {
  static mainDatamapper = ExportDataMapper;

  static async exportCoupons(req, res) {
    const { startDate, endDate } = req.body;

    if (!startDate || !endDate) {
      throw new Error('Missing input data');
    }

    try {
      const data = await this.mainDatamapper.getCouponsByTimePeriod(
        startDate,
        endDate
      );

      return res.json(data);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}
