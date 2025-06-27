import mongoose, { Schema, Document } from 'mongoose';

// Comment Interface and Schema
export interface IComment extends Document {
  id: string;
  text: string;
  author: string;
  timestamp: number;
  reactions: Array<{ emoji: string; count: number }>;
}

const CommentSchema = new Schema<IComment>({
  id: { type: String, required: true },
  text: { type: String, required: true },
  author: { type: String, required: true },
  timestamp: { type: Number, required: true },
  reactions: [{
    emoji: { type: String, required: true },
    count: { type: Number, default: 0 }
  }]
});

// Note Component Interface and Schema
export interface INoteComponent extends Document {
  type: "title" | "text" | "video" | "image" | "divider";
  content: string;
  order: number;
  color?: string;
}

const NoteComponentSchema = new Schema<INoteComponent>({
  type: { 
    type: String, 
    enum: ["title", "text", "video", "image", "divider"], 
    required: true 
  },
  content: { type: String, required: true },
  order: { type: Number, required: true },
  color: { type: String }
});

// Note Interface and Schema
export interface INote extends Document {
  id: string;
  components: INoteComponent[];
  color: string;
  x: number;
  y: number;
  width: number;
  height: number;
  severity: "mild" | "moderate" | "serious" | "critical" | "nuclear";
  scoldingType: "custom" | "bolimaga" | "horri" | "nin_saaya" | "nin_bojja";
  customScolding?: string;
  pinId?: string;
  reactions: Array<{ emoji: string; count: number }>;
  comments: IComment[];
  commentsExpanded: boolean;
  timestamp: number;
  workspaceId: string;
}

const NoteSchema = new Schema<INote>({
  id: { type: String, required: true, unique: true },
  components: [NoteComponentSchema],
  color: { type: String, required: true },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  severity: { 
    type: String, 
    enum: ["mild", "moderate", "serious", "critical", "nuclear"], 
    required: true 
  },
  scoldingType: { 
    type: String, 
    enum: ["custom", "bolimaga", "horri", "nin_saaya", "nin_bojja"], 
    required: true 
  },
  customScolding: { type: String },
  pinId: { type: String },
  reactions: [{
    emoji: { type: String, required: true },
    count: { type: Number, default: 0 }
  }],
  comments: [CommentSchema],
  commentsExpanded: { type: Boolean, default: false },
  timestamp: { type: Number, required: true },
  workspaceId: { type: String, required: true }
}, {
  timestamps: true
});

// Pin Interface and Schema
export interface IPin extends Document {
  id: string;
  name: string;
  x: number;
  y: number;
  color: string;
  clubbedNoteIds: string[];
  workspaceId: string;
}

const PinSchema = new Schema<IPin>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  color: { type: String, required: true },
  clubbedNoteIds: [{ type: String }],
  workspaceId: { type: String, required: true }
}, {
  timestamps: true
});

// Workspace Interface and Schema
export interface IWorkspace extends Document {
  id: string;
  name: string;
  notes: string[]; // Array of note IDs
  pins: string[];  // Array of pin IDs
  createdAt: Date;
  updatedAt: Date;
}

const WorkspaceSchema = new Schema<IWorkspace>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  notes: [{ type: String }],
  pins: [{ type: String }]
}, {
  timestamps: true
});

// Models
export const Note = mongoose.models.Note || mongoose.model<INote>('Note', NoteSchema);
export const Pin = mongoose.models.Pin || mongoose.model<IPin>('Pin', PinSchema);
export const Workspace = mongoose.models.Workspace || mongoose.model<IWorkspace>('Workspace', WorkspaceSchema);
