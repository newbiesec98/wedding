/** @type { import("drizzle-kit").Config } */
export default {
  schema: './server/db/schema.js',
  out: './server/db/migrations',
  dialect: 'sqlite',
  dbCredentials: {
    url: './sqlite.db',
  }
};
