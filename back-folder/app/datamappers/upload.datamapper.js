import CoreDataMapper from './core.datamapper.js';
import fs from 'fs';
import csvParser from 'csv-parser';

export default class UploadDatamapper extends CoreDataMapper {
  static tableName = 'coupon';

  static async uploadCoupons(filePath) {
    try {
      const results = [];
      let createdCount = 0; // Counter for created coupons

      // Convert the stream process into a Promise
      await new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csvParser({ separator: ';' }))
          .on('data', (row) => {
            results.push(row);
          })
          .on('end', async () => {
            try {
              const getCountryIdQuery = `
              SELECT "country"."id" as "country_id" from "country"
              JOIN "brand" on "country"."brand_id" = "brand"."id"
              WHERE "brand"."name" = $1
              AND "country"."name" = $2;`;

              // Prepare the query
              const query = `
                INSERT INTO "coupon" ("code", "amount", "country_id", "wetsuit")
                VALUES ($1, $2, $3, $4)
                ON CONFLICT (code, country_id) DO NOTHING
                RETURNING "id";
              `;

              const newTable = [];
              // Execute the queries for all rows
              await Promise.all(
                results.map(async (row) => {
                  const countryIdResult = await this.client.query(
                    getCountryIdQuery,
                    [row.brand, row.country]
                  );

                  if (countryIdResult.rows.length === 0) {
                    throw new Error('Country not found');
                  }

                  newTable.push({
                    code: row.code,
                    amount: row.amount,
                    wetsuit: row.wetsuit,
                    country_id: countryIdResult.rows[0].country_id,
                  });
                })
              );

              await Promise.all(
                newTable.map(async (row) => {
                  const result = await this.client.query(query, [
                    row.code,
                    row.amount,
                    row.country_id,
                    row.wetsuit,
                  ]);

                  if (result.rows.length > 0) {
                    createdCount += 1; // +1 if a coupon is created
                  }
                })
              );

              resolve(); // Resolve the Promise when all rows are processed
            } catch (dbError) {
              reject(dbError); // Reject if there's an error in the database operations
            }
          })
          .on('error', (err) => {
            reject(err); // Reject the Promise if there's an error in the stream
          });
      });
      return {
        message: `file uploaded succesffuly \n ${createdCount} coupon(s) created`,
      };
    } catch (error) {
      console.error('Error importing CSV file:', error);
      throw new Error('Error importing CSV file');
    }
  }

  static async uploadFreeshipping(filePath) {
    try {
      const results = [];
      let createdCount = 0; // Counter for created coupons

      // Convert the stream process into a Promise
      await new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csvParser({ separator: ';' }))
          .on('data', (row) => {
            results.push(row);
          })
          .on('end', async () => {
            try {
              const getCountryIdQuery = `
              SELECT "country"."id" as "country_id" from "country"
              JOIN "brand" on "country"."brand_id" = "brand"."id"
              WHERE "brand"."name" = $1
              AND "country"."name" = $2;`;

              // Prepare the query
              const query = `
                INSERT INTO "freeshipping" ("code", "country_id")
                VALUES ($1, $2)
                ON CONFLICT (code, country_id) DO NOTHING
                RETURNING "id";
              `;

              // Execute the queries for all rows
              const newTable = [];
              await Promise.all(
                results.map(async (row) => {
                  const countryIdResult = await this.client.query(
                    getCountryIdQuery,
                    [row.brand, row.country]
                  );

                  if (countryIdResult.rows.length === 0) {
                    throw new Error('Country not found');
                  }

                  newTable.push({
                    code: row.code,
                    country_id: countryIdResult.rows[0].country_id,
                  });
                })
              );

              await Promise.all(
                newTable.map(async (row) => {
                  const result = await this.client.query(query, [
                    row.code,
                    row.country_id,
                  ]);

                  if (result.rows.length > 0) {
                    createdCount += 1; // +1 if a coupon is created
                  }
                })
              );

              resolve(); // Resolve the Promise when all rows are processed
            } catch (dbError) {
              reject(dbError); // Reject if there's an error in the database operations
            }
          })
          .on('error', (err) => {
            reject(err); // Reject the Promise if there's an error in the stream
          });
      });
      return {
        message: `file uploaded succesffuly \n ${createdCount} coupon(s) created`,
      };
    } catch (error) {
      console.error('Error importing CSV file:', error);
      throw new Error('Error importing CSV file');
    }
  }
}
