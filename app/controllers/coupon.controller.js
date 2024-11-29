import { CouponDataMapper } from '../datamappers/index.datamapper.js';

export default class CouponController {
  static mainDatamapper = CouponDataMapper;

  static async getCouponByBrandCountry(req, res) {
    const { brand, country, amount, nbcoupons, wetsuit, facturationCode } =
      req.params;
    const userId = req.user.userId;

    try {
      const coupons = await CouponDataMapper.getCouponByBrandCountry(
        brand,
        country,
        nbcoupons,
        amount,
        wetsuit,
        facturationCode,
        userId
      );

      return res.json(coupons);
    } catch (error) {
      if (error.status === 404) {
        return res.status(404).json({ message: error.message });
      }
      return res.status(500).json({ message: error });
    }
  }

  static async getFreeshippingByBrandCountry(req, res) {
    const { brand, country, nbcoupons } = req.params;
    try {
      const freeshipping = await CouponDataMapper.getFreeshippingByBrandCountry(
        brand,
        country,
        nbcoupons
      );

      return res.json(freeshipping);
    } catch (error) {
      if (error.status === 404) {
        return res.status(404).json({ message: error.message });
      }

      return res.status(500).json({ message: error });
    }
  }
}
