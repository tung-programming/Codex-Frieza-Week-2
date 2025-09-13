import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,  // needed for Render
  },
});

pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

export default {
  query: (text, params) => pool.query(text, params),
};
