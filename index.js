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
  const { error_data } = JSON.parse(event.body || '{}');
  console.log('incoming error data: ', error_data);

  if (!error_data || !error_data.type || !error_data.timestamp) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Invalid error data' }),
    };
  }

  try {
    const query = `INSERT INTO error_logs (name, request_id, message, promise_id, 
    created_at, line_number, col_number, project_id, stack_trace) VALUES 
    ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`;

    const result = await pool.query(
      query,
      [
        error_data.error.name || 'UnknownError',
        null,
        error_data.error.message || 'No message provided',
        null,
        new Date(error_data.timestamp).toISOString(),
        error_data.line_number || null,
        error_data.col_number || null,
        error_data.project_id || null,
        error_data.error.stack_trace || 'No stack trace available'
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