import { pool } from '../db/index.js';
import { env } from '../config/env.js';
import { readFileSync } from 'fs';
import path from 'path';
import { PKPass } from 'passkit-generator';
import { GoogleAuth } from 'google-auth-library';

export async function issueWallet(req, res) {
  const userId = Number(req.params.userId);
  const { firstName, lastName, memberId, customDesign } = req.body || {};
  const { rows } = await pool.query(
    `INSERT INTO wallet_cards (user_id, first_name, last_name, member_id, design_json, status, expires_at)
     VALUES ($1,$2,$3,$4,$5,'active', now() + interval '1 year')
     ON CONFLICT (user_id) DO UPDATE SET first_name=EXCLUDED.first_name, last_name=EXCLUDED.last_name, member_id=EXCLUDED.member_id, design_json=EXCLUDED.design_json, status='active', expires_at=now() + interval '1 year', updated_at=now()
     RETURNING *`,
    [userId, firstName, lastName, memberId, customDesign ? JSON.stringify(customDesign) : null]
  );
  res.json(rows[0]);
}

export async function getWallet(req, res) {
  const userId = req.params.userId;
  const { rows } = await pool.query('SELECT * FROM wallet_cards WHERE user_id=$1', [userId]);
  if (!rows.length) return res.status(404).json({ error: 'No card' });
  res.json(rows[0]);
}

export async function generateApplePass(req, res) {
  try {
    const memberId = req.query.memberId;
    if (!memberId) return res.status(400).json({ error: 'memberId required' });
    const { rows } = await pool.query('SELECT u.id, u.first_name, u.last_name FROM users u WHERE u.member_id=$1', [memberId]);
    if (!rows.length) return res.status(404).json({ error: 'User not found' });

    const modelPath = path.join(process.cwd(), 'backend', 'assets', 'pass');
    const wwdr = env.appleWwdrCertPath ? readFileSync(env.appleWwdrCertPath) : null;
    const signerCert = env.applePassCertPath ? readFileSync(env.applePassCertPath) : null;
    const pass = await PKPass.from({
      model: modelPath,
      certificates: {
        wwdr,
        signerCert,
        signerKey: signerCert,
        signerKeyPassphrase: env.applePassCertPassword,
      },
    });

    pass.headerFields = [{ key: 'member', label: 'Member', value: memberId }];
    pass.barcode('PKBarcodeFormatQR', memberId, 'UTF-8');
    pass.passTypeIdentifier = env.applePassTypeIdentifier || 'pass.com.example';
    pass.teamIdentifier = env.appleTeamIdentifier || 'TEAMID';
    pass.labelColor = 'rgb(255,255,255)';
    pass.foregroundColor = 'rgb(0,0,0)';
    pass.backgroundColor = 'rgb(0,122,255)';
    pass.organizationName = 'Season Ticket';
    pass.description = 'Season Ticket';
    pass.serialNumber = `season-${memberId}`;

    const buf = await pass.asBuffer();
    res.setHeader('Content-Type', 'application/vnd.apple.pkpass');
    res.setHeader('Content-Disposition', `attachment; filename=season-${memberId}.pkpass`);
    return res.send(buf);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
}

export async function generateGoogleWalletLink(req, res) {
  try {
    const memberId = req.query.memberId;
    if (!memberId) return res.status(400).json({ error: 'memberId required' });

    // In a full implementation, you'd create a class and object via Google Wallet API.
    // Here we construct a "Save to Google Wallet" JWT per their reference.
    const auth = new GoogleAuth({
      keyFile: env.googleWalletServiceAccountKeyPath,
      scopes: ['https://www.googleapis.com/auth/wallet_object.issuer'],
    });
    const client = await auth.getClient();
    const serviceAccount = require(env.googleWalletServiceAccountKeyPath);

    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + 3600;
    const iss = serviceAccount.client_email;
    const origins = [env.publicAppBaseUrl];
    const payload = {
      iss,
      aud: 'google',
      typ: 'savetowallet',
      iat,
      exp,
      origins,
      payload: {
        genericObjects: [
          {
            id: `${env.googleWalletIssuerId}.${memberId}`,
            classId: `${env.googleWalletIssuerId}.season_ticket`,
            logo: { sourceUri: { uri: `${env.publicAppBaseUrl}/logo.png` } },
            cardTitle: { defaultValue: { language: 'en-US', value: 'Season Ticket' } },
            subheader: { defaultValue: { language: 'en-US', value: `Member ${memberId}` } },
            header: { defaultValue: { language: 'en-US', value: 'Waterpolo Club' } },
          },
        ],
      },
    };

    const jwt = await client.sign(JSON.stringify(payload));
    const saveUrl = `https://pay.google.com/gp/v/save/${jwt}`;

    return res.json({ url: saveUrl });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
}

export async function walletHealth(req, res) {
  const result = {
    apple: { configured: false, errors: [] },
    google: { configured: false, errors: [] },
  };
  // Apple checks
  try {
    result.apple.configured = Boolean(
      env.applePassTypeIdentifier && env.appleTeamIdentifier && env.applePassCertPath && env.applePassCertPassword && env.appleWwdrCertPath
    );
    if (result.apple.configured) {
      readFileSync(env.applePassCertPath);
      readFileSync(env.appleWwdrCertPath);
    }
  } catch (e) {
    result.apple.errors.push(String(e?.message || e));
  }
  // Google checks
  try {
    result.google.configured = Boolean(env.googleWalletIssuerId && env.googleWalletServiceAccountKeyPath);
    if (result.google.configured) {
      readFileSync(env.googleWalletServiceAccountKeyPath);
    }
  } catch (e) {
    result.google.errors.push(String(e?.message || e));
  }
  return res.json(result);
}


