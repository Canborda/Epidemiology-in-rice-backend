import CryptoJS from 'crypto-js';

import { BaseError } from './errors';

export function encryptData(data: string) {
  // Load and validate environment variables
  const secretKey = process.env.SECRET_KEY || '';
  if (!secretKey.length) throw new BaseError('Missing SECRET_KEY environment variable');
  // Create hash
  const key = CryptoJS.SHA256(secretKey);
  const encryptedData = CryptoJS.AES.encrypt(data, key, {
    iv: CryptoJS.enc.Base64.parse(''),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encryptedData.toString();
}

export function decryptData(data: string) {
  // Load an validate environment variables
  const secretKey = process.env.SECRET_KEY || '';
  if (!secretKey.length) throw new BaseError('Missing SECRET_KEY environment variable');
  // Create hash
  const key = CryptoJS.SHA256(secretKey);
  const decryptedData = CryptoJS.AES.decrypt(data, key, {
    iv: CryptoJS.enc.Base64.parse(''),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return decryptedData.toString(CryptoJS.enc.Utf8);
}
