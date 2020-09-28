import { Pool } from "pg";
import sql from "sql-template-strings";

import db from "./db";

const ensureMigrationsTable = (db: Pool) =>
  db.query(
    "CREATE TABLE IF NOT EXISTS migrations (id integer PRIMARY KEY, data jsonb NOT NULL)"
  );

const postgresStateStorage = {
  async load(fn: Function) {
    await db.connect();

    await ensureMigrationsTable(db);
    // Load the single row of migration data from the database
    const { rows } = await db.query("SELECT data FROM migrations");

    if (rows.length !== 1) {
      console.log(
        "Cannot read migrations from database. If this is the first time you run migrations, then this is normal."
      );

      return fn(null, {});
    }

    // Call callback with new migration data object
    fn(null, rows[0].data);
  },

  async save(set: any, fn: Function) {
    await db.connect();

    // Check if table 'migrations' exists and if not, create it.
    await ensureMigrationsTable(db);

    const migrationMetaData = {
      lastRun: set.lastRun,
      migrations: set.migrations,
    };

    await db.query(sql`
      INSERT INTO migrations (id, data)
      VALUES (1, ${migrationMetaData})
      ON CONFLICT (id) DO UPDATE SET data = ${migrationMetaData}
    `);

    fn();
  },
};

export default Object.assign(() => {
  return postgresStateStorage;
}, postgresStateStorage);
