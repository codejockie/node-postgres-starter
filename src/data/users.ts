import * as bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import sql from "sql-template-strings";
import db from "@/data/db";

export default {
  async create(email: string, password: string) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const { rows } = await db.query(sql`
      INSERT INTO users (id, email, password)
        VALUES (${uuid()}, ${email}, ${hashedPassword})
        RETURNING id, email;
      `);

      const [user] = rows;
      return user;
    } catch (error) {
      if (error.constraint === "users_email_key") {
        return null;
      }

      throw error;
    }
  },
  async find(email: string) {
    const { rows } = await db.query(sql`
    SELECT * FROM users WHERE email=${email} LIMIT 1;
    `);
    return rows[0];
  },
};
