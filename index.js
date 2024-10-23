import axios from 'axios';
import dotenv from 'dotenv';
import pkg from 'pg';

dotenv.config();
const { Pool } = pkg;

const pool = new Pool({
  user: process.env.PGUSER,  
  host: process.env.PGUSERHOST,
  database: process.env.PGDATABASE, 
  password: process.env.PGPASSWORD, 
  port: process.env.PGPORT, 
});

export const handler = async (event, context) => {
  const { data } = JSON.parse(event.body || '{}');
  console.log('incoming error data: ', data);

  if (!data) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Invalid error data' }),
    };
  }

  try {
    const query = `INSERT INTO error_logs (name, message, created_at,
    line_number, col_number, project_id, stack_trace, handled) VALUES 
    ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`;

    const result = await pool.query(
      query,
      [
        data.error.name || 'UnknownError',
        data.error.message || 'No message provided',
        data.timestamp,
        data.line_number || null, // extract programmatically from stack trace
        data.col_number || null, // extract programmatically from stack trace
        data.project_id || null,
        data.error.stack_trace || 'No stack trace available',
        data.handled,
      ]
    );

    // Webhook: post request to backend to inform of incoming data
    // axios.post(process.env.WEBHOOK_ENDPOINT, { data: 'new error data'});

    return {
      status: 200,
      body: { message: 'error data received'}
    };

  } catch (e) {
    console.error(e);
    throw new Error('Error saving request to PostgreSQL');
  }
};