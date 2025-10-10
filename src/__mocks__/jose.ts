// Mock implementation of jose library for testing

export class SignJWT {
  private payload: Record<string, unknown>;
  private protectedHeader: Record<string, unknown> = {};
  private issuedAt: boolean = false;
  private expirationTime: string | null = null;

  constructor(payload: Record<string, unknown>) {
    this.payload = payload;
  }

  setProtectedHeader(header: Record<string, unknown>) {
    this.protectedHeader = header;
    return this;
  }

  setIssuedAt() {
    this.issuedAt = true;
    return this;
  }

  setExpirationTime(exp: string) {
    this.expirationTime = exp;
    return this;
  }

  async sign(): Promise<string> {
    // Create a simple mock JWT token with current timestamp to ensure uniqueness
    const now = Date.now();
    const header = Buffer.from(JSON.stringify(this.protectedHeader)).toString('base64');
    const payload = Buffer.from(JSON.stringify({
      ...this.payload,
      iat: this.issuedAt ? Math.floor(now / 1000) : undefined,
      exp: this.expirationTime ? Math.floor(now / 1000) + 7 * 24 * 60 * 60 : undefined,
    })).toString('base64');
    // Use timestamp in signature to make tokens unique
    const signature = Buffer.from(`mock-signature-${now}`).toString('base64');
    
    return `${header}.${payload}.${signature}`;
  }
}

export async function jwtVerify(token: string): Promise<{ payload: Record<string, unknown> }> {
  // Split the token
  const parts = token.split('.');
  
  if (parts.length !== 3) {
    throw new Error('Invalid token format');
  }

  // Check if token is tampered (mock check)
  // If the signature doesn't start with "bW9jay1zaWduYXR1cmU" (base64 for "mock-signature")
  // it means the token was tampered
  if (!parts[2].startsWith('bW9jay1zaWduYXR1cmU')) {
    throw new Error('signature verification failed');
  }

  // Decode the payload
  try {
    const payloadStr = Buffer.from(parts[1], 'base64').toString('utf-8');
    const payload = JSON.parse(payloadStr);

    // Check expiration
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      throw new Error('token has expired');
    }

    return { payload };
  } catch (error) {
    if (error instanceof Error && (error.message.includes('expired') || error.message.includes('verification'))) {
      throw error;
    }
    throw new Error('Invalid token');
  }
}
