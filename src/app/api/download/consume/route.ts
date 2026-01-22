
import { NextRequest, NextResponse } from 'next/server';
import { consumeDownloadToken, validateDownloadToken } from '@/lib/services/download';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { token } = body;

        if (!token) {
            return NextResponse.json({ error: 'Token required' }, { status: 400 });
        }

        // 1. Re-validate
        const { valid, error } = await validateDownloadToken(token);
        if (!valid) {
            return NextResponse.json({ error: error || 'Invalid token' }, { status: 403 });
        }

        // 2. Consume (Increment Count)
        const { success } = await consumeDownloadToken(token);

        if (!success) {
            return NextResponse.json({ error: 'Failed to record download' }, { status: 500 });
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Download consume error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
