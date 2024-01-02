import { config } from 'dotenv';
import { resolve } from 'path';

export const NODE_ENV = process.env.NODE_ENV || 'development';

const envFile = NODE_ENV === 'development' ? '.env.development' : '.env';

config({ path: resolve(__dirname, `../${envFile}`) });
config({ path: resolve(__dirname, `../${envFile}.local`), override: true });

// Load all environment variables from .env file

export const PORT = process.env.PORT || 8000;
export const DB_HOST = process.env.DB_HOST || 'localhost';
export const DB_PORT = process.env.DB_PORT || 3306;
export const DB_USER = process.env.DB_USER || 'root';
export const DB_PASSWORD = process.env.DB_PASSWORD || null;
export const DB_NAME = process.env.DB_NAME;

//Wahyu Widiantoro
export const MAILER_USER = process.env.MAILER_USER;
export const MAILER_PASS = process.env.MAILER_PASS;
export const APP_URL = process.env.APP_URL;
export const SCRT_KEY = process.env.SCRT_KEY;
export const OPENCAGE_API_URL = process.env.OPENCAGE_API_URL;
export const OPENCAGE_API_KEY = process.env.OPENCAGE_API_KEY;
