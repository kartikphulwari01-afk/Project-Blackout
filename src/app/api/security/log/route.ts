import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { analyzeEvent } from '@/security/detection';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Log the event explicitly passed
    if (body.type && body.severity) {
      const event = await prisma.securityEvent.create({
        data: {
          type: body.type,
          severity: body.severity,
          source: body.source || 'API',
          sessionId: body.sessionId,
          metadata: body.metadata ? JSON.stringify(body.metadata) : null,
          status: 'LOGGED'
        }
      });
      return NextResponse.json({ success: true, event });
    }

    // 2. Or pass a generic payload through the Detection Engine
    const detection = analyzeEvent(body);
    if (detection) {
      const event = await prisma.securityEvent.create({
        data: {
          type: detection.type,
          severity: detection.severity,
          source: detection.source,
          metadata: detection.metadata ? JSON.stringify(detection.metadata) : null,
        }
      });
      return NextResponse.json({ success: true, threatDetected: true, event });
    }

    return NextResponse.json({ success: true, threatDetected: false });
  } catch (error) {
    console.error('Failed to log security event:', error);
    return NextResponse.json({ error: 'Failed to log event' }, { status: 500 });
  }
}
