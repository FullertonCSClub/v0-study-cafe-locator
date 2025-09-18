# Study Café Locator - Setup Guide

## 🔧 Environment Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Google Maps API Setup

1. **Get a Google Maps API Key**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/google/maps-apis)
   - Create a new project or select an existing one
   - Enable the following APIs:
     - Maps JavaScript API
     - Places API (for search functionality)
     - Geocoding API (for address search)

2. **Configure Environment Variables**:
   - Copy `.env.example` to `.env.local`:
     ```bash
     cp .env.example .env.local
     ```
   - Edit `.env.local` and replace `YOUR_API_KEY_HERE` with your actual API key:
     ```
     NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
     ```

### 3. Run the Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 🔒 Security Notes

- ✅ `.env.local` is already in `.gitignore` - your API key won't be committed
- ✅ Never commit real API keys to version control
- ✅ Use environment variables for all sensitive configuration
- ✅ The app gracefully falls back to demo mode when no API key is provided

## 🗺️ Map Functionality

- **With API Key**: Full Google Maps integration with real-time data
- **Without API Key**: Demo mode with fallback map visualization
- **Features**: Interactive maps, cafe markers, search, and location services

## 🚀 Deployment

For production deployment, set the environment variable in your hosting platform:
- Vercel: Add `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` in project settings
- Netlify: Add environment variable in site settings
- Other platforms: Follow their environment variable configuration guide
