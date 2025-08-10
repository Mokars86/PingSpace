import CryptoJS from 'crypto-js';
import * as Crypto from 'expo-crypto';

export interface EncryptionKeys {
  publicKey: string;
  privateKey: string;
  sharedSecret?: string;
}

export interface EncryptedMessage {
  encryptedContent: string;
  iv: string;
  signature: string;
  timestamp: number;
  keyId: string;
}

export interface MessageIntegrity {
  hash: string;
  signature: string;
  verified: boolean;
}

class EncryptionService {
  private keyPairs: Map<string, EncryptionKeys> = new Map();
  private sharedSecrets: Map<string, string> = new Map();

  // Generate key pair for user
  async generateKeyPair(userId: string): Promise<EncryptionKeys> {
    try {
      // In a real implementation, use proper RSA key generation
      // For demo, we'll use a simplified approach
      const privateKey = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        `${userId}_${Date.now()}_private`
      );
      
      const publicKey = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        `${userId}_${Date.now()}_public`
      );

      const keyPair: EncryptionKeys = {
        privateKey,
        publicKey,
      };

      this.keyPairs.set(userId, keyPair);
      return keyPair;
    } catch (error) {
      console.error('Key generation failed:', error);
      throw new Error('Failed to generate encryption keys');
    }
  }

  // Generate shared secret for chat
  async generateSharedSecret(chatId: string, participants: string[]): Promise<string> {
    try {
      const combinedKeys = participants
        .map(userId => this.keyPairs.get(userId)?.publicKey || '')
        .join('');
      
      const sharedSecret = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        `${chatId}_${combinedKeys}_${Date.now()}`
      );

      this.sharedSecrets.set(chatId, sharedSecret);
      return sharedSecret;
    } catch (error) {
      console.error('Shared secret generation failed:', error);
      throw new Error('Failed to generate shared secret');
    }
  }

  // Encrypt message
  async encryptMessage(
    message: string,
    chatId: string,
    senderId: string
  ): Promise<EncryptedMessage> {
    try {
      const sharedSecret = this.sharedSecrets.get(chatId);
      if (!sharedSecret) {
        throw new Error('No shared secret found for chat');
      }

      // Generate random IV
      const iv = CryptoJS.lib.WordArray.random(16).toString();
      
      // Encrypt message
      const encrypted = CryptoJS.AES.encrypt(message, sharedSecret, {
        iv: CryptoJS.enc.Hex.parse(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });

      // Create signature for integrity
      const messageData = `${encrypted.toString()}_${iv}_${Date.now()}`;
      const signature = CryptoJS.HmacSHA256(messageData, sharedSecret).toString();

      return {
        encryptedContent: encrypted.toString(),
        iv,
        signature,
        timestamp: Date.now(),
        keyId: chatId,
      };
    } catch (error) {
      console.error('Message encryption failed:', error);
      throw new Error('Failed to encrypt message');
    }
  }

  // Decrypt message
  async decryptMessage(
    encryptedMessage: EncryptedMessage,
    chatId: string
  ): Promise<{ message: string; verified: boolean }> {
    try {
      const sharedSecret = this.sharedSecrets.get(chatId);
      if (!sharedSecret) {
        throw new Error('No shared secret found for chat');
      }

      // Verify signature first
      const messageData = `${encryptedMessage.encryptedContent}_${encryptedMessage.iv}_${encryptedMessage.timestamp}`;
      const expectedSignature = CryptoJS.HmacSHA256(messageData, sharedSecret).toString();
      const verified = expectedSignature === encryptedMessage.signature;

      if (!verified) {
        console.warn('Message signature verification failed');
      }

      // Decrypt message
      const decrypted = CryptoJS.AES.decrypt(encryptedMessage.encryptedContent, sharedSecret, {
        iv: CryptoJS.enc.Hex.parse(encryptedMessage.iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });

      const message = decrypted.toString(CryptoJS.enc.Utf8);
      
      if (!message) {
        throw new Error('Failed to decrypt message');
      }

      return { message, verified };
    } catch (error) {
      console.error('Message decryption failed:', error);
      throw new Error('Failed to decrypt message');
    }
  }

  // Verify message integrity
  async verifyMessageIntegrity(
    message: string,
    signature: string,
    chatId: string
  ): Promise<boolean> {
    try {
      const sharedSecret = this.sharedSecrets.get(chatId);
      if (!sharedSecret) {
        return false;
      }

      const expectedSignature = CryptoJS.HmacSHA256(message, sharedSecret).toString();
      return expectedSignature === signature;
    } catch (error) {
      console.error('Message verification failed:', error);
      return false;
    }
  }

  // Get encryption status for chat
  isEncryptionEnabled(chatId: string): boolean {
    return this.sharedSecrets.has(chatId);
  }

  // Enable encryption for chat
  async enableEncryption(chatId: string, participants: string[]): Promise<void> {
    if (!this.isEncryptionEnabled(chatId)) {
      await this.generateSharedSecret(chatId, participants);
    }
  }

  // Disable encryption for chat
  disableEncryption(chatId: string): void {
    this.sharedSecrets.delete(chatId);
  }

  // Get key fingerprint for verification
  async getKeyFingerprint(userId: string): Promise<string> {
    const keyPair = this.keyPairs.get(userId);
    if (!keyPair) {
      throw new Error('No key pair found for user');
    }

    return await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      keyPair.publicKey
    );
  }

  // Export keys for backup
  exportKeys(userId: string): EncryptionKeys | null {
    return this.keyPairs.get(userId) || null;
  }

  // Import keys from backup
  importKeys(userId: string, keys: EncryptionKeys): void {
    this.keyPairs.set(userId, keys);
  }

  // Clear all keys (for logout)
  clearAllKeys(): void {
    this.keyPairs.clear();
    this.sharedSecrets.clear();
  }
}

export default new EncryptionService();
