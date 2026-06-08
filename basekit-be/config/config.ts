export default () => ({
  server: {
    port: process.env.PORT || 3000,
  },
  database: {
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 5432),
    username: process.env.DB_USER ?? 'root',
    password: process.env.DB_PASS ?? 'root',
    name: process.env.DB_NAME ?? 'master',
  },
  multitenancy: {
    enabled: process.env.MULTITENANCY_ENABLED !== 'false',
  },
});
