import CoreDatamapper from './core.datamapper.js';

export default class ReportDataMapper extends CoreDatamapper {
  static tableName = 'coupon';

  static async getNbCouponsByAmountByBrand() {
    const results = await this.client.query(
      `
SELECT "brand"."name", "coupon"."amount", COUNT("coupon"."amount"), SUM("coupon"."amount") FROM "coupon"
JOIN "country" ON "coupon"."country_id" = "country"."id"
JOIN "brand" ON "country"."brand_id" = "brand"."id"
JOIN "user" ON "coupon"."user_id" = "user"."id"
GROUP BY "brand"."name","coupon"."amount"
ORDER BY "coupon"."amount" DESC;
        `
    );

    return results.rows;
  }

  static async getAmountByBrand() {
    const results = await this.client.query(
      `
SELECT "brand"."name", SUM("coupon"."amount"), COUNT("coupon"."code") FROM "coupon"
JOIN "country" ON "coupon"."country_id" = "country"."id"
JOIN "brand" ON "country"."brand_id" = "brand"."id"
JOIN "user" ON "coupon"."user_id" = "user"."id"
GROUP BY "brand"."name";
        `
    );
    return results.rows;
  }

  static async getAmountAndNbOfCouopnByTimePeriod(startDate, endDate) {
    const results = await this.client.query(
      `
SELECT TO_CHAR("coupon"."updated_at", 'YYYY-MM-DD') as "time", "brand"."name", COUNT("coupon"."code"), SUM("coupon"."amount")
FROM "coupon"
JOIN "country" ON "coupon"."country_id" = "country"."id"
JOIN "brand" ON "country"."brand_id" = "brand"."id"
JOIN "user" ON "coupon"."user_id" = "user"."id"
WHERE "coupon"."updated_at" BETWEEN $1 AND $2
GROUP BY "time", "brand"."name", "coupon"."amount";
        `,
      [startDate, endDate]
    );

    return results.rows;
  }
}
