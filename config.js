// API Configuration - Working with real API keys
// This file contains your actual API keys for job search integration

window.API_CONFIG = {
    // Option 1: Adzuna API (Has CORS issues - needs server or proxy)
    // Register at: https://developer.adzuna.com/
    adzuna: {
        baseUrl: 'https://api.adzuna.com/v1/api/jobs',
        appId: '7a98eb17',      // Your Adzuna App ID
        apiKey: 'dc3e2971d027ccf964f8ebc9c5b26b62',     // Your Adzuna API Key
        enabled: false,                        // Disabled due to CORS - needs server setup
        country: 'us'                          // US job market (change to 'gb', 'ca', etc. if needed)
    },
    
    // Option 2: JSearch API via RapidAPI (PRIMARY - Better CORS support)  
    // Register at: https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch/
    jsearch: {
        baseUrl: 'https://jsearch.p.rapidapi.com/search',
        apiKey: '7cdba2dc6cmsh486f41c5f8ed71ap1650b9jsn3aa293cc2a0e',       // Your RapidAPI key
        enabled: true                          // PRIMARY API - Should work in browser
    },
    
    // Option 3: Reed API (UK jobs, free)
    // Register at: https://www.reed.co.uk/developers/
    reed: {
        baseUrl: 'https://www.reed.co.uk/api/1.0/search',
        apiKey: 'YOUR_REED_API_KEY_HERE',       // Reed API key (not configured)
        enabled: false                          // Not enabled
    }
};
