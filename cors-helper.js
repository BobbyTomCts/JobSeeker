// CORS Proxy Helper for Local Development
// This helps bypass CORS issues when testing APIs locally

class CORSProxy {
    constructor() {
        this.proxyServices = [
            'https://cors-anywhere.herokuapp.com/',
            'https://api.allorigins.win/raw?url=',
            'https://thingproxy.freeboard.io/fetch/'
        ];
        this.currentProxy = 0;
    }
    
    // Try to make API request with CORS proxy if needed
    async fetchWithCORS(url, options = {}) {
        // First try direct request
        try {
            const response = await fetch(url, options);
            if (response.ok) {
                return response;
            }
        } catch (error) {
            console.log('Direct API call failed, trying CORS proxy...');
        }
        
        // Try with CORS proxy
        for (let i = 0; i < this.proxyServices.length; i++) {
            try {
                const proxyUrl = this.proxyServices[this.currentProxy] + encodeURIComponent(url);
                console.log(`Trying CORS proxy ${this.currentProxy + 1}: ${this.proxyServices[this.currentProxy]}`);
                
                const response = await fetch(proxyUrl, {
                    ...options,
                    headers: {
                        ...options.headers,
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                });
                
                if (response.ok) {
                    console.log('✅ CORS proxy successful!');
                    return response;
                }
            } catch (error) {
                console.log(`CORS proxy ${this.currentProxy + 1} failed:`, error.message);
            }
            
            this.currentProxy = (this.currentProxy + 1) % this.proxyServices.length;
        }
        
        throw new Error('All CORS proxy attempts failed. Please use a local server or browser CORS extension.');
    }
}

// Add to global scope
window.corsProxy = new CORSProxy();
