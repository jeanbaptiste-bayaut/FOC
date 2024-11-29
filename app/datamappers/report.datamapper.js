import CoreDatamapper from './core.datamapper.js';

export default class ReportDataMapper extends CoreDatamapper {
  static tableName = 'coupon';

  // expected data for bar chart in the report page
  static async getNbCouponsByAmountByBrand(startDate, endDate) {
    // transform the dates from the request to ensure that we get the coupons from the start to the end of the day
    const startDateEndOfDay = `${startDate} 00:00:00`;
    const endDateEndOfDay = `${endDate} 23:59:59`;

    // get the number and sum of coupons by brand and by amount
    const results = await this.client.query(
      `
      SELECT "brand"."name", "coupon"."amount", COUNT("coupon"."amount"), SUM("coupon"."amount") FROM "coupon"
      JOIN "country" ON "coupon"."country_id" = "country"."id"
      JOIN "brand" ON "country"."brand_id" = "brand"."id"
      JOIN "user" ON "coupon"."user_id" = "user"."id"
      WHERE "coupon"."updated_at" BETWEEN $1 AND $2
      GROUP BY "brand"."name","coupon"."amount"
      ORDER BY "coupon"."amount" DESC;
        `,
      [startDateEndOfDay, endDateEndOfDay]
    );

    return results.rows;
  }

  static async getAmountByBrand(startDate, endDate) {
    // transform the dates from the request to ensure that we get the coupons from the start to the end of the day
    const startDateEndOfDay = `${startDate} 00:00:00`;
    const endDateEndOfDay = `${endDate} 23:59:59`;

    // get the sum and number of coupons used by brand
    const results = await this.client.query(
      `
      SELECT "brand"."name", SUM("coupon"."amount"), COUNT("coupon"."code") FROM "coupon"
      JOIN "country" ON "coupon"."country_id" = "country"."id"
      JOIN "brand" ON "country"."brand_id" = "brand"."id"
      JOIN "user" ON "coupon"."user_id" = "user"."id"
      WHERE "coupon"."updated_at" BETWEEN $1 AND $2
      GROUP BY "brand"."name";
        `,
      [startDateEndOfDay, endDateEndOfDay]
    );
    return results.rows;
  }

  static async getAmountAndNbOfCouopnByTimePeriod(startDate, endDate) {
    // transform the dates from the request to ensure that we get the coupons from the start to the end of the day
    const startDateEndOfDay = `${startDate} 00:00:00`;
    const endDateEndOfDay = `${endDate} 23:59:59`;

    // get the sum and number of coupons used by brand and by time for line chart Xaxis: time, Yaxis: sum of coupons
    const results = await this.client.query(
      `
SELECT 
  TO_CHAR("coupon"."updated_at", 'YYYY-MM-DD') as "time", 
  "brand"."name", 
  COUNT("coupon"."code"), 
  SUM("coupon"."amount")
FROM "coupon"
JOIN "country" ON "coupon"."country_id" = "country"."id"
JOIN "brand" ON "country"."brand_id" = "brand"."id"
JOIN "user" ON "coupon"."user_id" = "user"."id"
WHERE "coupon"."updated_at" BETWEEN $1 AND $2
GROUP BY "time", "brand"."name";
        `,
      [startDateEndOfDay, endDateEndOfDay]
    );

    return results.rows;
  }
}
