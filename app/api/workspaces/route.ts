import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Workspace, Note, Pin } from '@/lib/models';

// GET - Fetch all workspaces
export async function GET() {
  try {
    await dbConnect();
    
    const workspaces = await Workspace.find({}).sort({ updatedAt: -1 });
    
    // Populate each workspace with its notes and pins
    const populatedWorkspaces = await Promise.all(
      workspaces.map(async (workspace) => {
        const notes = await Note.find({ workspaceId: workspace.id });
        const pins = await Pin.find({ workspaceId: workspace.id });
        
        return {
          id: workspace.id,
          name: workspace.name,
          notes: notes.map(note => ({
            id: note.id,
            components: note.components,
            color: note.color,
            x: note.x,
            y: note.y,
            width: note.width,
            height: note.height,
            severity: note.severity,
            scoldingType: note.scoldingType,
            customScolding: note.customScolding,
            pinId: note.pinId,
            reactions: note.reactions,
            comments: note.comments,
            commentsExpanded: note.commentsExpanded,
            timestamp: note.timestamp
          })),
          pins: pins.map(pin => ({
            id: pin.id,
            name: pin.name,
            x: pin.x,
            y: pin.y,
            color: pin.color,
            clubbedNoteIds: pin.clubbedNoteIds
          }))
        };
      })
    );
    
    return NextResponse.json(populatedWorkspaces);
  } catch (error) {
    console.error('Error fetching workspaces:', error);
    return NextResponse.json({ error: 'Failed to fetch workspaces' }, { status: 500 });
  }
}

// POST - Create a new workspace
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const { name } = await request.json();
    
    if (!name) {
      return NextResponse.json({ error: 'Workspace name is required' }, { status: 400 });
    }
    
    const workspaceId = `workspace_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const workspace = new Workspace({
      id: workspaceId,
      name,
      notes: [],
      pins: []
    });
    
    await workspace.save();
    
    return NextResponse.json({
      id: workspace.id,
      name: workspace.name,
      notes: [],
      pins: []
    });
  } catch (error) {
    console.error('Error creating workspace:', error);
    return NextResponse.json({ error: 'Failed to create workspace' }, { status: 500 });
  }
}

// DELETE - Delete a workspace
export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get('id');
    
    if (!workspaceId) {
      return NextResponse.json({ error: 'Workspace ID is required' }, { status: 400 });
    }
    
    // Delete all notes in this workspace
    await Note.deleteMany({ workspaceId });
    
    // Delete all pins in this workspace
    await Pin.deleteMany({ workspaceId });
    
    // Delete the workspace itself
    const deletedWorkspace = await Workspace.findOneAndDelete({ id: workspaceId });
    
    if (!deletedWorkspace) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Workspace deleted successfully' });
  } catch (error) {
    console.error('Error deleting workspace:', error);
    return NextResponse.json({ error: 'Failed to delete workspace' }, { status: 500 });
  }
}
