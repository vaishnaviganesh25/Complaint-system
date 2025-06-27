import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';

export async function GET() {
  try {
    console.log('Testing MongoDB connection...');
    const connection = await dbConnect();
    
    if (connection) {
      return NextResponse.json({ 
        status: 'success', 
        message: 'MongoDB connected successfully',
        readyState: connection.connection.readyState,
        dbName: connection.connection.name
      });
    } else {
      return NextResponse.json({ 
        status: 'error', 
        message: 'Failed to establish MongoDB connection' 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('MongoDB connection test failed:', error);
    return NextResponse.json({ 
      status: 'error', 
      message: 'MongoDB connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
