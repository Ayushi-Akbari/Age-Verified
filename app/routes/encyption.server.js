import crypto from 'crypto';

const algorithm = 'aes-256-cbc';

const secretKey = process.env.ENCRYPTION_SECRET_KEY;
const secretIv = process.env.ENCRYPTION_SECRET_IV;

if (!secretKey || !secretIv) {
  throw new Error('Missing encryption secrets in environment variables');
}

const key = crypto.createHash('sha256').update(secretKey).digest();
const iv = crypto.createHash('sha256').update(secretIv).digest().slice(0, 16);

export function encrypt(text) {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  return encrypted.toString('base64');
}

export function decrypt(encryptedText) {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedText, 'base64')),
    decipher.final()
  ]);
  return decrypted.toString('utf8');
}