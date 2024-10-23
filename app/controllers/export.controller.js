import CoreController from './core.controller';

export default class ExportController extends CoreController {
  static async exportCoupons(req, res) {
    const { startDate, endDate } = req.params;
    try {
      const data = await this.mainDatamapper.exportCoupons(startDate, endDate);

      return res.json(data);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}
