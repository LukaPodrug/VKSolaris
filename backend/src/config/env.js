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
  stripeSecretKey: requireEnv('STRIPE_SECRET_KEY'),
  stripePriceId: requireEnv('STRIPE_PRICE_ID'),
  publicAppBaseUrl: requireEnv('PUBLIC_APP_BASE_URL'),
  applePassBaseUrl: process.env.APPLE_PASS_BASE_URL, // optional static host for pkpass
  googleWalletBaseUrl: process.env.GOOGLE_WALLET_BASE_URL, // optional save link host
  // Apple Wallet
  applePassTypeIdentifier: process.env.APPLE_PASS_TYPE_IDENTIFIER,
  appleTeamIdentifier: process.env.APPLE_TEAM_IDENTIFIER,
  applePassCertPath: process.env.APPLE_PASS_CERT_PATH,
  applePassCertPassword: process.env.APPLE_PASS_CERT_PASSWORD,
  appleWwdrCertPath: process.env.APPLE_WWDR_CERT_PATH,
  // Google Wallet
  googleWalletIssuerId: process.env.GOOGLE_WALLET_ISSUER_ID,
  googleWalletServiceAccountKeyPath: process.env.GOOGLE_WALLET_SA_KEY_PATH,
};

export { requireEnv };


