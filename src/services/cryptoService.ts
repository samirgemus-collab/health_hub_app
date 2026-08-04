/**
 * HEALTHHUB.AI - SERVIÇO DE CRIPTOGRAFIA END-TO-END (E2EE)
 * Implementação Real utilizando a Web Crypto API nativa do navegador (W3C Standard).
 * Algoritmo: AES-256-GCM com derivação de chave via PBKDF2 (SHA-256) e Salt/IV dinâmicos.
 */

export interface EncryptedPayload {
  cipherTextBase64: string;
  ivBase64: string;
  saltBase64: string;
  encryptedAt: string;
  algorithm: 'AES-256-GCM';
}

/**
 * Converte ArrayBuffer para string Base64
 */
function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Converte string Base64 para Uint8Array
 */
function base64ToBuffer(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Deriva uma CryptoKey AES-256 a partir de uma frase secreta ou senha via PBKDF2
 */
async function deriveEncryptionKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const passphraseKey = await window.crypto.subtle.importKey(
    'raw',
    encoder.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as any,
      iterations: 100000,
      hash: 'SHA-256'
    },
    passphraseKey,
    { name: 'AES-256-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Cifra um texto ou payload de laudo em PDF usando AES-256-GCM
 */
export async function encryptDataE2EE(plainText: string, passphrase: string): Promise<EncryptedPayload> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(plainText);

  // Gerar Salt e IV aleatórios cryptograficamente seguros
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  // Derivar Chave de Cifragem
  const cryptoKey = await deriveEncryptionKey(passphrase, salt);

  // Executar Cifragem AES-GCM
  const encryptedBuffer = await window.crypto.subtle.encrypt(
    {
      name: 'AES-256-GCM',
      iv: iv as any
    },
    cryptoKey,
    dataBuffer
  );

  return {
    cipherTextBase64: bufferToBase64(encryptedBuffer),
    ivBase64: bufferToBase64(iv.buffer),
    saltBase64: bufferToBase64(salt.buffer),
    encryptedAt: new Date().toISOString(),
    algorithm: 'AES-256-GCM'
  };
}

/**
 * Decifra um payload E2EE retornando a string original em texto claro
 */
export async function decryptDataE2EE(payload: EncryptedPayload, passphrase: string): Promise<string> {
  const cipherBuffer = base64ToBuffer(payload.cipherTextBase64);
  const ivBuffer = base64ToBuffer(payload.ivBase64);
  const saltBuffer = base64ToBuffer(payload.saltBase64);

  // Derivar Chave idêntica usando o mesmo Salt
  const cryptoKey = await deriveEncryptionKey(passphrase, saltBuffer);

  // Executar Decifragem AES-GCM
  const decryptedBuffer = await window.crypto.subtle.decrypt(
    {
      name: 'AES-256-GCM',
      iv: ivBuffer as any
    },
    cryptoKey,
    cipherBuffer as any
  );

  const decoder = new TextDecoder();
  return decoder.decode(decryptedBuffer);
}

/**
 * Gera um Hash SHA-256 para auditoria imutável de laudos ou acessos
 */
export async function generateSHA256Hash(content: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
