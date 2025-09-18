# Local Server Setup Guide

To avoid CORS issues when testing the JobSeeker app with real APIs, you need to run a local server instead of opening the HTML file directly.

## Quick Options:

### Option 1: Python (if installed)
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```
Then visit: http://localhost:8000

### Option 2: Node.js (if installed)
```bash
# Install global server
npm install -g live-server

# Run in project directory
live-server
```

### Option 3: VS Code Live Server Extension
1. Install "Live Server" extension in VS Code
2. Right-click `index.html`
3. Select "Open with Live Server"

### Option 4: Chrome with CORS disabled (Development Only)
```bash
# Windows
chrome.exe --user-data-dir=/tmp/chrome_dev_test --disable-web-security

# Mac
open -n -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --user-data-dir="/tmp/chrome_dev_test" --disable-web-security

# Linux
google-chrome --disable-web-security --user-data-dir="/tmp/chrome_dev_test"
```

## Current API Status:

Your JobSeeker app is now configured with:
- ✅ **Adzuna API** (Primary): US job market, 1000 calls/month
- ⚠️ **JSearch API** (Backup): Disabled, ready to enable
- ❌ **Reed API** (Not configured): UK jobs

## Testing Steps:

1. **Start local server** (use any option above)
2. **Open the app** in your browser via the local server
3. **Look for the API status badge** in the top-right corner
4. **Click the badge** to test your API connection
5. **Try a job search** with keywords like "developer", "manager", etc.

## Troubleshooting:

### If you see "Demo Mode":
- Check that `config.js` is loaded correctly
- Verify API keys in the config file
- Check browser console for errors

### If you see CORS errors:
- Make sure you're using a local server, not file:// protocol
- Try the Chrome CORS-disabled option for testing
- Check that your API keys are valid

### If API test fails:
- Verify your Adzuna App ID and API Key are correct
- Check if you've exceeded rate limits (1000 calls/month free)
- Try searching with simpler keywords

## Success Indicators:

When working correctly, you should see:
- 🚀 "Live API: ADZUNA" badge in top-right
- Real job listings with company names and locations
- Console messages showing API requests and responses
- Ability to click through to actual job postings

Happy job hunting! 🎯
