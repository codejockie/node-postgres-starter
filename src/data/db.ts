import { Pool } from "pg";

export default new Pool({
  max: 10,
  connectionString: process.env.DATABASE_URL,
});
