import { CouponDataMapper } from '../datamappers/index.datamapper.js';

export default class CouponController {
  static mainDatamapper = CouponDataMapper;

  static async getCouponInformations(req, res) {
    try {
      const list = await CouponDataMapper.getCouponInformations();

      return res.json(list);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async getCouponByBrandCountry(req, res) {
    const { brand, country, amount, nbcoupons, wetsuit, facturationCode } =
      req.body;
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
    const { brand, country, nbcoupons } = req.body;

    if (!brand || !country || !nbcoupons) {
      throw new Error('Input data is missing');
    }
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
