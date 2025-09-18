@echo off
echo 🚀 JobSeeker API Integration Setup
echo ==================================

REM Check if config.js already exists
if exist "config.js" (
    echo ⚠️  config.js already exists. Backing up to config.js.backup
    copy "config.js" "config.js.backup" >nul
)

REM Copy template to config.js
if exist "config-template.js" (
    copy "config-template.js" "config.js" >nul
    echo ✅ Created config.js from template
) else (
    echo ❌ config-template.js not found!
    pause
    exit /b 1
)

echo.
echo 📋 Next Steps:
echo 1. Open config.js in your editor
echo 2. Choose an API provider:
echo    • Adzuna (Recommended): https://developer.adzuna.com/
echo    • JSearch (RapidAPI): https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch/
echo    • Reed (UK only): https://www.reed.co.uk/developers/
echo 3. Get your API keys and update config.js
echo 4. Set enabled: true for your chosen API
echo 5. Open index.html and uncomment the config.js script tag
echo.
echo 📖 For detailed instructions, see API_SETUP_GUIDE.md
echo.
echo 🎉 Setup complete! Happy job hunting!
pause
