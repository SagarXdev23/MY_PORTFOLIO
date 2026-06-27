import jwt from 'jsonwebtoken';

const DEFAULT_SECRET = 'sagar_portfolio_jwt_secret_key_2026_xyz_abc';

export function getJwtSecret(): string {
  return process.env.JWT_SECRET || DEFAULT_SECRET;
}

export interface AdminPayload {
  role: 'admin';
  username: string;
}

export function signToken(payload: AdminPayload): string {
  const secret = getJwtSecret();
  return jwt.sign(payload, secret, { expiresIn: '1d' });
}

export function verifyToken(token: string): AdminPayload | null {
  try {
    const secret = getJwtSecret();
    const decoded = jwt.verify(token, secret) as any;
    if (decoded && decoded.role === 'admin') {
      return { role: 'admin', username: decoded.username };
    }
    return null;
  } catch (error) {
    return null;
  }
}
