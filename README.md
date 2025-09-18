# JobSeeker - Job Search Application

A modern, single-page job search application built with HTML, CSS, and JavaScript. Features job searching, favorites management, application tracking, and resume upload functionality.

## 🚀 Features

- **Job Search**: Search jobs by keywords, location, salary range, and job type
- **Advanced Filtering**: Sort results by relevance, date, salary, or company
- **Pagination**: Navigate through job results with pagination
- **Job Details**: View detailed job information in modal popups
- **Favorites System**: Save and manage favorite job listings
- **Application Tracking**: Track your job applications with status updates
- **Resume Upload**: Upload and manage your resume (PDF, DOC, DOCX)
- **Local Storage**: All data persists locally in your browser
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## 🛠️ Setup Instructions

### Option 1: Using Real Adzuna API (Recommended)

1. **Get API Keys**:
   - Visit [Adzuna API](https://developer.adzuna.com/)
   - Sign up for a free developer account
   - Get your `API_KEY` and `APP_ID`

2. **Configure API**:
   - Open `script.js`
   - Replace `YOUR_ADZUNA_API_KEY` with your actual API key
   - Replace `YOUR_ADZUNA_APP_ID` with your actual App ID

3. **Enable CORS** (for local development):
   - Use a local server (not just opening the HTML file)
   - Or use a CORS browser extension for testing

### Option 2: Demo Mode (Current Setup)

The application currently runs in demo mode with simulated job data. This allows you to test all features without API keys.

### Option 3: Alternative APIs

You can also configure other job APIs by modifying the `simulateJobSearch` method:

- **Indeed API**: Requires partner status
- **GitHub Jobs API**: (Deprecated, but you can use archived data)
- **Reed API**: UK-focused job search
- **JSearch API** (RapidAPI): Multiple job board aggregation

## 📁 File Structure

```
JobSearch/
├── index.html          # Main HTML structure
├── styles.css          # CSS styling and responsive design
├── script.js           # JavaScript functionality and API integration
└── README.md          # Setup instructions and documentation
```

## 🎯 How to Use

### 1. Search for Jobs
- Enter keywords (e.g., "Software Developer", "Marketing Manager")
- Specify location (optional)
- Set salary range (optional)
- Select job type (optional)
- Click "Search Jobs"

### 2. Browse Results
- View job listings in a sortable table
- Click job titles to view detailed information
- Use pagination to navigate through results
- Sort by relevance, date, salary, or company

### 3. Manage Favorites
- Click the heart icon to add/remove favorites
- Switch to "Favorites" tab to view saved jobs
- Favorites persist between browser sessions

### 4. Apply to Jobs
- Upload your resume in the "Applications" tab
- Click "Apply Now" on any job
- Track your applications with status updates

## 🔧 Technical Details

### API Integration
- Configured for Adzuna API (modify for other APIs)
- Handles API responses, errors, and loading states
- Implements rate limiting and error recovery

### Local Storage
- Favorites: `jobseeker-favorites`
- Applications: `jobseeker-applications`
- Resume: `jobseeker-resume`

### Responsive Breakpoints
- Desktop: 1200px+
- Tablet: 768px - 1199px
- Mobile: < 768px

## 🎨 Customization

### Styling
- Modify `styles.css` to change colors, fonts, or layout
- CSS variables for easy theme customization
- Font Awesome icons for consistent iconography

### Functionality
- Add more job search filters in the HTML form
- Extend the `JobSearchApp` class for additional features
- Implement user authentication for multi-device sync

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Use a local server (e.g., Live Server in VS Code)
   - Enable CORS in browser for testing

2. **API Rate Limits**:
   - Implement request throttling
   - Cache responses for repeated searches

3. **File Upload Issues**:
   - Check file size limits (5MB max)
   - Ensure correct MIME types (PDF, DOC, DOCX)

## 🚀 Deployment

### GitHub Pages
1. Push code to GitHub repository
2. Go to Settings → Pages
3. Select source branch (main)
4. Access at `https://username.github.io/repository-name`

### Netlify
1. Drag and drop the folder to Netlify
2. Automatic deployment with custom domain support

### Vercel
1. Import GitHub repository
2. Automatic deployment with preview URLs

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Feel free to submit issues, fork the repository, and create pull requests for any improvements.

---

**Note**: This is a demo application. For production use, implement proper error handling, security measures, and backend integration.
