import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import cloudinary from '@/lib/cloudinary';

export async function GET() {
  try {
    // Warm up MongoDB connection
    await dbConnect();
    
    // Warm up Cloudinary by checking configuration
    const cloudinaryResult = await cloudinary.api.ping();
    
    return NextResponse.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      message: 'Vaishnavi Complaints Corner is running!',
      services: {
        mongodb: 'connected',
        cloudinary: cloudinaryResult.status === 'ok' ? 'connected' : 'disconnected'
      }
    });
  } catch (error) {
    console.error('Ping error:', error);
    return NextResponse.json({ 
      status: 'partial', 
      timestamp: new Date().toISOString(),
      message: 'Some services may be starting up...',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 200 }); // Still return 200 to keep the service alive
  }
}
