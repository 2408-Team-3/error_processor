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
  console.log('Raw Event: ', JSON.stringify(event));

  const { data } = JSON.parse(event.body);
  console.log('Parsed data:', data);

  // if (!data || !data.error || !data.timestamp || !data.project_id) {
  //  return {
  //    statusCode: 400,
  //    body: JSON.stringify({ message: 'Invalid error data' }),
  //  };
  // }

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
        data.error.stack || 'No stack trace available',
        data.handled,
      ]
    );

    console.log('PostgreSQL insert result:', result);

    // Webhook: post request to backend to inform of incoming data
    // axios.post(process.env.WEBHOOK_ENDPOINT, { data: 'new error data'});

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Error data received'}),
      headers: {
        'Content-Type': 'application/json',
      }
    };
  } catch (e) {
    console.error("Error saving to PostgreSQL:", e);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error saving error data to PostgreSQL'}),
      headers: {
        'Content-Type': 'application/json',
      }
    };
  }
};