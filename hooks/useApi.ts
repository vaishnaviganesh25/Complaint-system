import { useState, useEffect } from 'react';

interface Workspace {
  id: string;
  name: string;
  notes: any[];
  pins: any[];
}

interface Note {
  id: string;
  components: any[];
  color: string;
  x: number;
  y: number;
  width: number;
  height: number;
  severity: string;
  scoldingType: string;
  customScolding?: string;
  pinId?: string;
  reactions: any[];
  comments: any[];
  commentsExpanded: boolean;
  timestamp: number;
  workspaceId: string;
}

interface Pin {
  id: string;
  name: string;
  x: number;
  y: number;
  color: string;
  clubbedNoteIds: string[];
  workspaceId: string;
}

export function useWorkspaces() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkspaces = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/workspaces', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(30000) // 30 seconds for MongoDB
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setWorkspaces(data);
      return data;
    } catch (err) {
      console.error('Error fetching workspaces from MongoDB:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect to MongoDB';
      setError(errorMessage);
      
      // Fallback to localStorage when MongoDB is not available
      console.log('Falling back to localStorage...');
      const fallbackData = getFallbackWorkspaces();
      setWorkspaces(fallbackData);
      return fallbackData;
    } finally {
      setLoading(false);
    }
  };

  const getFallbackWorkspaces = () => {
    try {
      const stored = localStorage.getItem('vaishnavi-workspaces');
      if (stored) {
        return JSON.parse(stored);
      }
      
      // Create default workspace if none exists
      const defaultWorkspace = {
        id: 'default-workspace',
        name: 'My Workspace',
        notes: [],
        pins: []
      };
      
      localStorage.setItem('vaishnavi-workspaces', JSON.stringify([defaultWorkspace]));
      return [defaultWorkspace];
    } catch (error) {
      console.error('Error with localStorage fallback:', error);
      return [{
        id: 'default-workspace',
        name: 'My Workspace',
        notes: [],
        pins: []
      }];
    }
  };

  const saveFallbackWorkspaces = (workspaces: Workspace[]) => {
    try {
      localStorage.setItem('vaishnavi-workspaces', JSON.stringify(workspaces));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  const createWorkspace = async (name: string) => {
    try {
      const response = await fetch('/api/workspaces', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
        signal: AbortSignal.timeout(30000)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const newWorkspace = await response.json();
      setWorkspaces(prev => [...prev, newWorkspace]);
      return newWorkspace;
    } catch (err) {
      console.error('Error creating workspace:', err);
      
      // Fallback to localStorage
      console.log('Creating workspace with localStorage fallback...');
      const newWorkspace = {
        id: `workspace_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name,
        notes: [],
        pins: []
      };
      
      const updatedWorkspaces = [...workspaces, newWorkspace];
      setWorkspaces(updatedWorkspaces);
      saveFallbackWorkspaces(updatedWorkspaces);
      return newWorkspace;
    }
  };

  const deleteWorkspace = async (workspaceId: string) => {
    try {
      const response = await fetch(`/api/workspaces?id=${workspaceId}`, {
        method: 'DELETE',
        signal: AbortSignal.timeout(30000)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      setWorkspaces(prev => prev.filter(w => w.id !== workspaceId));
    } catch (err) {
      console.error('Error deleting workspace:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  return {
    workspaces,
    loading,
    error,
    setWorkspaces,
    fetchWorkspaces,
    createWorkspace,
    deleteWorkspace,
  };
}

export function useNotes() {
  const createNote = async (noteData: Partial<Note> & { workspaceId: string }) => {
    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(noteData),
        signal: AbortSignal.timeout(30000)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (err) {
      console.error('Error creating note:', err);
      // Fallback: return the note data as created (will be handled by local state)
      return { ...noteData, id: noteData.id || Date.now().toString() };
    }
  };

  const updateNote = async (noteData: Partial<Note> & { id: string }) => {
    try {
      const response = await fetch('/api/notes', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(noteData),
        signal: AbortSignal.timeout(30000)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (err) {
      console.error('Error updating note:', err);
      // Fallback: return the updated data (will be handled by local state)
      return noteData;
    }
  };

  const deleteNote = async (noteId: string, workspaceId: string) => {
    try {
      const response = await fetch(`/api/notes?id=${noteId}&workspaceId=${workspaceId}`, {
        method: 'DELETE',
        signal: AbortSignal.timeout(30000)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (err) {
      console.error('Error deleting note:', err);
      // Fallback: return success (will be handled by local state)
      return { success: true };
    }
  };

  return {
    createNote,
    updateNote,
    deleteNote,
  };
}

export function usePins() {
  const createPin = async (pinData: Partial<Pin> & { workspaceId: string }) => {
    try {
      const response = await fetch('/api/pins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pinData),
        signal: AbortSignal.timeout(30000)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (err) {
      console.error('Error creating pin:', err);
      // Fallback: return the pin data as created
      return { ...pinData, id: pinData.id || Date.now().toString() };
    }
  };

  const updatePin = async (pinData: Partial<Pin> & { id: string }) => {
    try {
      const response = await fetch('/api/pins', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pinData),
        signal: AbortSignal.timeout(30000)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (err) {
      console.error('Error updating pin:', err);
      // Fallback: return the updated data
      return pinData;
    }
  };

  const deletePin = async (pinId: string, workspaceId: string) => {
    try {
      const response = await fetch(`/api/pins?id=${pinId}&workspaceId=${workspaceId}`, {
        method: 'DELETE',
        signal: AbortSignal.timeout(30000)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (err) {
      console.error('Error deleting pin:', err);
      // Fallback: return success
      return { success: true };
    }
  };

  return {
    createPin,
    updatePin,
    deletePin,
  };
}

export function useFileUpload() {
  const [uploading, setUploading] = useState(false);

  const uploadFile = async (file: File) => {
    try {
      setUploading(true);
      
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        signal: AbortSignal.timeout(60000) // 60 seconds for file upload
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return result;
    } catch (err) {
      console.error('Error uploading file:', err);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadFile,
    uploading,
  };
}