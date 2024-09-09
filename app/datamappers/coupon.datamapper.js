import CoreDataMapper from './core.datamapper.js';

export default class CouponDataMapper extends CoreDataMapper {
  static tableName = 'coupon';

  static async getCouponByBrandCountry(brand, country, nbcoupons) {
    const result = await this.client.query(
      `
      SELECT 
          "coupon"."id" AS "coupon_id",
          "country"."name" AS "country_name", 
          "brand"."name" AS "brand_name", 
          "coupon"."code" AS "coupon_code", 
          "coupon"."amount" AS "coupon_amount", 
          "coupon"."status" AS "coupon_status", 
          "country"."currency" AS "country_currency"
      FROM 
          "coupon"
      JOIN 
          "country" ON "coupon"."country_id" = "country"."id"
      JOIN 
          "brand" ON "country"."brand_id" = "brand"."id"
      WHERE 
          "coupon"."status" = 0
          AND "brand"."name" =$1
          AND "country"."name" =$2
      LIMIT $3;
      `,
      [brand, country, nbcoupons]
    );

    const couponIds = result.rows.map((coupon) => coupon.coupon_id);
    const couponIdsString = couponIds.join(', ');

    const redemption = await this.client.query(
      `
      UPDATE "coupon"
      SET "status" = 1
      WHERE "id" IN (${couponIdsString})
      RETURNING *
      `
    );

    if (redemption) {
      console.log('Coupon redeemed');
    }

    return result.rows;
  }

  static async getFreeshippingByBrandCountry(brand, country, nbcoupons) {
    const result = await this.client.query(
      `
      SELECT 
          "country"."name" AS "country_name", 
          "brand"."name" AS "brand_name", 
          "freeshipping"."code" AS "freeshipping_code"
      FROM 
          "freeshipping"
      JOIN 
          "country" ON "freeshipping"."country_id" = "country"."id"
      JOIN 
          "brand" ON "country"."brand_id" = "brand"."id"
      WHERE 
          "freeshipping"."status" = 0
          AND "brand"."name" =$1
          AND "country"."name" =$2
      LIMIT $3;
      `,
      [brand, country, nbcoupons]
    );

    const couponIds = result.rows.map((coupon) => coupon.coupon_id);
    const couponIdsString = couponIds.join(', ');

    const redemption = await this.client.query(
      `
      UPDATE "freeshipping"
      SET "status" = 1
      WHERE "id" IN (${couponIdsString})
      RETURNING *
      `
    );

    if (redemption) {
      console.log('Freeshipping redeemed');
    }

    return result.rows;
  }
}
