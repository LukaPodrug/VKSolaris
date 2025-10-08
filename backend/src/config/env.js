import 'dotenv/config';

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env ${name}`);
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 8080),
  databaseUrl: requireEnv('DATABASE_URL'),
  jwtSecret: requireEnv('JWT_SECRET'),
  adminDefaultEmail: process.env.ADMIN_DEFAULT_EMAIL,
  adminDefaultPassword: process.env.ADMIN_DEFAULT_PASSWORD,
};

export { requireEnv };


