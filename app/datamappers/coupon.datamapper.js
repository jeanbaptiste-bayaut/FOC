import CoreDataMapper from './core.datamapper.js';

export default class CouponDataMapper extends CoreDataMapper {
  static tableName = 'coupon';

  static async getCouponByBrandCountry(
    brand,
    country,
    nbcoupons,
    amount,
    userId
  ) {
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
          AND "coupon"."amount" =$3
      LIMIT $4;
      `,
      [brand, country, amount, nbcoupons]
    );

    if (!result.rows.length) {
      throw new Error('No coupon available');
    }

    const couponIds = result.rows.map((coupon) =>
      parseInt(coupon.coupon_id, 10)
    );

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
    } else {
      throw new Error('Coupon not redeemed');
    }

    const userUpdate = await this.client.query(
      `
          UPDATE "user"
          SET "coupon_id" = $1
          WHERE "id" = $2
          RETURNING *
          `,
      [couponIds, userId]
    );

    if (userUpdate) {
      console.log('User updated');
    } else {
      throw new Error('User not updated');
    }

    return result.rows;
  }

  static async getFreeshippingByBrandCountry(brand, country, nbcoupons) {
    const result = await this.client.query(
      `
      SELECT 
          "country"."name" AS "country_name", 
          "brand"."name" AS "brand_name", 
          "freeshipping"."code" AS "freeshipping_code",
          "freeshipping"."id" AS "freeshipping_id"
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

    if (!result.rows.length) {
      throw new Error('No freeshipping available');
    }

    const couponIds = result.rows.map((coupon) => coupon.freeshipping_id);
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
