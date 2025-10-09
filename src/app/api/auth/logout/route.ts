import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// POST /api/auth/logout - User logout
export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('auth-token');
    
    return NextResponse.json({
      message: 'Logout successful',
    });
  } catch (error) {
    console.error('Error during logout:', error);
    return NextResponse.json(
      { error: 'Failed to logout' },
      { status: 500 }
    );
  }
}
