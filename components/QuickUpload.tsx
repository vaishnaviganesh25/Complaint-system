"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Image, Video, FileImage, FileVideo } from 'lucide-react';
import { useFileUpload } from '@/hooks/useApi';

interface QuickUploadProps {
  onImageUploaded: (url: string) => void;
  onVideoUploaded: (url: string) => void;
}

export function QuickUpload({ onImageUploaded, onVideoUploaded }: QuickUploadProps) {
  const { uploadFile, uploading } = useFileUpload();
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    try {
      const result = await uploadFile(file);
      
      if (file.type.startsWith('image/')) {
        onImageUploaded(result.url);
      } else if (file.type.startsWith('video/')) {
        onVideoUploaded(result.url);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload file. Please try again.');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleImageSelect = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) handleFileSelect(file);
    };
    input.click();
  };

  const handleVideoSelect = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) handleFileSelect(file);
    };
    input.click();
  };

  return (
    <div className="bg-pink-50/90 backdrop-blur-lg p-4 rounded-xl border-2 border-pink-200 shadow-lg">
      <h3 className="text-lg font-bold text-pink-600 mb-3 text-center">🚀 Quick Media Upload</h3>
      
      <div
        className={`
          border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${dragOver ? 'border-pink-500 bg-pink-100' : 'border-pink-300 bg-pink-50/50'}
          ${uploading ? 'opacity-50 pointer-events-none' : 'cursor-pointer hover:border-pink-400'}
        `}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={(e) => { e.preventDefault(); setDragOver(false); }}
        onDrop={handleDrop}
      >
        {uploading ? (
          <div className="flex flex-col items-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
            <p className="text-sm text-pink-600">Uploading to Cloudinary...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <Upload className="h-12 w-12 text-pink-400 mx-auto" />
            <p className="text-pink-600 font-medium">
              Drag & drop files here or use buttons below
            </p>
            
            <div className="flex gap-3 justify-center">
              <Button
                onClick={handleImageSelect}
                className="bg-pink-500 hover:bg-pink-600 text-white"
                disabled={uploading}
              >
                <FileImage className="h-4 w-4 mr-2" />
                Upload Image
              </Button>
              
              <Button
                onClick={handleVideoSelect}
                className="bg-pink-500 hover:bg-pink-600 text-white"
                disabled={uploading}
              >
                <FileVideo className="h-4 w-4 mr-2" />
                Upload Video
              </Button>
            </div>
            
            <p className="text-xs text-pink-400">
              Supports: JPG, PNG, GIF, MP4, WebM (max 10MB)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
