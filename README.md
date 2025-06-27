# Vaishnavi Complaints Corner

A Next.js application with MongoDB backend for managing complaints with interactive notes and pins.

## Features

- 🦋 Beautiful butterfly cursor throughout the app
- 📝 Interactive note-taking with MongoDB persistence
- 📌 Pin management system
- 🔒 Simple authentication system
- ☁️ Cloud database with MongoDB Atlas

## Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure MongoDB Atlas (REQUIRED)

**CRITICAL**: Your IP must be whitelisted in MongoDB Atlas or the app won't work.

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Login → Network Access → Add IP Address
3. Add your current IP or `0.0.0.0/0` for all IPs
4. Confirm and wait 1-2 minutes

### 3. Run Development Server

```bash
pnpm dev
```

Visit: [http://localhost:3001](http://localhost:3001) 3. Open http://localhost:3000 4. Enter secret code: `vaisH@206`

### Option 2: Manual Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## New Features ✨

- **MongoDB Integration**: All data stored in cloud database
- **File Upload**: Upload images and videos directly in notes
- **Cloudinary CDN**: Fast media delivery and optimization
- **Auto Migration**: Existing localStorage data automatically migrated

## Login

Secret Code: `vaisH@206`

## Environment

All environment variables are pre-configured:

- MongoDB Atlas connection
- Cloudinary API keys
- Next.js settings

## File Uploads

- **Supported**: Images (JPG, PNG, GIF, WebP) and Videos (MP4, WebM, MOV)
- **Size Limit**: 10MB per file
- **Methods**: Drag & drop, file browser, or URL input

## Data Storage

- **Database**: MongoDB Atlas (cloud)
- **Media**: Cloudinary CDN
- **Backup**: Original localStorage data preserved

For detailed setup instructions, see `SETUP_GUIDE.md`
