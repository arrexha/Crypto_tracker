import 'dotenv/config';

const required = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name} (see .env.example)`);
  }
  return value;
};

export const JWT_SECRET = required('JWT_SECRET');
export const PORT = process.env.PORT || 4000;
export const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
