# Job Search API Integration Guide

## Overview
This guide will help you integrate real job search APIs into your JobSeeker application. The app supports three major job search APIs:

1. **Adzuna API** (Recommended - Global coverage)
2. **JSearch API** (RapidAPI - Easy to use)
3. **Reed API** (UK focused)

## API Options

### 1. Adzuna API (Recommended)
- **Coverage**: Global (US, UK, Australia, Canada, etc.)
- **Cost**: Free tier available (up to 1,000 calls/month)
- **Registration**: https://developer.adzuna.com/
- **Best for**: General job searching worldwide

**Setup Steps:**
1. Go to https://developer.adzuna.com/
2. Sign up for a free developer account
3. Create a new app to get your App ID and API Key
4. Update the configuration in `script.js`

**Rate Limits:**
- Free: 1,000 calls/month
- Paid: Higher limits available

### 2. JSearch API (RapidAPI)
- **Coverage**: Global job listings
- **Cost**: Free tier (100 requests/month)
- **Registration**: https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch/
- **Best for**: Easy integration with RapidAPI

**Setup Steps:**
1. Go to https://rapidapi.com/
2. Sign up for a RapidAPI account
3. Subscribe to JSearch API (free tier available)
4. Copy your RapidAPI key from the dashboard
5. Update the configuration in `script.js`

**Rate Limits:**
- Free: 100 requests/month
- Basic: 1,000 requests/month ($10)
- Pro: 10,000 requests/month ($50)

### 3. Reed API (UK Jobs)
- **Coverage**: UK job market
- **Cost**: Free
- **Registration**: https://www.reed.co.uk/developers/
- **Best for**: UK-specific job searches

**Setup Steps:**
1. Go to https://www.reed.co.uk/developers/
2. Sign up for a developer account
3. Get your API key from the developer dashboard
4. Update the configuration in `script.js`

**Rate Limits:**
- Free: Generous limits for personal use

## Configuration Instructions

### Step 1: Choose Your API
Decide which API(s) you want to use based on your needs:
- **Global coverage**: Adzuna
- **Easy setup**: JSearch (RapidAPI)
- **UK jobs**: Reed

### Step 2: Get API Keys
Follow the setup steps above for your chosen API(s).

### Step 3: Update Configuration
In `script.js`, find the `apiConfig` object in the constructor and update your chosen API:

```javascript
// For Adzuna API
adzuna: {
    baseUrl: 'https://api.adzuna.com/v1/api/jobs',
    appId: 'YOUR_ACTUAL_APP_ID_HERE', // Replace with your App ID
    apiKey: 'YOUR_ACTUAL_API_KEY_HERE', // Replace with your API Key
    enabled: true // Set to true to enable
},

// For JSearch API
jsearch: {
    baseUrl: 'https://jsearch.p.rapidapi.com/search',
    apiKey: 'YOUR_ACTUAL_RAPIDAPI_KEY_HERE', // Replace with your RapidAPI key
    enabled: true // Set to true to enable
},

// For Reed API
reed: {
    baseUrl: 'https://www.reed.co.uk/api/1.0/search',
    apiKey: 'YOUR_ACTUAL_REED_API_KEY_HERE', // Replace with your Reed API key
    enabled: true // Set to true to enable
}
```

### Step 4: Test the Integration
1. Save your changes
2. Open the app in your browser
3. Try searching for jobs
4. Check the browser console for any error messages
5. You should see "API: [YOUR_API_NAME]" in the top-right corner instead of "Demo Mode"

## Country/Region Configuration

### Adzuna Countries
Available country codes for Adzuna API:
- `us` - United States
- `gb` - United Kingdom
- `au` - Australia
- `ca` - Canada
- `de` - Germany
- `fr` - France
- `nl` - Netherlands
- `nz` - New Zealand
- `za` - South Africa
- `in` - India
- `sg` - Singapore
- `br` - Brazil

To change the country, update this line in the `searchAdzunaJobs` method:
```javascript
const country = 'us'; // Change to your preferred country code
```

## Error Handling

The app includes comprehensive error handling:
- If the API fails, it automatically falls back to demo data
- Error messages are displayed to users
- Console logging helps with debugging
- Network issues are handled gracefully

## Security Notes

⚠️ **Important Security Considerations:**

1. **Client-Side API Keys**: The current implementation stores API keys in client-side JavaScript, which means they're visible to users. This is acceptable for:
   - Development and testing
   - APIs with generous free tiers
   - Low-risk applications

2. **Production Security**: For production applications, consider:
   - Moving API calls to a backend server
   - Using environment variables
   - Implementing API key rotation
   - Setting up CORS properly

## Troubleshooting

### Common Issues:

1. **"Demo Mode" still showing**
   - Check that you've set `enabled: true` for your chosen API
   - Verify API keys are correctly entered
   - Check browser console for configuration errors

2. **No jobs returned**
   - Verify your API keys are valid
   - Check rate limits haven't been exceeded
   - Try broader search terms
   - Check network connectivity

3. **CORS errors**
   - Some APIs may require server-side implementation
   - Consider using a CORS proxy for development
   - Check API documentation for CORS policies

4. **Rate limit errors**
   - Monitor your API usage
   - Consider upgrading to paid tiers
   - Implement caching to reduce API calls

### Debugging Tips:

1. Check the browser console for error messages
2. Use the Network tab to inspect API requests
3. Verify API key format and validity
4. Test API endpoints directly using tools like Postman

## Advanced Features

### Pagination
The app supports pagination for APIs that provide it:
- Adzuna: Supports page-based pagination
- JSearch: Supports page-based pagination  
- Reed: Supports offset-based pagination

### Sorting
Sorting options vary by API:
- Adzuna: 'relevance', 'date', 'salary'
- JSearch: Limited sorting options
- Reed: 'relevance', 'date'

### Filtering
Available filters depend on the API:
- **Salary range**: Supported by all APIs
- **Job type**: Supported by most APIs
- **Location**: Required/supported by all APIs
- **Company**: Limited support

## Next Steps

1. **Backend Integration**: For production, move API calls to a secure backend
2. **Caching**: Implement result caching to improve performance
3. **Analytics**: Track search patterns and popular queries
4. **User Accounts**: Add user authentication and personalized job recommendations
5. **Job Alerts**: Set up email/SMS notifications for new matching jobs

## Support

If you encounter issues:
1. Check the API provider's documentation
2. Review the browser console for error messages
3. Test with minimal search queries first
4. Verify your API keys and configuration

Remember to respect API rate limits and terms of service!
