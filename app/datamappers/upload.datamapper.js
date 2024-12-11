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
              // Prepare the query
              const query = `
                INSERT INTO "coupon" ("code", "amount", "country_id", "wetsuit")
                VALUES ($1, $2, $3, $4, $5)
                ON CONFLICT (code, country_id) DO NOTHING
                RETURNING "id";
              `;

              // Execute the queries for all rows
              await Promise.all(
                results.map(async (row) => {
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
              // Prepare the query
              const query = `
                INSERT INTO "freeshipping" ("code", "country_id")
                VALUES ($1, $2)
                ON CONFLICT (code, country_id) DO NOTHING
                RETURNING "id";
              `;

              // Execute the queries for all rows
              await Promise.all(
                results.map(async (row) => {
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
