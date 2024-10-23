import CoreDataMapper from './core.datamapper.js';

export default class CouponDataMapper extends CoreDataMapper {
  static tableName = 'coupon';

  static async getCouponByBrandCountry(
    brand,
    country,
    nbcoupons,
    amount,
    wetsuit,
    userId
  ) {
    try {
      const result = await this.client.query(
        `
      SELECT 
          "coupon"."id" AS "coupon_id",
          "country"."name" AS "country_name",
          "brand"."name" AS "brand_name", 
          "coupon"."code" AS "coupon_code", 
          "coupon"."amount" AS "coupon_amount", 
          "coupon"."status" AS "coupon_status",
          "coupon"."wetsuit" AS "coupon_wetsuit",
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
          AND "coupon"."wetsuit" =$4
      LIMIT $5;
      `,
        [brand, country, amount, wetsuit, nbcoupons]
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

      const updateTime = await this.client.query(
        `
      UPDATE "coupon"
      SET "updated_at" = current_timestamp
      WHERE "id" IN (${couponIdsString})
      RETURNING *
      `
      );

      if (updateTime) {
        console.log('Coupon time updated');
      } else {
        throw new Error('Coupon time not updated');
      }

      const couponIdsArray = couponIds.map((coupon) => parseInt(coupon, 10));

      const userUpdate = await this.client.query(
        `
          UPDATE "coupon"
          SET "user_id" = $1
          WHERE "id" = ANY ($2::int[])
          RETURNING *
          `,
        [userId, couponIdsArray]
      );

      if (userUpdate) {
        console.log('User updated');
      } else {
        throw new Error('User not updated');
      }

      return result.rows;
    } catch (error) {
      console.log(error.message);
      throw new Error(error.message);
    }
  }

  static async getFreeshippingByBrandCountry(brand, country, nbcoupons) {
    try {
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
        throw new Error('No freeshipping coupon available');
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
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }
}
