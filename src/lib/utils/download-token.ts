import { nanoid } from 'nanoid';

export function generateDownloadToken(): string {
  return nanoid(32);
}

export function generateAccessExpiry(hours: number = 24): Date {
  const expiry = new Date();
  expiry.setHours(expiry.getHours() + hours);
  return expiry;
}
