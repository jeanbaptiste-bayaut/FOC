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
}
