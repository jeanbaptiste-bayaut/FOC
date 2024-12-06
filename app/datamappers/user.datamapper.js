import CoreDatamapper from './core.datamapper.js';
import bcrypt from 'bcrypt';

export default class UserDataMapper extends CoreDatamapper {
  static tableName = 'user';

  static async getUserByEmail(id) {
    const result = await this.client.query(
      `
            SELECT 
                "user"."id" AS "user_id",
                "user"."email" AS "user_email"
            FROM 
                "user"
            WHERE 
                "user"."email" = $1;
            `,
      [id]
    );

    return result.rows[0];
  }

  static async getUsersWithFacturationCode() {
    const result = await this.client.query(
      `SELECT 
      "user"."id" AS "user_id",
      "user"."email" AS "user_email",
      "facturation_code"."code" AS "facturation_code",
      "user"."role" AS "role",
      "user"."service" AS "service"
      FROM "user"
      JOIN "user_has_facturation_code" ON "user_has_facturation_code"."user_id" = "user"."id"
      JOIN "facturation_code" ON "facturation_code"."id" = "user_has_facturation_code"."facturation_code_id";`
    );

    return result.rows;
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

  static async updateUser(user, prevFacturationCodes) {
    try {
      // Update user basic information
      const updatedUser = await this.client.query(
        `UPDATE "user" 
         SET "role" = $1, "service" = $2, "email" = $3 
         WHERE "id" = $4 
         RETURNING "id"`,
        [user.role, user.service, user.email, user.id]
      );

      if (!updatedUser.rows.length) {
        throw new Error(`User with ID ${user.id} not found`);
      }

      // Ensure facturationCodes is an array
      const currentFacturationCodes = Array.isArray(user.facturationCodes)
        ? user.facturationCodes
        : [user.facturationCodes];

      console.log('prev', prevFacturationCodes);
      console.log('current', currentFacturationCodes);

      const prevFactuCodeIds = [];
      const newFactuCodeIds = [];

      // Fetch previous and new facturation code IDs in parallel
      const [prevResults, newResults] = await Promise.all([
        Promise.all(
          prevFacturationCodes.map(async (code) => {
            const result = await this.client.query(
              `SELECT "id" FROM "facturation_code" WHERE "code" = $1`,
              [code]
            );
            return result.rows.map((row) => row.id);
          })
        ),
        Promise.all(
          currentFacturationCodes.map(async (code) => {
            const result = await this.client.query(
              `SELECT "id" FROM "facturation_code" WHERE "code" = $1`,
              [code]
            );
            return result.rows.map((row) => row.id);
          })
        ),
      ]);

      // Flatten and combine the results
      prevFactuCodeIds.push(...prevResults.flat());
      newFactuCodeIds.push(...newResults.flat());

      // Validate matching IDs for update
      if (prevFactuCodeIds.length !== newFactuCodeIds.length) {
        throw new Error('Mismatch between previous and new facturation codes');
      }

      // Update user_has_facturation_code entries
      await Promise.all(
        prevFactuCodeIds.map(async (prevId, index) => {
          const newId = newFactuCodeIds[index];
          const result = await this.client.query(
            `UPDATE "user_has_facturation_code"
             SET "facturation_code_id" = $1
             WHERE "user_id" = $2
               AND "facturation_code_id" = $3
             RETURNING "id"`,
            [newId, user.id, prevId]
          );

          if (!result.rows.length) {
            throw new Error(
              `Failed to update facturation code for user ${user.id}`
            );
          }
        })
      );

      return { success: `User ${user.id} updated successfully` };
    } catch (error) {
      console.error(`Error updating user: ${error.message}`);
      throw new Error(`Error updating user: ${error.message}`);
    }
  }
}
