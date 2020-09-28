import { NextFunction } from "express";
import db from "@/data/db";

export const up = async (next: NextFunction) => {
  const client = await db.connect();

  await client.query(`
  CREATE TABLE IF NOT EXISTS users (
    id uuid PRIMARY KEY,
    email text UNIQUE,
    password text
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id uuid PRIMARY KEY,
    user_id uuid REFERENCES users (id) ON DELETE CASCADE
  );
  `);

  await client.query(`
  CREATE INDEX users_email on users (email);

  CREATE INDEX sessions_user on sessions (user_id);
  `);

  client.release(true);
  next();
};

export const down = async (next: NextFunction) => {
  const client = await db.connect();

  await client.query(`
  DROP TABLE sessions;
  DROP TABLE users;
  `);

  client.release(true);
  next();
};
