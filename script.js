class JobSearchApp {
    constructor() {
        // API Configuration - Choose your preferred API
        // You can also use an external config.js file by defining API_CONFIG globally
        this.apiConfig = window.API_CONFIG || {
            // Option 1: Adzuna API (Recommended - Free with registration)
            adzuna: {
                baseUrl: 'https://api.adzuna.com/v1/api/jobs',
                appId: 'YOUR_ADZUNA_APP_ID', // Get from https://developer.adzuna.com/
                apiKey: 'YOUR_ADZUNA_API_KEY',
                enabled: false, // Set to true when you have keys
                country: 'us'   // us, gb, au, ca, de, fr, etc.
            },
            
            // Option 2: JSearch API (RapidAPI - Free tier available)
            jsearch: {
                baseUrl: 'https://jsearch.p.rapidapi.com/search',
                apiKey: 'YOUR_RAPIDAPI_KEY', // Get from https://rapidapi.com/
                enabled: false // Set to true when you have key
            },
            
            // Option 3: Reed API (UK focused)
            reed: {
                baseUrl: 'https://www.reed.co.uk/api/1.0/search',
                apiKey: 'YOUR_REED_API_KEY', // Get from https://www.reed.co.uk/developers
                enabled: false // Set to true when you have key
            }
        };
        
        // Current active API
        this.activeApi = this.getActiveApi();
        
        // App state
        this.currentPage = 1;
        this.jobsPerPage = 10;
        this.currentJobs = [];
        this.totalJobs = 0;
        this.currentSort = 'relevance';
        this.lastSearchParams = null;
        this.favorites = this.loadFavorites();
        this.applications = this.loadApplications();
        this.uploadedResume = this.loadResume();
        
        // DOM elements
        this.initializeElements();
        this.bindEvents();
        this.updateFavoritesCount();
        this.displayResume();
        this.displayApplications();
        this.displayFavorites();
        
        // Show API status
        this.displayApiStatus();
    }
    
    getActiveApi() {
        // Return the first enabled API
        for (const [name, config] of Object.entries(this.apiConfig)) {
            if (config.enabled) {
                return name;
            }
        }
        return null; // No API enabled - will use demo mode
    }
    
    displayApiStatus() {
        const statusDiv = document.createElement('div');
        statusDiv.className = 'api-status';
        statusDiv.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            padding: 0.5rem 1rem;
            border-radius: 6px;
            font-size: 0.8rem;
            font-weight: 500;
            z-index: 1000;
            ${this.activeApi ? 
                'background: var(--success-color); color: white;' : 
                'background: var(--warning-color); color: white;'
            }
        `;
        statusDiv.innerHTML = this.activeApi ? 
            `🚀 Live API: ${this.activeApi.toUpperCase()}` : 
            '🎭 Demo Mode';
        
        // Add click handler for API testing
        statusDiv.style.cursor = 'pointer';
        statusDiv.title = 'Click to test API connection';
        statusDiv.addEventListener('click', () => {
            this.testApiConnection();
        });
        
        document.body.appendChild(statusDiv);
        
        // Log API status to console
        console.log(`🔧 JobSeeker API Status: ${this.activeApi ? `Using ${this.activeApi.toUpperCase()} API` : 'Demo Mode'}`);
        if (this.activeApi) {
            console.log(`📊 API Config:`, this.apiConfig[this.activeApi]);
        }
    }
    
    // Test API connection
    async testApiConnection() {
        if (!this.activeApi) {
            alert('No API configured - running in demo mode');
            return;
        }
        
        console.log(`🧪 Testing ${this.activeApi.toUpperCase()} API connection...`);
        
        try {
            this.showLoading();
            
            let testJobs = [];
            
            // Test the active API
            if (this.activeApi === 'adzuna') {
                testJobs = await this.searchAdzunaJobs('developer', 'New York', {});
            } else if (this.activeApi === 'jsearch') {
                testJobs = await this.searchJSearchJobs('developer', 'New York', {});
            } else if (this.activeApi === 'reed') {
                testJobs = await this.searchReedJobs('developer', 'London', {});
            }
            
            if (testJobs && testJobs.length > 0) {
                alert(`✅ API Test Successful!\nFound ${testJobs.length} jobs\nFirst result: ${testJobs[0].title} at ${testJobs[0].company}`);
                console.log(`✅ API test successful:`, testJobs);
            } else {
                alert('⚠️ API connected but no results returned. Try a different search term.');
            }
            
        } catch (error) {
            console.error(`❌ API test failed:`, error);
            
            let errorMessage = `❌ API Test Failed: ${error.message}\n\n`;
            
            if (error.message.includes('CORS')) {
                errorMessage += `🔧 CORS Issue Solutions:\n`;
                errorMessage += `1. Use a local server (not file:// protocol)\n`;
                errorMessage += `2. Install a CORS browser extension\n`;
                errorMessage += `3. Try the JSearch API instead (better CORS support)\n\n`;
                errorMessage += `Quick fix: Right-click index.html → "Open with Live Server" if using VS Code`;
            } else if (error.message.includes('401') || error.message.includes('Invalid')) {
                errorMessage += `🔑 Authentication Issue:\n`;
                errorMessage += `- Double-check your API keys in config.js\n`;
                errorMessage += `- Verify your API subscription is active`;
            } else if (error.message.includes('429') || error.message.includes('rate limit')) {
                errorMessage += `⏱️ Rate Limit Issue:\n`;
                errorMessage += `- Wait a few minutes before trying again\n`;
                errorMessage += `- Consider upgrading your API plan`;
            }
            
            alert(errorMessage);
        } finally {
            this.hideLoading();
        }
    }
    
    initializeElements() {
        // Navigation
        this.navTabs = document.querySelectorAll('.nav-tab');
        this.tabContents = document.querySelectorAll('.tab-content');
        
        // Search form
        this.searchForm = document.getElementById('job-search-form');
        this.keywordsInput = document.getElementById('keywords');
        this.locationInput = document.getElementById('location');
        this.minSalaryInput = document.getElementById('min-salary');
        this.maxSalaryInput = document.getElementById('max-salary');
        this.jobTypeSelect = document.getElementById('job-type');
        
        // Results
        this.loadingDiv = document.getElementById('loading');
        this.resultsSection = document.getElementById('results-section');
        this.resultsCount = document.getElementById('results-count');
        this.sortSelect = document.getElementById('sort-by');
        this.jobsTable = document.getElementById('jobs-table');
        this.jobsTbody = document.getElementById('jobs-tbody');
        this.pagination = document.getElementById('pagination');
        
        // Modal
        this.modal = document.getElementById('job-modal');
        this.overlay = document.getElementById('overlay');
        this.closeModal = document.querySelector('.close-modal');
        
        // Modal content
        this.modalJobTitle = document.getElementById('modal-job-title');
        this.modalCompany = document.getElementById('modal-company');
        this.modalLocation = document.getElementById('modal-location');
        this.modalSalary = document.getElementById('modal-salary');
        this.modalDate = document.getElementById('modal-date');
        this.modalDescription = document.getElementById('modal-description');
        this.modalFavoriteBtn = document.getElementById('modal-favorite-btn');
        this.modalApplyBtn = document.getElementById('modal-apply-btn');
        
        // Favorites
        this.favoritesCount = document.getElementById('favorites-count');
        this.favoritesList = document.getElementById('favorites-list');
        
        // Resume upload
        this.resumeUpload = document.getElementById('resume-upload');
        this.resumeInfo = document.getElementById('resume-info');
        this.resumeName = document.getElementById('resume-name');
        this.removeResumeBtn = document.getElementById('remove-resume');
        
        // Applications
        this.applicationsContainer = document.getElementById('applications-container');
    }
    
    bindEvents() {
        // Navigation tabs
        this.navTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.getAttribute('data-tab');
                this.switchTab(tabName);
            });
        });
        
        // Search form
        this.searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.searchJobs();
        });
        
        // Sort change
        this.sortSelect.addEventListener('change', () => {
            this.currentSort = this.sortSelect.value;
            this.sortJobs();
        });
        
        // Modal events
        this.closeModal.addEventListener('click', () => this.hideModal());
        this.overlay.addEventListener('click', () => this.hideModal());
        
        // Resume upload
        this.resumeUpload.addEventListener('change', (e) => this.handleResumeUpload(e));
        this.removeResumeBtn.addEventListener('click', () => this.removeResume());
        
        // Keyboard events
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideModal();
            }
        });
    }
    
    switchTab(tabName) {
        // Update active tab
        this.navTabs.forEach(tab => {
            tab.classList.toggle('active', tab.getAttribute('data-tab') === tabName);
        });
        
        // Update active content
        this.tabContents.forEach(content => {
            content.classList.toggle('active', content.id === `${tabName}-tab`);
        });
    }
    
    async searchJobs() {
        const keywords = this.keywordsInput.value.trim();
        const location = this.locationInput.value.trim();
        const minSalary = this.minSalaryInput.value;
        const maxSalary = this.maxSalaryInput.value;
        const jobType = this.jobTypeSelect.value;
        
        if (!keywords && !location) {
            alert('Please enter keywords or location to search for jobs.');
            return;
        }
        
        this.showLoading();
        this.currentPage = 1;
        
        try {
            let jobs = [];
            
            // Use real API if available, otherwise fallback to demo data
            if (this.activeApi === 'adzuna') {
                jobs = await this.searchAdzunaJobs(keywords, location, { minSalary, maxSalary, jobType });
            } else if (this.activeApi === 'jsearch') {
                jobs = await this.searchJSearchJobs(keywords, location, { minSalary, maxSalary, jobType });
            } else if (this.activeApi === 'reed') {
                jobs = await this.searchReedJobs(keywords, location, { minSalary, maxSalary, jobType });
            } else {
                // Fallback to simulated data
                jobs = await this.simulateJobSearch(keywords, location, minSalary, maxSalary, jobType);
            }
            
            this.currentJobs = jobs;
            this.totalJobs = jobs.length;
            this.lastSearchParams = { keywords, location, minSalary, maxSalary, jobType };
            this.displayJobs();
        } catch (error) {
            console.error('Error searching jobs:', error);
            this.showError('Failed to search jobs. Please try again.');
            
            // Fallback to demo data on error
            try {
                const jobs = await this.simulateJobSearch(keywords, location, minSalary, maxSalary, jobType);
                this.currentJobs = jobs;
                this.totalJobs = jobs.length;
                this.displayJobs();
            } catch (fallbackError) {
                console.error('Fallback error:', fallbackError);
            }
        } finally {
            this.hideLoading();
        }
    }
    
    // Adzuna API integration
    async searchAdzunaJobs(query, location, filters) {
        const country = this.apiConfig.adzuna.country || 'us'; // Use configured country
        const params = new URLSearchParams({
            app_id: this.apiConfig.adzuna.appId,
            app_key: this.apiConfig.adzuna.apiKey,
            results_per_page: this.jobsPerPage,
            what: query,
            where: location,
            sort_by: this.currentSort === 'date' ? 'date' : 'relevance',
            content_type: 'application/json'
        });
        
        // Add salary filters
        if (filters.minSalary) {
            params.append('salary_min', filters.minSalary);
        }
        if (filters.maxSalary) {
            params.append('salary_max', filters.maxSalary);
        }
        
        const url = `${this.apiConfig.adzuna.baseUrl}/${country}/search/${this.currentPage}?${params}`;
        console.log(`🔍 Adzuna API Request: ${url.replace(this.apiConfig.adzuna.apiKey, 'API_KEY_HIDDEN')}`);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ Adzuna API Error: ${response.status} ${response.statusText}`, errorText);
            
            // Provide helpful error messages
            if (response.status === 401) {
                throw new Error('Invalid API credentials. Please check your App ID and API Key.');
            } else if (response.status === 403) {
                throw new Error('API access forbidden. Check your API key permissions.');
            } else if (response.status === 429) {
                throw new Error('API rate limit exceeded. Please wait before making more requests.');
            } else {
                throw new Error(`Adzuna API error: ${response.status} ${response.statusText}`);
            }
        }
        
        const data = await response.json();
        console.log(`✅ Adzuna API Success: Found ${data.count} total jobs`);
        
        this.totalJobs = data.count;
        
        return data.results.map(job => ({
            id: job.id,
            title: job.title,
            company: job.company.display_name,
            location: job.location.display_name,
            salary: job.salary_min && job.salary_max 
                ? `$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()}` 
                : job.salary_min ? `$${job.salary_min.toLocaleString()}+` 
                : 'Salary not specified',
            description: job.description,
            url: job.redirect_url,
            posted: new Date(job.created).toLocaleDateString(),
            type: job.contract_type || 'Full-time',
            category: job.category?.label || 'General'
        }));
    }
    
    // JSearch API (RapidAPI) integration
    async searchJSearchJobs(query, location, filters) {
        const searchQuery = location ? `${query} in ${location}` : query;
        
        const params = new URLSearchParams({
            query: searchQuery,
            page: this.currentPage.toString(),
            num_pages: '1',
            date_posted: 'all',
            remote_jobs_only: 'false'
        });
        
        // Add employment type filter
        if (filters.jobType && filters.jobType !== 'all') {
            params.append('employment_types', filters.jobType.toUpperCase());
        }
        
        const url = `${this.apiConfig.jsearch.baseUrl}?${params}`;
        console.log(`🔍 JSearch API Request: ${url}`);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Host': 'jsearch.p.rapidapi.com',
                'X-RapidAPI-Key': this.apiConfig.jsearch.apiKey,
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ JSearch API Error: ${response.status} ${response.statusText}`, errorText);
            
            // Provide helpful error messages
            if (response.status === 401) {
                throw new Error('Invalid RapidAPI key. Please check your JSearch API key.');
            } else if (response.status === 403) {
                throw new Error('API access forbidden. Check your RapidAPI subscription.');
            } else if (response.status === 429) {
                throw new Error('API rate limit exceeded. Please upgrade your RapidAPI plan.');
            } else {
                throw new Error(`JSearch API error: ${response.status} ${response.statusText}`);
            }
        }
        
        const data = await response.json();
        console.log(`✅ JSearch API Success:`, data);
        
        if (!data.data || data.data.length === 0) {
            console.warn('⚠️ No jobs found in API response');
            return [];
        }
        
        this.totalJobs = data.data.length; // JSearch doesn't provide total count
        
        return data.data.map(job => ({
            id: job.job_id || Math.random().toString(36),
            title: job.job_title || 'No title',
            company: job.employer_name || 'Company not specified',
            location: this.formatLocation(job),
            salary: this.formatSalary(job),
            description: job.job_description || 'No description available',
            url: job.job_apply_link || '#',
            posted: this.formatDate(job.job_posted_at_datetime_utc),
            type: job.job_employment_type || 'Full-time',
            category: 'Technology'
        }));
    }
    
    // Helper methods for JSearch data formatting
    formatLocation(job) {
        if (job.job_city && job.job_state) {
            return `${job.job_city}, ${job.job_state}`;
        } else if (job.job_city) {
            return job.job_city;
        } else if (job.job_country) {
            return job.job_country;
        }
        return 'Location not specified';
    }
    
    formatSalary(job) {
        // Handle yearly salary
        if (job.job_min_salary && job.job_max_salary) {
            const period = job.job_salary_period === 'YEAR' ? '/year' : '';
            return `$${job.job_min_salary.toLocaleString()} - $${job.job_max_salary.toLocaleString()}${period}`;
        } else if (job.job_min_salary) {
            const period = job.job_salary_period === 'YEAR' ? '/year' : '';
            return `$${job.job_min_salary.toLocaleString()}+${period}`;
        } else if (job.job_salary) {
            return job.job_salary;
        }
        return 'Salary not specified';
    }
    
    formatDate(dateString) {
        if (!dateString) return 'Recently posted';
        
        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffTime = Math.abs(now - date);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays === 0) return 'Today';
            if (diffDays === 1) return 'Yesterday';
            if (diffDays < 7) return `${diffDays} days ago`;
            if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
            if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
            
            return date.toLocaleDateString();
        } catch (error) {
            // Handle posted_at_timestamp (Unix timestamp)
            if (typeof dateString === 'number') {
                try {
                    const date = new Date(dateString * 1000);
                    const now = new Date();
                    const diffTime = Math.abs(now - date);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    
                    if (diffDays === 0) return 'Today';
                    if (diffDays === 1) return 'Yesterday';
                    if (diffDays < 7) return `${diffDays} days ago`;
                    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
                    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
                    
                    return date.toLocaleDateString();
                } catch (timestampError) {
                    return 'Recently posted';
                }
            }
            return 'Recently posted';
        }
    }
    
    // Reed API integration (UK focused)
    async searchReedJobs(query, location, filters) {
        const params = new URLSearchParams({
            keywords: query,
            locationName: location,
            resultsToShow: this.jobsPerPage.toString(),
            resultsToSkip: ((this.currentPage - 1) * this.jobsPerPage).toString()
        });
        
        // Add salary filters
        if (filters.minSalary) {
            params.append('minimumSalary', filters.minSalary);
        }
        if (filters.maxSalary) {
            params.append('maximumSalary', filters.maxSalary);
        }
        
        // Add employment type filter
        if (filters.jobType && filters.jobType !== 'all') {
            if (filters.jobType === 'permanent') {
                params.append('permanent', 'true');
            } else if (filters.jobType === 'contract') {
                params.append('contract', 'true');
            }
        }
        
        const response = await fetch(
            `${this.apiConfig.reed.baseUrl}?${params}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Basic ${btoa(this.apiConfig.reed.apiKey + ':')}`,
                    'Accept': 'application/json'
                }
            }
        );
        
        if (!response.ok) {
            throw new Error(`Reed API error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        this.totalJobs = data.totalResults;
        
        return data.results.map(job => ({
            id: job.jobId,
            title: job.jobTitle,
            company: job.employerName,
            location: job.locationName,
            salary: job.minimumSalary && job.maximumSalary 
                ? `£${job.minimumSalary.toLocaleString()} - £${job.maximumSalary.toLocaleString()}` 
                : job.minimumSalary ? `£${job.minimumSalary.toLocaleString()}+` : 'Salary not specified',
            description: job.jobDescription,
            url: job.jobUrl,
            posted: job.date ? new Date(job.date).toLocaleDateString() : 'Recently',
            type: job.jobType || 'Full-time',
            category: 'General'
        }));
    }
    
    // Simulate job search since we don't have real API keys
    async simulateJobSearch(keywords, location, minSalary, maxSalary, jobType) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Generate sample job data
        const sampleJobs = [
            {
                id: '1',
                title: `Senior ${keywords || 'Software'} Developer`,
                company: 'TechCorp Inc.',
                location: location || 'San Francisco, CA',
                salary_min: Math.max(80000, parseInt(minSalary) || 80000),
                salary_max: Math.min(150000, parseInt(maxSalary) || 150000),
                created: '2025-09-15T00:00:00Z',
                description: `We are looking for an experienced ${keywords || 'Software'} Developer to join our dynamic team. You will be responsible for developing high-quality software solutions and working with cross-functional teams.`,
                category: jobType || 'full_time',
                redirect_url: '#'
            },
            {
                id: '2',
                title: `${keywords || 'Marketing'} Manager`,
                company: 'Innovation Labs',
                location: location || 'New York, NY',
                salary_min: Math.max(70000, parseInt(minSalary) || 70000),
                salary_max: Math.min(120000, parseInt(maxSalary) || 120000),
                created: '2025-09-14T00:00:00Z',
                description: `Join our marketing team as a ${keywords || 'Marketing'} Manager. You will lead marketing campaigns, analyze market trends, and drive brand awareness.`,
                category: jobType || 'full_time',
                redirect_url: '#'
            },
            {
                id: '3',
                title: `Junior ${keywords || 'Data'} Analyst`,
                company: 'DataFlow Solutions',
                location: location || 'Austin, TX',
                salary_min: Math.max(55000, parseInt(minSalary) || 55000),
                salary_max: Math.min(85000, parseInt(maxSalary) || 85000),
                created: '2025-09-13T00:00:00Z',
                description: `We're seeking a Junior ${keywords || 'Data'} Analyst to help us make data-driven decisions. You'll work with large datasets and create insightful reports.`,
                category: jobType || 'full_time',
                redirect_url: '#'
            },
            {
                id: '4',
                title: `${keywords || 'Product'} Designer`,
                company: 'Design Studio Pro',
                location: location || 'Seattle, WA',
                salary_min: Math.max(65000, parseInt(minSalary) || 65000),
                salary_max: Math.min(110000, parseInt(maxSalary) || 110000),
                created: '2025-09-12T00:00:00Z',
                description: `Creative ${keywords || 'Product'} Designer needed to design user-friendly interfaces and experiences. Work with product teams to bring ideas to life.`,
                category: jobType || 'contract',
                redirect_url: '#'
            },
            {
                id: '5',
                title: `Remote ${keywords || 'Customer'} Support Specialist`,
                company: 'SupportTech',
                location: 'Remote',
                salary_min: Math.max(45000, parseInt(minSalary) || 45000),
                salary_max: Math.min(70000, parseInt(maxSalary) || 70000),
                created: '2025-09-11T00:00:00Z',
                description: `Remote ${keywords || 'Customer'} Support Specialist to provide excellent customer service and resolve technical issues for our clients.`,
                category: 'remote',
                redirect_url: '#'
            }
        ];
        
        // Filter jobs based on criteria
        return sampleJobs.filter(job => {
            if (minSalary && job.salary_min < parseInt(minSalary)) return false;
            if (maxSalary && job.salary_max > parseInt(maxSalary)) return false;
            if (jobType && jobType !== job.category) return false;
            return true;
        });
    }
    
    displayJobs() {
        if (this.currentJobs.length === 0) {
            this.showNoResults();
            return;
        }
        
        this.resultsSection.classList.remove('hidden');
        this.resultsCount.textContent = `${this.currentJobs.length} jobs found`;
        
        // Clear existing rows
        this.jobsTbody.innerHTML = '';
        
        // Calculate pagination
        const startIndex = (this.currentPage - 1) * this.jobsPerPage;
        const endIndex = startIndex + this.jobsPerPage;
        const jobsToShow = this.currentJobs.slice(startIndex, endIndex);
        
        // Add job rows
        jobsToShow.forEach(job => {
            const row = this.createJobRow(job);
            this.jobsTbody.appendChild(row);
        });
        
        this.updatePagination();
    }
    
    createJobRow(job) {
        const row = document.createElement('tr');
        const isFavorite = this.favorites.some(fav => fav.id === job.id);
        
        // Format salary based on the data structure
        let salaryDisplay = 'Salary not specified';
        if (job.salary) {
            salaryDisplay = job.salary;
        } else if (job.job_min_salary || job.job_max_salary) {
            salaryDisplay = this.formatSalary(job);
        } else if (job.salary_min || job.salary_max) {
            // Legacy format support
            if (job.salary_min && job.salary_max) {
                salaryDisplay = `$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()}`;
            } else if (job.salary_min) {
                salaryDisplay = `$${job.salary_min.toLocaleString()}+`;
            }
        }
        
        // Format date based on the data structure
        let dateDisplay = 'Recently posted';
        if (job.posted) {
            dateDisplay = job.posted;
        } else if (job.job_posted_at_datetime_utc) {
            dateDisplay = this.formatDate(job.job_posted_at_datetime_utc);
        } else if (job.job_posted_at_timestamp) {
            dateDisplay = this.formatDate(job.job_posted_at_timestamp);
        } else if (job.created) {
            dateDisplay = this.formatDate(job.created);
        }
        
        row.innerHTML = `
            <td>
                <div class="job-title" data-job-id="${job.id}">${job.title}</div>
            </td>
            <td>
                <div class="company-name">${job.company}</div>
            </td>
            <td>
                <div class="job-location">${job.location}</div>
            </td>
            <td>
                <div class="job-salary">${salaryDisplay}</div>
            </td>
            <td>
                <div class="job-date">${dateDisplay}</div>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-small btn-primary" onclick="jobApp.showJobModal('${job.id}')">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="btn btn-small ${isFavorite ? 'btn-favorite favorited' : 'btn-secondary'}" 
                            onclick="jobApp.toggleFavorite('${job.id}')">
                        <i class="fas fa-heart"></i> ${isFavorite ? 'Favorited' : 'Favorite'}
                    </button>
                </div>
            </td>
        `;
        
        // Add click event for job title
        const jobTitle = row.querySelector('.job-title');
        jobTitle.addEventListener('click', () => this.showJobModal(job.id));
        
        return row;
    }
    
    showJobModal(jobId) {
        const job = this.currentJobs.find(j => j.id === jobId);
        if (!job) return;
        
        // Format salary for modal display
        let salaryDisplay = 'Salary not specified';
        if (job.salary) {
            salaryDisplay = job.salary;
        } else if (job.job_min_salary || job.job_max_salary) {
            salaryDisplay = this.formatSalary(job);
        } else if (job.salary_min || job.salary_max) {
            // Legacy format support
            if (job.salary_min && job.salary_max) {
                salaryDisplay = `$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()}`;
            } else if (job.salary_min) {
                salaryDisplay = `$${job.salary_min.toLocaleString()}+`;
            }
        }
        
        // Format date for modal display
        let dateDisplay = 'Recently posted';
        if (job.posted) {
            dateDisplay = job.posted;
        } else if (job.job_posted_at_datetime_utc) {
            dateDisplay = this.formatDate(job.job_posted_at_datetime_utc);
        } else if (job.job_posted_at_timestamp) {
            dateDisplay = this.formatDate(job.job_posted_at_timestamp);
        } else if (job.created) {
            dateDisplay = this.formatDate(job.created);
        }
        
        // Populate modal content
        this.modalJobTitle.textContent = job.title;
        this.modalCompany.textContent = job.company;
        this.modalLocation.textContent = job.location;
        this.modalSalary.textContent = salaryDisplay;
        this.modalDate.textContent = dateDisplay;
        this.modalDescription.innerHTML = job.description;
        
        // Update buttons
        const isFavorite = this.favorites.some(fav => fav.id === job.id);
        this.modalFavoriteBtn.innerHTML = `<i class="fas fa-heart"></i> ${isFavorite ? 'Remove Favorite' : 'Add to Favorites'}`;
        this.modalFavoriteBtn.className = `btn ${isFavorite ? 'btn-favorite' : 'btn-secondary'}`;
        this.modalFavoriteBtn.onclick = () => this.toggleFavorite(jobId);
        this.modalApplyBtn.onclick = () => this.applyToJob(jobId);
        
        // Show modal
        this.modal.classList.add('active');
        this.overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    hideModal() {
        this.modal.classList.remove('active');
        this.overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    toggleFavorite(jobId) {
        const job = this.currentJobs.find(j => j.id === jobId);
        if (!job) return;
        
        const existingIndex = this.favorites.findIndex(fav => fav.id === jobId);
        
        if (existingIndex > -1) {
            // Remove from favorites
            this.favorites.splice(existingIndex, 1);
        } else {
            // Add to favorites
            this.favorites.push(job);
        }
        
        this.saveFavorites();
        this.updateFavoritesCount();
        this.displayFavorites();
        this.displayJobs(); // Refresh current view
        
        // Update modal if open
        if (this.modal.classList.contains('active')) {
            this.showJobModal(jobId);
        }
    }
    
    applyToJob(jobId) {
        const job = this.currentJobs.find(j => j.id === jobId);
        if (!job) return;
        
        if (!this.uploadedResume) {
            alert('Please upload your resume before applying to jobs.');
            this.switchTab('applications');
            return;
        }
        
        // Check if already applied
        const existingApplication = this.applications.find(app => app.jobId === jobId);
        if (existingApplication) {
            alert('You have already applied to this job.');
            return;
        }
        
        // Add application
        const application = {
            id: Date.now().toString(),
            jobId: jobId,
            jobTitle: job.title,
            company: job.company,
            appliedDate: new Date().toISOString(),
            status: 'applied',
            resumeName: this.uploadedResume.name
        };
        
        this.applications.push(application);
        this.saveApplications();
        this.displayApplications();
        
        alert('Application submitted successfully!');
        this.hideModal();
        this.switchTab('applications');
    }
    
    sortJobs() {
        switch (this.currentSort) {
            case 'date':
                this.currentJobs.sort((a, b) => {
                    // Get date for sorting - support multiple date formats
                    const getDateValue = (job) => {
                        if (job.job_posted_at_timestamp) {
                            return new Date(job.job_posted_at_timestamp * 1000);
                        } else if (job.job_posted_at_datetime_utc) {
                            return new Date(job.job_posted_at_datetime_utc);
                        } else if (job.created) {
                            return new Date(job.created);
                        }
                        return new Date(0); // Default to epoch if no date found
                    };
                    
                    return getDateValue(b) - getDateValue(a); // Most recent first
                });
                break;
            case 'salary':
                this.currentJobs.sort((a, b) => {
                    // Get max salary for sorting - support multiple salary formats
                    const getMaxSalary = (job) => {
                        if (job.job_max_salary) return job.job_max_salary;
                        if (job.salary_max) return job.salary_max;
                        if (job.job_min_salary) return job.job_min_salary;
                        if (job.salary_min) return job.salary_min;
                        return 0;
                    };
                    
                    return getMaxSalary(b) - getMaxSalary(a); // Highest first
                });
                break;
            case 'company':
                this.currentJobs.sort((a, b) => a.company.localeCompare(b.company));
                break;
            default:
                // Keep original relevance order
                break;
        }
        
        this.displayJobs();
    }
    
    updatePagination() {
        const totalPages = Math.ceil(this.currentJobs.length / this.jobsPerPage);
        this.pagination.innerHTML = '';
        
        if (totalPages <= 1) return;
        
        // Previous button
        const prevBtn = document.createElement('button');
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i> Previous';
        prevBtn.disabled = this.currentPage === 1;
        prevBtn.addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.displayJobs();
            }
        });
        this.pagination.appendChild(prevBtn);
        
        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.textContent = i;
            pageBtn.className = this.currentPage === i ? 'active' : '';
            pageBtn.addEventListener('click', () => {
                this.currentPage = i;
                this.displayJobs();
            });
            this.pagination.appendChild(pageBtn);
        }
        
        // Next button
        const nextBtn = document.createElement('button');
        nextBtn.innerHTML = 'Next <i class="fas fa-chevron-right"></i>';
        nextBtn.disabled = this.currentPage === totalPages;
        nextBtn.addEventListener('click', () => {
            if (this.currentPage < totalPages) {
                this.currentPage++;
                this.displayJobs();
            }
        });
        this.pagination.appendChild(nextBtn);
    }
    
    displayFavorites() {
        const container = this.favoritesList;
        
        if (this.favorites.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-heart-broken"></i>
                    <p>No favorite jobs yet. Start by searching and adding jobs to your favorites!</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = '';
        
        this.favorites.forEach(job => {
            // Format salary for favorites display
            let salaryDisplay = 'Salary not specified';
            if (job.salary) {
                salaryDisplay = job.salary;
            } else if (job.job_min_salary || job.job_max_salary) {
                salaryDisplay = this.formatSalary(job);
            } else if (job.salary_min || job.salary_max) {
                // Legacy format support
                if (job.salary_min && job.salary_max) {
                    salaryDisplay = `$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()}`;
                } else if (job.salary_min) {
                    salaryDisplay = `$${job.salary_min.toLocaleString()}+`;
                }
            }
            
            // Format date for favorites display
            let dateDisplay = 'Recently posted';
            if (job.posted) {
                dateDisplay = job.posted;
            } else if (job.job_posted_at_datetime_utc) {
                dateDisplay = this.formatDate(job.job_posted_at_datetime_utc);
            } else if (job.job_posted_at_timestamp) {
                dateDisplay = this.formatDate(job.job_posted_at_timestamp);
            } else if (job.created) {
                dateDisplay = this.formatDate(job.created);
            }
            
            const jobElement = document.createElement('div');
            jobElement.className = 'favorite-job';
            jobElement.innerHTML = `
                <div style="display: flex; justify-content: between; align-items: flex-start;">
                    <div style="flex: 1;">
                        <h4 class="job-title" onclick="jobApp.showJobModal('${job.id}')">${job.title}</h4>
                        <p><strong>${job.company}</strong> - ${job.location}</p>
                        <p class="job-salary">${salaryDisplay}</p>
                        <p class="job-date">Posted: ${dateDisplay}</p>
                    </div>
                    <div class="action-buttons">
                        <button class="btn btn-small btn-primary" onclick="jobApp.showJobModal('${job.id}')">
                            <i class="fas fa-eye"></i> View
                        </button>
                        <button class="btn btn-small btn-favorite" onclick="jobApp.toggleFavorite('${job.id}')">
                            <i class="fas fa-trash"></i> Remove
                        </button>
                    </div>
                </div>
            `;
            container.appendChild(jobElement);
        });
    }
    
    handleResumeUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        // Validate file type
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(file.type)) {
            alert('Please upload a PDF, DOC, or DOCX file.');
            return;
        }
        
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('File size should not exceed 5MB.');
            return;
        }
        
        this.uploadedResume = {
            name: file.name,
            size: file.size,
            type: file.type,
            uploadDate: new Date().toISOString()
        };
        
        this.saveResume();
        this.displayResume();
    }
    
    displayResume() {
        const fileLabel = document.querySelector('.file-label');
        
        if (this.uploadedResume) {
            fileLabel.style.display = 'none';
            this.resumeInfo.classList.remove('hidden');
            this.resumeName.textContent = this.uploadedResume.name;
        } else {
            fileLabel.style.display = 'flex';
            this.resumeInfo.classList.add('hidden');
        }
    }
    
    removeResume() {
        this.uploadedResume = null;
        this.resumeUpload.value = '';
        this.saveResume();
        this.displayResume();
    }
    
    displayApplications() {
        const container = this.applicationsContainer;
        
        if (this.applications.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-clipboard-list"></i>
                    <p>No applications submitted yet. Apply to jobs to track your progress here!</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = '';
        
        this.applications.forEach(application => {
            const appElement = document.createElement('div');
            appElement.className = 'application-item';
            appElement.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div>
                        <h4>${application.jobTitle}</h4>
                        <p><strong>${application.company}</strong></p>
                        <p>Applied: ${this.formatDate(application.appliedDate)}</p>
                        <p>Resume: ${application.resumeName}</p>
                    </div>
                    <div>
                        <span class="application-status status-${application.status}">${application.status}</span>
                    </div>
                </div>
            `;
            container.appendChild(appElement);
        });
    }
    
    updateFavoritesCount() {
        this.favoritesCount.textContent = this.favorites.length;
    }
    
    showLoading() {
        this.loadingDiv.classList.remove('hidden');
        this.resultsSection.classList.add('hidden');
    }
    
    hideLoading() {
        this.loadingDiv.classList.add('hidden');
    }
    
    showNoResults() {
        this.resultsSection.classList.remove('hidden');
        this.resultsCount.textContent = 'No jobs found';
        this.jobsTbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">
                    <div class="empty-state">
                        <i class="fas fa-search"></i>
                        <p>No jobs found matching your criteria. Try adjusting your search terms.</p>
                    </div>
                </td>
            </tr>
        `;
        this.pagination.innerHTML = '';
    }
    
    showError(message) {
        this.resultsSection.classList.remove('hidden');
        this.resultsCount.textContent = 'Error occurred';
        this.jobsTbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">
                    <div class="empty-state">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>${message}</p>
                    </div>
                </td>
            </tr>
        `;
    }
    
    // Local Storage Methods
    loadFavorites() {
        const saved = localStorage.getItem('jobseeker-favorites');
        return saved ? JSON.parse(saved) : [];
    }
    
    saveFavorites() {
        localStorage.setItem('jobseeker-favorites', JSON.stringify(this.favorites));
    }
    
    loadApplications() {
        const saved = localStorage.getItem('jobseeker-applications');
        return saved ? JSON.parse(saved) : [];
    }
    
    saveApplications() {
        localStorage.setItem('jobseeker-applications', JSON.stringify(this.applications));
    }
    
    loadResume() {
        const saved = localStorage.getItem('jobseeker-resume');
        return saved ? JSON.parse(saved) : null;
    }
    
    saveResume() {
        if (this.uploadedResume) {
            localStorage.setItem('jobseeker-resume', JSON.stringify(this.uploadedResume));
        } else {
            localStorage.removeItem('jobseeker-resume');
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.jobApp = new JobSearchApp();
});
