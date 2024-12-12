import CoreDataMapper from './core.datamapper.js';

export default class FacturationCodeDatamapper extends CoreDataMapper {
  static tableName = 'user_has_facturation_code';

  static async deleteFacturationCodeFromUser(userId, facturationCodeId) {
    const facturationCodeIds = [];

    try {
      await Promise.all(
        facturationCodeId
          .replace(/"/g, '')
          .split(',')
          .map(async (code) => {
            const id = await this.client.query(
              `SELECT "id" FROM "facturation_code" WHERE "code" = $1`,
              [code]
            );

            facturationCodeIds.push(id.rows[0].id);
          })
      );

      await Promise.all(
        facturationCodeIds.map(async (id) => {
          console.log(userId, id);

          await this.client.query(
            `DELETE FROM "user_has_facturation_code" 
      WHERE "user_id" = $1 AND "facturation_code_id" = $2
      RETURNING "id"`,
            [userId, id]
          );
        })
      );

      return { message: `Facturation code ${facturationCodeId} deleted` };
    } catch (error) {
      throw new Error(error);
    }
  }

  static async addExisitingFacturationCodeToUser(userId, facturationCodeId) {
    try {
      await this.client.query(
        `INSERT INTO "user_has_facturation_code" ("facturation_code_id", "user_id") 
      VALUES ($1,$2)  
      RETURNING *`,
        [facturationCodeId, userId]
      );

      return { message: `Facturation code ${facturationCodeId} added` };
    } catch (error) {
      throw new Error(error);
    }
  }

  static async addNewFacturationCodeToUser(userId, code) {
    try {
      const response = await this.client.query(
        `INSERT INTO "facturation_code" ("code") VALUES ($1)
        RETURNING "id"`,
        [code]
      );

      if (!response) {
        throw new Error('Facturation code not added');
      }

      const newCodeId = response.rows[0].id;

      await this.client.query(
        `INSERT INTO "user_has_facturation_code" ("facturation_code_id", "user_id") 
      VALUES ($1,$2)  
      RETURNING *`,
        [newCodeId, userId]
      );

      return { message: `Facturation code ${code} added` };
    } catch (error) {
      throw new Error(error);
    }
  }
}
