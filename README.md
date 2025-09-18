# JobSeeker - Job Search Application

A modern, responsive job search application with real API integration support.

## Features

- 🔍 **Smart Job Search**: Search by keywords, location, salary range, and job type
- 💾 **Favorites System**: Save interesting jobs for later review
- 📄 **Application Tracking**: Track your job applications and their status
- 📋 **Resume Upload**: Upload and manage your resume
- 🌙 **Dark Theme**: Minimal, modern dark interface
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile

## Supported APIs

- **Adzuna API** (Global coverage, recommended)
- **JSearch API** (RapidAPI platform, easy setup)
- **Reed API** (UK focused, free)

## Quick Start

### Option 1: Use with Demo Data (No setup required)
1. Open `index.html` in your browser
2. Start searching! The app will use demo data

### Option 2: Integrate Real APIs
1. Run the setup script:
   - **Windows**: Double-click `setup.bat`
   - **Mac/Linux**: Run `./setup.sh`
2. Follow the instructions in `API_SETUP_GUIDE.md`
3. Configure your API keys in `config.js`
4. Uncomment the config.js script tag in `index.html`

## Files Overview

- `index.html` - Main application interface
- `styles.css` - Dark theme styling
- `script.js` - Application logic with API integration
- `config-template.js` - API configuration template
- `API_SETUP_GUIDE.md` - Detailed API setup instructions
- `setup.bat` / `setup.sh` - Quick setup scripts

## API Configuration

Create a `config.js` file based on `config-template.js`:

```javascript
window.API_CONFIG = {
    adzuna: {
        appId: 'YOUR_APP_ID',
        apiKey: 'YOUR_API_KEY',
        enabled: true,
        country: 'us'
    }
    // ... other APIs
};
```

## Getting API Keys

### Adzuna (Recommended)
1. Visit https://developer.adzuna.com/
2. Sign up for free developer account
3. Create new app to get App ID and API Key
4. Free tier: 1,000 calls/month

### JSearch (RapidAPI)
1. Visit https://rapidapi.com/
2. Subscribe to JSearch API
3. Copy your RapidAPI key
4. Free tier: 100 requests/month

### Reed (UK Jobs)
1. Visit https://www.reed.co.uk/developers/
2. Register for developer account
3. Get API key from dashboard
4. Free with generous limits

## Development

The application is built with vanilla JavaScript, HTML5, and CSS3. No build process required.

### Key Components
- `JobSearchApp` class handles all functionality
- Modular API integration with fallback to demo data
- Local storage for persistence
- Responsive CSS Grid and Flexbox layouts

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Security Notes

⚠️ **Client-side API keys are visible to users**. For production:
- Move API calls to backend server
- Use environment variables
- Implement proper authentication

## License

MIT License - Feel free to use and modify for your projects.

## Support

See `API_SETUP_GUIDE.md` for troubleshooting and detailed setup instructions.
