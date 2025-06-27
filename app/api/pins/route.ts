import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Pin, Workspace } from '@/lib/models';

// POST - Create a new pin
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const pinData = await request.json();
    
    if (!pinData.workspaceId) {
      return NextResponse.json({ error: 'Workspace ID is required' }, { status: 400 });
    }
    
    const pin = new Pin(pinData);
    
    await pin.save();
    
    // Update workspace to include this pin ID
    await Workspace.findOneAndUpdate(
      { id: pinData.workspaceId },
      { $addToSet: { pins: pin.id } }
    );
    
    return NextResponse.json({
      id: pin.id,
      name: pin.name,
      x: pin.x,
      y: pin.y,
      color: pin.color,
      clubbedNoteIds: pin.clubbedNoteIds
    });
  } catch (error) {
    console.error('Error creating pin:', error);
    return NextResponse.json({ error: 'Failed to create pin' }, { status: 500 });
  }
}

// PUT - Update a pin
export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    
    const pinData = await request.json();
    
    if (!pinData.id) {
      return NextResponse.json({ error: 'Pin ID is required' }, { status: 400 });
    }
    
    const updatedPin = await Pin.findOneAndUpdate(
      { id: pinData.id },
      pinData,
      { new: true }
    );
    
    if (!updatedPin) {
      return NextResponse.json({ error: 'Pin not found' }, { status: 404 });
    }
    
    return NextResponse.json({
      id: updatedPin.id,
      name: updatedPin.name,
      x: updatedPin.x,
      y: updatedPin.y,
      color: updatedPin.color,
      clubbedNoteIds: updatedPin.clubbedNoteIds
    });
  } catch (error) {
    console.error('Error updating pin:', error);
    return NextResponse.json({ error: 'Failed to update pin' }, { status: 500 });
  }
}

// DELETE - Delete a pin
export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const pinId = searchParams.get('id');
    const workspaceId = searchParams.get('workspaceId');
    
    if (!pinId || !workspaceId) {
      return NextResponse.json({ error: 'Pin ID and Workspace ID are required' }, { status: 400 });
    }
    
    const deletedPin = await Pin.findOneAndDelete({ id: pinId });
    
    if (!deletedPin) {
      return NextResponse.json({ error: 'Pin not found' }, { status: 404 });
    }
    
    // Remove pin ID from workspace
    await Workspace.findOneAndUpdate(
      { id: workspaceId },
      { $pull: { pins: pinId } }
    );
    
    return NextResponse.json({ message: 'Pin deleted successfully' });
  } catch (error) {
    console.error('Error deleting pin:', error);
    return NextResponse.json({ error: 'Failed to delete pin' }, { status: 500 });
  }
}
