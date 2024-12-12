import CoreDataMapper from './core.datamapper.js';

export default class CouponDataMapper extends CoreDataMapper {
  static tableName = 'coupon';

  static async getCouponInformations() {
    try {
      const result = await this.client.query(
        `
      SELECT 
          "country"."name" AS "country_name",
          "brand"."name" AS "brand_name", 
          "coupon"."amount" AS "coupon_amount", 
          "coupon"."status" AS "coupon_status",
          "coupon"."wetsuit" AS "coupon_wetsuit",
          "country"."currency" AS "country_currency",
          COUNT("coupon"."code") AS "nb_coupon"
      FROM 
          "coupon"
      JOIN 
          "country" ON "coupon"."country_id" = "country"."id"
      JOIN 
          "brand" ON "country"."brand_id" = "brand"."id"
      WHERE 
          "coupon"."status" = 0
          GROUP BY "country_name", "brand"."name", "coupon"."amount", "coupon"."status", "coupon"."wetsuit", "country"."currency";
      `
      );

      return result.rows;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // get coupons by brand, country, amount, wetsuit, facturationCode
  static async getCouponByBrandCountry(
    brand,
    country,
    nbcoupons,
    amount,
    wetsuit,
    facturationCode,
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

      if (result.rows.length === 0) {
        const error = new Error(`No coupon available for amount ${amount}`);
        error.status = 404;
        throw error;
      }

      // get an array of coupon ids for the userUpdate
      const couponIds = result.rows.map((coupon) =>
        parseInt(coupon.coupon_id, 10)
      );

      // get the facturation_code_id from the requester
      const facturationCodeId = await this.client.query(
        `SELECT "id" FROM "facturation_code" WHERE "code" = $1`,
        [facturationCode]
      );

      if (!facturationCodeId.rows.length) {
        throw new Error('Facturation code not found');
      }

      // update the coupon list with the userId and facturation_code_id and set the status to 1 (used)
      const userUpdate = await this.client.query(
        `
          UPDATE "coupon"
          SET "user_id" = $1,
          "facturation_code_id" = $2,
          "status" = 1,
          "updated_at" = current_timestamp
          WHERE "id" = ANY ($3::int[])
          RETURNING *
          `,
        [userId, facturationCodeId.rows[0].id, couponIds]
      );

      if (userUpdate) {
        console.log('User updated');
      } else {
        throw new Error('User not updated');
      }

      return result.rows;
    } catch (error) {
      if (error.status === 404) {
        throw error;
      }

      throw new Error(error.message);
    }
  }

  static async getFreeshippingByBrandCountry(brand, country, nbcoupons) {
    try {
      // get the freeshipping coupon by brand, country and nbcoupons
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

      if (result.rows.length === 0) {
        const error = new Error(`No freeshipping available`);
        error.status = 404;
        throw error;
      }

      // get an array of coupon ids for the userUpdate
      const couponIds = result.rows.map((coupon) => coupon.freeshipping_id);

      // get a string from the array of coupon ids
      const couponIdsString = couponIds.join(', ');

      // update the coupons and set the status to 1 (used)
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
      } else {
        throw new Error('Freeshipping not redeemed');
      }

      return result.rows;
    } catch (error) {
      if (error.status === 404) {
        throw error;
      }
      throw new Error(error.message);
    }
  }
}
