// Web Scraper Bot JavaScript
// This file handles the functionality for the web scraper bot page

document.addEventListener('DOMContentLoaded', function() {
    const botIntegration = new BotIntegration();
    
    // Get form elements
    const targetUrl = document.getElementById('target-url');
    const scrapeType = document.getElementById('scrape-type');
    const dataSelectors = document.getElementById('data-selectors');
    const delay = document.getElementById('delay');
    const maxPages = document.getElementById('max-pages');
    const outputFormat = document.getElementById('output-format');
    
    // Get control buttons
    const startBtn = document.getElementById('start-bot');
    const pauseBtn = document.getElementById('pause-bot');
    const stopBtn = document.getElementById('stop-bot');
    const downloadBtn = document.getElementById('download-results');
    
    // Validate form inputs
    function validateForm() {
        const url = targetUrl.value.trim();
        const selectors = dataSelectors.value.trim();
        
        if (!url) {
            alert('Please enter a target URL');
            return false;
        }
        
        if (!url.match(/^https?:\/\/.+/)) {
            alert('Please enter a valid URL (must start with http:// or https://)');
            return false;
        }
        
        if (!selectors) {
            alert('Please enter data selectors (CSS or XPath)');
            return false;
        }
        
        return true;
    }
    
    // Get configuration from form
    function getConfig() {
        return {
            targetUrl: targetUrl.value.trim(),
            scrapeType: scrapeType.value,
            dataSelectors: dataSelectors.value.trim(),
            delay: delay.value,
            maxPages: maxPages.value,
            outputFormat: outputFormat.value
        };
    }
    
    // Update button states
    function updateButtonStates(running, paused) {
        startBtn.disabled = running;
        pauseBtn.disabled = !running || paused;
        stopBtn.disabled = !running;
        
        if (paused) {
            pauseBtn.textContent = 'Resume';
        } else {
            pauseBtn.textContent = 'Pause';
        }
    }
    
    // Start bot
    startBtn.addEventListener('click', async function() {
        if (!validateForm()) return;
        
        const config = getConfig();
        
        // Reset results
        botIntegration.results = [];
        botIntegration.totalScraped = 0;
        botIntegration.currentPage = 0;
        
        // Clear previous results
        const container = document.getElementById('results-container');
        container.innerHTML = '<p>Starting scraper...</p>';
        
        // Update button states
        updateButtonStates(true, false);
        downloadBtn.disabled = true;
        
        // Start the bot simulation
        await botIntegration.simulateBot(config);
        
        // Update button states when done
        updateButtonStates(false, false);
    });
    
    // Pause/Resume bot
    pauseBtn.addEventListener('click', function() {
        if (botIntegration.isPaused) {
            botIntegration.resume();
            updateButtonStates(true, false);
        } else {
            botIntegration.pause();
            updateButtonStates(true, true);
        }
    });
    
    // Stop bot
    stopBtn.addEventListener('click', function() {
        botIntegration.stop();
        updateButtonStates(false, false);
        
        if (botIntegration.results.length > 0) {
            downloadBtn.disabled = false;
        }
    });
    
    // Download results
    downloadBtn.addEventListener('click', function() {
        const format = outputFormat.value;
        botIntegration.downloadResults(format);
    });
    
    // Update selectors based on scrape type
    scrapeType.addEventListener('change', function() {
        const type = this.value;
        const selectorExamples = {
            'leads': '.company-name, .contact-email, .phone-number',
            'products': '.product-name, .price, .rating, .availability',
            'real-estate': '.address, .price, .beds, .baths',
            'jobs': '.job-title, .company, .location, .salary',
            'custom': 'Enter your custom CSS selectors here'
        };
        
        dataSelectors.placeholder = selectorExamples[type] || 'Enter CSS selectors or XPath expressions';
        
        // Auto-fill common selectors
        if (type !== 'custom') {
            dataSelectors.value = selectorExamples[type];
        }
    });
    
    // Initialize with default selectors
    scrapeType.dispatchEvent(new Event('change'));
    
    // Add some sample URLs based on scrape type
    const sampleUrls = {
        'leads': 'https://example-business-directory.com',
        'products': 'https://example-ecommerce.com/products',
        'real-estate': 'https://example-realestate.com/listings',
        'jobs': 'https://example-jobs.com/search',
        'custom': 'https://example.com'
    };
    
    scrapeType.addEventListener('change', function() {
        const type = this.value;
        if (sampleUrls[type]) {
            targetUrl.placeholder = sampleUrls[type];
        }
    });
    
    // Form validation on input
    targetUrl.addEventListener('input', function() {
        if (this.value && !this.value.match(/^https?:\/\/.+/)) {
            this.style.borderColor = '#dc3545';
        } else {
            this.style.borderColor = '#ddd';
        }
    });
    
    // Add tooltips and help text
    function addTooltip(element, text) {
        element.title = text;
        element.style.cursor = 'help';
    }
    
    addTooltip(delay, 'Delay between requests to avoid being blocked (1-10 seconds)');
    addTooltip(maxPages, 'Maximum number of pages to scrape (1-1000)');
    addTooltip(dataSelectors, 'CSS selectors or XPath expressions to extract data from the page');
    
    // Add progress indicator
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        width: 100%;
        height: 20px;
        background-color: #f0f0f0;
        border-radius: 10px;
        overflow: hidden;
        margin: 10px 0;
        display: none;
    `;
    
    const progressFill = document.createElement('div');
    progressFill.style.cssText = `
        height: 100%;
        background-color: #28a745;
        width: 0%;
        transition: width 0.3s ease;
    `;
    
    progressBar.appendChild(progressFill);
    document.querySelector('.status-panel').appendChild(progressBar);
    
    // Update progress bar
    const originalUpdateStats = botIntegration.updateStats;
    botIntegration.updateStats = function(pages, dataPoints) {
        originalUpdateStats.call(this, pages, dataPoints);
        
        const maxPages = parseInt(document.getElementById('max-pages').value) || 10;
        const progress = (pages / maxPages) * 100;
        
        progressFill.style.width = progress + '%';
        
        if (this.isRunning) {
            progressBar.style.display = 'block';
        } else {
            progressBar.style.display = 'none';
        }
    };
    
    console.log('Web Scraper Bot initialized successfully');
});
