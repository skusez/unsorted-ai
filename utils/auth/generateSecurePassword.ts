import { randomBytes } from 'crypto';

export async function generateSecurePassword(): Promise<string> {
  return new Promise((resolve, reject) => {
    randomBytes(32, (err, buffer) => {
      if (err) {
        reject(err);
      } else {
        resolve(buffer.toString('hex'));
      }
    });
  });
}