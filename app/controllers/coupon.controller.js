import { CouponDataMapper } from '../datamappers/index.datamapper.js';

export default class CouponController {
  static mainDatamapper = CouponDataMapper;

  static async getCouponByBrandCountry(req, res) {
    const { brand, country, nbcoupons } = req.params;
    const coupons = await CouponDataMapper.getCouponByBrandCountry(
      brand,
      country,
      nbcoupons
    );

    return res.json(coupons);
  }

  static async getFreeshippingByBrandCountry(req, res) {
    const { brand, country, nbcoupons } = req.params;
    const freeshipping = await CouponDataMapper.getFreeshippingByBrandCountry(
      brand,
      country,
      nbcoupons
    );

    return res.json(freeshipping);
  }
}
