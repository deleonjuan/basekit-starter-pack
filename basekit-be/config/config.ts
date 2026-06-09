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
  jwt: {
    secret: process.env.JWT_SECRET ?? 'changeme',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '15m',
    refreshSecret: process.env.JWT_REFRESH_SECRET ?? 'changeme_refresh',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
    cookieMaxAge: 15 * 60 * 1000,
    refreshCookieMaxAge: 7 * 24 * 60 * 60 * 1000,
  },
});
