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

  static async createUser(email, password, brand, facturation_code, role) {
    const saltRound = 10;

    const hashedPassword = await bcrypt.hash(password, saltRound);

    const result = await this.client.query(
      `INSERT INTO "user" ("email", "password", "brand", "facturation_code", "role") 
      VALUES ($1,$2,$3,$4,$5)  
      RETURNING *`,
      [email, hashedPassword, brand, facturation_code, role]
    );

    const { rows } = result;

    delete rows[0].password;

    return rows[0];
  }

  static async findByEmail(email) {
    const result = await this.client.query(
      `SELECT * FROM ${this.tableName} WHERE "email" =$1`,
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
      `SELECT * FROM "user" WHERE "email" =$1`,
      [email]
    );

    const user = result.rows[0];

    if (!user) {
      throw new Error();
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch === false) {
      throw new Error();
    }

    delete user.password;

    return user;
  }
}
