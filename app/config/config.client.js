import pg from 'pg';

const { Pool } = pg;

// Create a new client using the connection string
const client = new Pool({
  connectionString:
    process.env.ENV === 'production'
      ? process.env.POSTGRES_URL
      : process.env.PGURL,
});

await client.connect();

export default client;
