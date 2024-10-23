import CoreDataMapper from './core.datamapper.js';

export default class ExportDataMapper extends CoreDataMapper {
  async exportCoupons(startDate, endDate) {
    const result = await this.query(
      `
        SELECT "user"."id", "user"."facturation_code", COUNT("coupon"."code"), SUM("coupon"."amount")
        FROM "coupon"
        JOIN "country" ON "coupon"."country_id" = "country"."id"
        JOIN "brand" ON "country"."brand_id" = "brand"."id"
        JOIN "user" ON "coupon"."user_id" = "user"."id"
        WHERE "coupon"."updated_at" BETWEEN $1 AND $2
        GROUP BY "user"."id", "user"."facturation_code", "coupon"."amount";
        `,
      [startDate, endDate]
    );

    return result.rows;
  }
}
