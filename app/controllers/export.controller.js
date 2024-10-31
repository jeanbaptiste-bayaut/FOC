import CoreController from './core.controller.js';
import { ExportDataMapper } from '../datamappers/index.datamapper.js';

export default class ExportController extends CoreController {
  static mainDatamapper = ExportDataMapper;

  static async exportCoupons(req, res) {
    const { startDate, endDate } = req.params;

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
