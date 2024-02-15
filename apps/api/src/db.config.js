import {
  NODE_ENV,
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_PORT,
} from './config';

const config = {
  development: {
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'mysql',
    dialectOptions: {
      decimalNumbers: true
    },
    timezone: "+07:00",
  },
  test: {
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'mysql',
    dialectOptions: {
      decimalNumbers: true
    },
    timezone: "+07:00",
  },
  production: {
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'mysql',
    dialectOptions: {
      decimalNumbers: true
    },
    timezone: "+07:00",
  },
};

export default config[NODE_ENV];
module.exports = config;
