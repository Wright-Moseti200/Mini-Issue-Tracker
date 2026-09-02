const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');
require('dotenv').config();

const client = postgres(process.env.DATABASE_URL);
const db = drizzle(client);

const connectDb = async () => {
  try {
    await client`SELECT 1`;
    console.log("Connected to the database");
  } catch (error) {
    console.error("Failed to connect to the database:", error.message);
  }
};

module.exports = { db, connectDb };