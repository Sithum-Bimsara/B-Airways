import { NextResponse } from 'next/server';
import { verifyToken } from '../../lib/auth';

export async function GET(request: Request) {
  try {
    const cookie = request.headers.get('cookie');
    if (!cookie) {
      return NextResponse.json({ message: 'Not authenticated.' }, { status: 401 });
    }

    const token = cookie
      .split(';')
      .find(c => c.trim().startsWith('auth='))
      ?.split('=')[1];

    if (!token) {
      return NextResponse.json({ message: 'Not authenticated.' }, { status: 401 });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ message: 'Invalid token.' }, { status: 401 });
    }

    return NextResponse.json({ 
      username: decoded.username, 
      role: decoded.role,
      userId: decoded.userId 
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({ message: 'Internal Server Error.' }, { status: 500 });
  }
}