import dotenv from 'dotenv';
dotenv.config();

export const config = {
  baseUrl: process.env.BASE_URL || 'http://localhost:3000',
  headless: (process.env.HEADLESS ?? 'true') === 'true',
  db: {
    type: (process.env.DB_TYPE || 'mysql').toLowerCase(),
    mysql: {
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT || 3306),
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE
    },
    mssql: {
      server: process.env.MSSQL_HOST,
      user: process.env.MSSQL_USER,
      password: process.env.MSSQL_PASSWORD,
      database: process.env.MSSQL_DATABASE,
      options: { encrypt: false }
    }
  },
  logLevel: process.env.LOG_LEVEL || 'info'
};
