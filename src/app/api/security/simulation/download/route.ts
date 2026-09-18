import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  if (process.env.BLACKOUT_SIMULATION_ENABLED !== 'true') {
    return new NextResponse('Simulation disabled', { status: 403 });
  }

  try {
    const filePath = path.join(process.cwd(), 'public', 'security', 'MOSAIC_Product_Catalog_2026.pdf');
    
    // Read the static PDF file
    const fileBuffer = fs.readFileSync(filePath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Length': fileBuffer.length.toString(),
        'Content-Disposition': 'attachment; filename="MOSAIC_Product_Catalog_2026.pdf"',
      },
    });
  } catch (error) {
    console.error('Failed to serve static PDF:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
