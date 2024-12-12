import CoreDataMapper from './core.datamapper.js';

export default class ExportDataMapper extends CoreDataMapper {
  static async getCouponsByTimePeriod(startDate, endDate) {
    // returns all the coupons used between the start and end date user has choosen with the facturation code, the brand,
    // the country, the user email, the service, the coupon code, and the promo total
    const result = await this.client.query(
      `
        SELECT 
        "coupon"."updated_at" as "Date", 
        "brand"."name" as "Brand",
        "country"."name" as "Country",
        "user"."email" as "Email", 
        "user"."service" as "Service", 
        "coupon"."code" as "Code Coupon",
        "facturation_code"."code" as "Cost Center", 
        "coupon"."amount" as "Promo total"
        FROM "coupon"
        JOIN "country" ON "coupon"."country_id" = "country"."id"
        JOIN "brand" ON "country"."brand_id" = "brand"."id"
        JOIN "user" ON "coupon"."user_id" = "user"."id"
        JOIN "user_has_facturation_code" ON "user_has_facturation_code"."user_id" = "user"."id"
        JOIN "facturation_code" ON "facturation_code"."id" = "coupon"."facturation_code_id"
        WHERE "coupon"."updated_at"::date BETWEEN $1 AND $2
        AND "status"=1; 
        `,
      [startDate, endDate]
    );

    return result.rows;
  }
}
