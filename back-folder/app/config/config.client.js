import pg from 'pg';

const { Pool } = pg;

// Create a new client using the connection string
const client = new Pool({
  connectionString:
    process.env.ENV === 'production'
      ? process.env.POSTGRES_URL
      : process.env.PGURL,
});

// Fonction pour connecter le client
async function connectClient() {
  try {
    await client.connect();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    throw error;
  }
}

export { client, connectClient };
