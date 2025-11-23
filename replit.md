# TuneDownload - Music Download Platform

## Overview
A modern web-based music download platform that allows users to convert and download audio from various streaming platforms (YouTube, SoundCloud, Spotify) in multiple formats (MP3, WAV, FLAC) with customizable quality settings.

## Current State
MVP implementation complete with:
- ✅ Full-stack TypeScript application
- ✅ Beautiful, responsive UI following design guidelines
- ✅ Download flow with progress tracking
- ✅ Search functionality
- ✅ Multiple format and quality options
- ✅ Real-time progress updates
- ✅ Error handling and loading states

## Project Structure

### Frontend (`client/src/`)
- **pages/home.tsx**: Main landing page with all sections
- **components/converter-card.tsx**: URL input and format selection
- **components/progress-indicator.tsx**: Real-time download progress
- **components/download-result.tsx**: Success/error state with download button
- **components/search-section.tsx**: Music search with results
- **components/features-grid.tsx**: Feature highlights
- **components/footer.tsx**: Footer with links

### Backend (`server/`)
- **routes.ts**: API endpoints for download, search, and file serving
- **storage.ts**: In-memory storage for download jobs and search history

### Shared (`shared/`)
- **schema.ts**: TypeScript types and Zod validation schemas

## API Endpoints

### POST /api/download
Creates a new download job and starts processing
- Body: `{ url: string, format: "mp3"|"wav"|"flac", quality: "128"|"320"|"lossless" }`
- Returns: DownloadJob object

### GET /api/download/:id
Gets the status of a download job with real-time progress
- Returns: DownloadJob object

### POST /api/search
Searches for music by title or artist
- Body: `{ query: string, platform?: "youtube"|"soundcloud"|"all" }`
- Returns: SearchResult[]

### GET /api/search/recent
Gets recent search queries
- Returns: string[]

### GET /api/files/:filename
Serves the downloaded file
- Returns: Audio file (simulated in MVP)

## Design System

### Colors (from design_guidelines.md)
- **Primary**: #FF6B6B (coral red) - CTAs and download buttons
- **Secondary**: #4ECDC4 (teal) - progress indicators
- **Background**: #F7F9FC (light blue-grey)
- **Accent**: #FFE66D (warm yellow)
- **Success**: #51CF66 (green)

### Typography
- **Headings**: Poppins (bold, semibold)
- **Body**: Inter (regular, medium)

### Components
- Uses Shadcn UI components with custom styling
- Follows elevation system for hover/active states
- Responsive design with mobile-first approach

## User Journeys

### Download Flow
1. User pastes URL in converter card
2. Selects format (MP3/WAV/FLAC) and quality
3. Clicks "Download Now"
4. Progress indicator shows real-time status
5. Download result displays with download button
6. User can download file or convert another

### Search Flow
1. User clicks "Search for Music"
2. Enters search query
3. Views results with thumbnails and metadata
4. Can click links to open in new tab

## Technical Notes

### MVP Simulation
For demonstration purposes, the current implementation:
- Simulates download progress with realistic timing
- Returns mock search results
- Serves placeholder audio files
- Platform detection works for YouTube, SoundCloud, Spotify

### Production Readiness
To make this production-ready, implement:
- Real YouTube/SoundCloud API integration (ytdl-core, soundcloud-downloader)
- Actual audio conversion (ffmpeg)
- File storage system (local or cloud storage)
- Rate limiting and authentication
- Legal compliance and copyright checks

## Recent Changes
- 2024-11-23: Initial MVP implementation with complete UI and backend simulation
- Design tokens configured for coral/teal color scheme
- All components built with exceptional visual quality
- Progress tracking and error handling implemented

## User Preferences
- Focus on visual excellence and user experience
- Clean, modern design inspired by Y2mate
- Responsive across all device sizes
- No registration required for basic usage
