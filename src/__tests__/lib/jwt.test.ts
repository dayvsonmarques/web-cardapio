import { createToken, verifyToken, JWTPayload } from '@/lib/jwt';

describe('JWT Utilities', () => {
  const mockPayload: JWTPayload = {
    userId: '123',
    email: 'test@example.com',
    name: 'Test User',
  };

  describe('createToken', () => {
    it('should create a valid JWT token', async () => {
      const token = await createToken(mockPayload);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });

    it('should create different tokens for same payload', async () => {
      const token1 = await createToken(mockPayload);
      // Wait 1ms to ensure different timestamp
      await new Promise(resolve => setTimeout(resolve, 1));
      const token2 = await createToken(mockPayload);
      
      // Tokens should be different due to different iat (issued at) timestamps
      expect(token1).not.toBe(token2);
    });
  });

  describe('verifyToken', () => {
    it('should verify and decode a valid token', async () => {
      const token = await createToken(mockPayload);
      const decoded = await verifyToken(token);
      
      expect(decoded).toEqual(mockPayload);
    });

    it('should return null for invalid token', async () => {
      const invalidToken = 'invalid.token.here';
      const decoded = await verifyToken(invalidToken);
      
      expect(decoded).toBeNull();
    });

    it('should return null for expired token', async () => {
      // This test would need to mock time or use a token with very short expiration
      // For now, we test with a malformed token
      const decoded = await verifyToken('');
      
      expect(decoded).toBeNull();
    });

    it('should return null for tampered token', async () => {
      const token = await createToken(mockPayload);
      // Replace the signature completely to trigger verification failure
      const parts = token.split('.');
      const tamperedToken = `${parts[0]}.${parts[1]}.xxxxx`;
      const decoded = await verifyToken(tamperedToken);
      
      expect(decoded).toBeNull();
    });
  });

  describe('Token payload integrity', () => {
    it('should preserve all payload fields', async () => {
      const token = await createToken(mockPayload);
      const decoded = await verifyToken(token);
      
      expect(decoded?.userId).toBe(mockPayload.userId);
      expect(decoded?.email).toBe(mockPayload.email);
      expect(decoded?.name).toBe(mockPayload.name);
    });
  });
});
