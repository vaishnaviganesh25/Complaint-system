import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Note, Workspace } from '@/lib/models';

// POST - Create a new note
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const noteData = await request.json();
    
    if (!noteData.workspaceId) {
      return NextResponse.json({ error: 'Workspace ID is required' }, { status: 400 });
    }
    
    const note = new Note({
      ...noteData,
      timestamp: Date.now()
    });
    
    await note.save();
    
    // Update workspace to include this note ID
    await Workspace.findOneAndUpdate(
      { id: noteData.workspaceId },
      { $addToSet: { notes: note.id } }
    );
    
    return NextResponse.json({
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
    });
  } catch (error) {
    console.error('Error creating note:', error);
    return NextResponse.json({ error: 'Failed to create note' }, { status: 500 });
  }
}

// PUT - Update a note
export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    
    const noteData = await request.json();
    
    if (!noteData.id) {
      return NextResponse.json({ error: 'Note ID is required' }, { status: 400 });
    }
    
    const updatedNote = await Note.findOneAndUpdate(
      { id: noteData.id },
      noteData,
      { new: true }
    );
    
    if (!updatedNote) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }
    
    return NextResponse.json({
      id: updatedNote.id,
      components: updatedNote.components,
      color: updatedNote.color,
      x: updatedNote.x,
      y: updatedNote.y,
      width: updatedNote.width,
      height: updatedNote.height,
      severity: updatedNote.severity,
      scoldingType: updatedNote.scoldingType,
      customScolding: updatedNote.customScolding,
      pinId: updatedNote.pinId,
      reactions: updatedNote.reactions,
      comments: updatedNote.comments,
      commentsExpanded: updatedNote.commentsExpanded,
      timestamp: updatedNote.timestamp
    });
  } catch (error) {
    console.error('Error updating note:', error);
    return NextResponse.json({ error: 'Failed to update note' }, { status: 500 });
  }
}

// DELETE - Delete a note
export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const noteId = searchParams.get('id');
    const workspaceId = searchParams.get('workspaceId');
    
    if (!noteId || !workspaceId) {
      return NextResponse.json({ error: 'Note ID and Workspace ID are required' }, { status: 400 });
    }
    
    const deletedNote = await Note.findOneAndDelete({ id: noteId });
    
    if (!deletedNote) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }
    
    // Remove note ID from workspace
    await Workspace.findOneAndUpdate(
      { id: workspaceId },
      { $pull: { notes: noteId } }
    );
    
    return NextResponse.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Error deleting note:', error);
    return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 });
  }
}
