// Current correct syntax
const { defineConfig } = require('drizzle-kit');
require('dotenv').config();

module.exports = defineConfig({
  schema: './schema',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});