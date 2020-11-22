import { v4 as uuid } from "uuid";
import sql from "sql-template-strings";
import db from "@/data/db";

export default {
  async create(userId: string) {
    const id = uuid();
    await db.query(sql`
    INSERT INTO sessions (id, user_id)
      VALUES (${id}, ${userId});
    `);
    return id;
  },
  async find(id: string) {
    const { rows } = await db.query(sql`
    SELECT user_id FROM sessions WHERE id = ${id} LIMIT 1;
    `);
    if (rows.length !== 1) {
      return null;
    }

    const { user_id: userId } = rows[0];
    return { userId };
  },
  async delete(id: string) {
    await db.query(sql`
    DELETE FROM sessions WHERE id = ${id};
    `);
  },
};
