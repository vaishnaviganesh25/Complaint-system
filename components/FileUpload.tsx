"use client"

import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, FileImage, FileVideo } from 'lucide-react';
import { useFileUpload } from '@/hooks/useApi';

interface FileUploadProps {
  onFileUploaded: (url: string, type: 'image' | 'video') => void;
  accept?: string;
  className?: string;
}

export function FileUpload({ onFileUploaded, accept = "image/*,video/*", className = "" }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const { uploadFile, uploading } = useFileUpload();

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Validate file type
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      alert('Please select an image or video file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    try {
      const result = await uploadFile(file);
      const fileType = file.type.startsWith('image/') ? 'image' : 'video';
      onFileUploaded(result.url, fileType);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload file. Please try again.');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={(e) => handleFileSelect(e.target.files)}
        style={{ display: 'none' }}
      />
      
      <div
        className={`
          border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors
          ${dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${uploading ? 'opacity-50 pointer-events-none' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        {uploading ? (
          <div className="flex flex-col items-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="text-sm text-gray-600">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <Upload className="h-8 w-8 text-gray-400" />
            <p className="text-sm text-gray-600">
              Drag & drop or click to upload
            </p>
            <p className="text-xs text-gray-400">
              Images and videos up to 10MB
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

interface MediaPreviewProps {
  url: string;
  type: 'image' | 'video';
  onRemove?: () => void;
  className?: string;
}

export function MediaPreview({ url, type, onRemove, className = "" }: MediaPreviewProps) {
  return (
    <div className={`relative group ${className}`}>
      {type === 'image' ? (
        <img 
          src={url} 
          alt="Uploaded content" 
          className="w-full h-auto rounded-lg object-cover"
        />
      ) : (
        <video 
          src={url} 
          controls 
          className="w-full h-auto rounded-lg"
        >
          Your browser does not support the video tag.
        </video>
      )}
      
      {onRemove && (
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      
      <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs flex items-center">
        {type === 'image' ? <FileImage className="h-3 w-3 mr-1" /> : <FileVideo className="h-3 w-3 mr-1" />}
        {type}
      </div>
    </div>
  );
}
