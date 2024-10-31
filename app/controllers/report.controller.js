import CoreController from './core.controller.js';
import { ReportDataMapper } from '../datamappers/index.datamapper.js';

export default class ReportController extends CoreController {
  static mainDatamapper = ReportDataMapper;

  static async getNbCouponsByAmountByBrand(req, res) {
    try {
      const report = await ReportDataMapper.getNbCouponsByAmountByBrand();

      return res.json(report);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async getAmountByBrand(req, res) {
    try {
      const report = await ReportDataMapper.getAmountByBrand();

      return res.json(report);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async getAmountAndNbOfCouopnByTimePeriod(req, res) {
    const { startDate, endDate } = req.params;

    try {
      const report = await ReportDataMapper.getAmountAndNbOfCouopnByTimePeriod(
        startDate,
        endDate
      );

      return res.json(report);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}
