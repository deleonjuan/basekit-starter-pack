export default () => ({
  server: {
    port: process.env.PORT || 3000,
  },
  databse: {
    connectionString: process.env.DB_CONNECTION_STRINGß,
  },
});
