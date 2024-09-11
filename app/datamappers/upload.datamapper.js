import CoreDataMapper from './core.datamapper.js';
import fs from 'fs';
import csvParser from 'csv-parser';

export default class UploadDatamapper extends CoreDataMapper {
  static tableName = 'coupon';

  static async uploadCoupons(filePath) {
    try {
      const results = [];

      fs.createReadStream(filePath)
        .pipe(csvParser({ separator: ';' }))
        .on('data', (row) => {
          results.push(row);
        })
        .on('end', async () => {
          const query = `
            INSERT INTO "coupon" ("code", "amount", "status", "country_id", "wetsuit")
            VALUES ($1, $2, $3, $4, $5);
            `;

          await Promise.all(
            results.map(async (row) => {
              await this.client.query(query, [
                row.code,
                row.amount,
                row.status,
                row.country_id,
                row.wetsuit,
              ]);
            })
          );
          this.client.end();
          return { success: 'File uploaded and processed successfully' };
        });
    } catch (error) {
      console.error('Error importing CSV file:', error);
      throw new Error('Error importing CSV file');
    }
  }
}
