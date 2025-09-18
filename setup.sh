#!/bin/bash
# Quick Setup Script for JobSeeker API Integration

echo "🚀 JobSeeker API Integration Setup"
echo "=================================="

# Check if config.js already exists
if [ -f "config.js" ]; then
    echo "⚠️  config.js already exists. Backing up to config.js.backup"
    cp config.js config.js.backup
fi

# Copy template to config.js
if [ -f "config-template.js" ]; then
    cp config-template.js config.js
    echo "✅ Created config.js from template"
else
    echo "❌ config-template.js not found!"
    exit 1
fi

echo ""
echo "📋 Next Steps:"
echo "1. Open config.js in your editor"
echo "2. Choose an API provider:"
echo "   • Adzuna (Recommended): https://developer.adzuna.com/"
echo "   • JSearch (RapidAPI): https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch/"
echo "   • Reed (UK only): https://www.reed.co.uk/developers/"
echo "3. Get your API keys and update config.js"
echo "4. Set enabled: true for your chosen API"
echo "5. Open index.html and uncomment the config.js script tag"
echo ""
echo "📖 For detailed instructions, see API_SETUP_GUIDE.md"
echo ""
echo "🎉 Setup complete! Happy job hunting!"
