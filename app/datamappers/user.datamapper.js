import CoreDatamapper from './core.datamapper.js';
import bcrypt from 'bcrypt';

export default class UserDataMapper extends CoreDatamapper {
  static tableName = 'user';

  static async getUserById(id) {
    const result = await this.client.query(
      `
            SELECT 
                "user"."id" AS "user_id",
                "user"."name" AS "user_name",
                "user"."email" AS "user_email",
            FROM 
                "user"
            WHERE 
                "user"."id" = $1;
            `,
      [id]
    );

    return result.rows[0];
  }

  static async createUser(email, password, service, facturationCodeList, role) {
    const saltRound = 10;
    try {
      const hashedPassword = await bcrypt.hash(password, saltRound);

      const result = await this.client.query(
        `INSERT INTO "user" ("email", "password", "service", "role") 
      VALUES ($1,$2,$3,$4)  
      RETURNING *`,
        [email, hashedPassword, service, role]
      );

      const { rows } = result;

      for (const code of facturationCodeList) {
        const facturationCodeId = await this.client.query(
          `INSERT INTO "facturation_code" ("code")
          VALUES ($1)
          RETURNING "id"`,
          [code.facturation_code]
        );

        if (!facturationCodeId) {
          throw new Error('Facturation code not found');
        }

        await this.client.query(
          `INSERT INTO "user_has_facturation_code" ("facturation_code_id", "user_id") 
          VALUES ($1,$2)  
          RETURNING *`,
          [facturationCodeId.rows[0].id, result.rows[0].id]
        );
      }

      delete rows[0].password;
      return rows[0];
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async findByEmail(email) {
    const result = await this.client.query(
      `SELECT * FROM "user" WHERE "email" =$1`,
      [email]
    );
    const user = result.rows[0];

    if (!user) {
      return null;
    }
    return user;
  }

  static async login(email, password) {
    const result = await this.client.query(
      `SELECT "user"."id", "facturation_code"."code", "user"."email", "user"."password", "user"."role", "user"."email" FROM "user"
      JOIN "user_has_facturation_code" ON "user_has_facturation_code"."user_id" = "user"."id"
      JOIN "facturation_code" ON "facturation_code"."id" = "user_has_facturation_code"."facturation_code_id"
      WHERE "email" =$1
      GROUP BY "user"."id", "facturation_code"."code", "user"."role";`,
      [email]
    );

    const user = result.rows[0];

    if (!user) {
      throw new Error({ status: 404, message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch === false) {
      throw new Error({ status: 400, message: 'email or password incorrect' });
    }

    delete user.password;

    const facturationCodeList = [];
    result.rows.map((row) => {
      facturationCodeList.push(row.code);
    });
    return { user, facturationCodeList };
  }
}
