import {Pool} from 'pg';
import dotenv from 'dotenv';
dotenv.config()

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

export {pool}