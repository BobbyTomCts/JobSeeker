class JobSearchApp {
    constructor() {
        // API Configuration (Using Adzuna API - requires free API key)
        this.API_BASE_URL = 'https://api.adzuna.com/v1/api/jobs';
        this.API_KEY = 'YOUR_ADZUNA_API_KEY'; // Replace with actual API key
        this.APP_ID = 'YOUR_ADZUNA_APP_ID'; // Replace with actual App ID
        
        // App state
        this.currentPage = 1;
        this.jobsPerPage = 10;
        this.currentJobs = [];
        this.totalJobs = 0;
        this.currentSort = 'relevance';
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
            // Since we can't use real API without keys, we'll simulate API response
            const jobs = await this.simulateJobSearch(keywords, location, minSalary, maxSalary, jobType);
            this.currentJobs = jobs;
            this.totalJobs = jobs.length;
            this.displayJobs();
        } catch (error) {
            console.error('Error searching jobs:', error);
            this.showError('Failed to search jobs. Please try again.');
        } finally {
            this.hideLoading();
        }
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
                <div class="job-salary">$${job.salary_min?.toLocaleString()} - $${job.salary_max?.toLocaleString()}</div>
            </td>
            <td>
                <div class="job-date">${this.formatDate(job.created)}</div>
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
        
        // Populate modal content
        this.modalJobTitle.textContent = job.title;
        this.modalCompany.textContent = job.company;
        this.modalLocation.textContent = job.location;
        this.modalSalary.textContent = `$${job.salary_min?.toLocaleString()} - $${job.salary_max?.toLocaleString()}`;
        this.modalDate.textContent = this.formatDate(job.created);
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
                this.currentJobs.sort((a, b) => new Date(b.created) - new Date(a.created));
                break;
            case 'salary':
                this.currentJobs.sort((a, b) => (b.salary_max || 0) - (a.salary_max || 0));
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
            const jobElement = document.createElement('div');
            jobElement.className = 'favorite-job';
            jobElement.innerHTML = `
                <div style="display: flex; justify-content: between; align-items: flex-start;">
                    <div style="flex: 1;">
                        <h4 class="job-title" onclick="jobApp.showJobModal('${job.id}')">${job.title}</h4>
                        <p><strong>${job.company}</strong> - ${job.location}</p>
                        <p class="job-salary">$${job.salary_min?.toLocaleString()} - $${job.salary_max?.toLocaleString()}</p>
                        <p class="job-date">Posted: ${this.formatDate(job.created)}</p>
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
    
    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        
        return date.toLocaleDateString();
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
