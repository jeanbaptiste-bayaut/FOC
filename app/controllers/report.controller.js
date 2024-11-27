import CoreController from './core.controller.js';
import { ReportDataMapper } from '../datamappers/index.datamapper.js';

export default class ReportController extends CoreController {
  static mainDatamapper = ReportDataMapper;

  static async getNbCouponsByAmountByBrand(req, res) {
    const { startDate, endDate } = req.params;
    try {
      const report = await ReportDataMapper.getNbCouponsByAmountByBrand(
        startDate,
        endDate
      );

      return res.json(report);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async getAmountByBrand(req, res) {
    const { startDate, endDate } = req.params;
    try {
      const report = await ReportDataMapper.getAmountByBrand(
        startDate,
        endDate
      );

      return res.json(report);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async getAmountAndNbOfCouopnByTimePeriod(req, res) {
    const { startDate, endDate } = req.params;

    const brandsList = [
      'roxy',
      'quiksilver',
      'dcshoes',
      'element',
      'billabong',
      'rvca',
    ];

    try {
      const report = await ReportDataMapper.getAmountAndNbOfCouopnByTimePeriod(
        startDate,
        endDate
      );

      const ReportReduceByTime = report.reduce((acc, row) => {
        if (!acc[row.time]) {
          acc[row.time] = {};
        }

        acc[row.time][row.name] = {
          count: row.count,
          sum: row.sum,
        };

        return acc;
      }, {});

      const reportFormatted = Object.entries(ReportReduceByTime).map(
        ([time, brands]) => {
          return {
            time,
            ...brands,
          };
        }
      );

      const formattedData = reportFormatted.map((entry) => {
        const normalizedEntry = {
          time: entry.time,
        };
        brandsList.forEach((brand) => {
          normalizedEntry[brand] = entry[brand] || { sum: 0, count: 0 }; // Valeur par défaut
        });

        return normalizedEntry;
      });

      return res.json(formattedData);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  }
}
