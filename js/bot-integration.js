// Bot Integration Utilities
// This file contains shared functionality for all bot pages

class BotIntegration {
    constructor() {
        this.isRunning = false;
        this.isPaused = false;
        this.results = [];
        this.totalScraped = 0;
        this.currentPage = 0;
        this.errors = [];
        this.startTime = null;
        this.setupNotifications();
    }

    // Setup notification system
    setupNotifications() {
        this.createNotificationContainer();
    }

    // Create notification container
    createNotificationContainer() {
        if (!document.getElementById('notification-container')) {
            const container = document.createElement('div');
            container.id = 'notification-container';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1000;
                max-width: 300px;
            `;
            document.body.appendChild(container);
        }
    }

    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            background: ${type === 'error' ? '#e74c3c' : type === 'success' ? '#27ae60' : '#3498db'};
            color: white;
            padding: 15px;
            margin-bottom: 10px;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;

        const container = document.getElementById('notification-container');
        container.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    // Update bot status display
    updateStatus(status, className) {
        const statusIndicator = document.getElementById('status-indicator');
        const statusText = document.getElementById('status-text');
        
        if (statusIndicator && statusText) {
            statusIndicator.className = `status-indicator ${className}`;
            statusText.textContent = status;
        }
    }

    // Update statistics
    updateStats(pages, dataPoints) {
        const pagesElement = document.getElementById('pages-scraped');
        const dataPointsElement = document.getElementById('data-points');
        
        if (pagesElement) pagesElement.textContent = pages;
        if (dataPointsElement) dataPointsElement.textContent = dataPoints;
    }

    // Add result to display
    addResult(result) {
        const container = document.getElementById('results-container');
        if (!container) return;

        // Clear "no results" message
        if (this.results.length === 0) {
            container.innerHTML = '';
        }

        this.results.push(result);
        
        const resultDiv = document.createElement('div');
        resultDiv.className = 'result-item';
        resultDiv.style.cssText = `
            border: 1px solid #ddd;
            padding: 10px;
            margin: 5px 0;
            background: #f9f9f9;
            border-radius: 5px;
        `;
        
        resultDiv.innerHTML = `
            <strong>Page ${this.currentPage + 1}:</strong> ${JSON.stringify(result, null, 2)}
        `;
        
        container.appendChild(resultDiv);
        container.scrollTop = container.scrollHeight;
    }

    // Enhanced bot simulation with analytics
    async simulateBot(config) {
        this.isRunning = true;
        this.isPaused = false;
        this.startTime = Date.now();
        this.updateStatus('Running', 'status-running');
        this.showNotification('Bot started successfully!', 'success');

        const maxPages = parseInt(config.maxPages) || 10;
        const delay = parseInt(config.delay) || 2;

        try {
            for (let i = 0; i < maxPages && this.isRunning; i++) {
                // Check if paused
                while (this.isPaused && this.isRunning) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }

                if (!this.isRunning) break;

                this.currentPage = i;
                
                // Show progress notification
                if (i % 5 === 0 && i > 0) {
                    this.showNotification(`Processing page ${i + 1}/${maxPages}`, 'info');
                }
                
                // Simulate scraping delay with progress
                await this.simulateProgressDelay(delay * 1000);

                // Simulate potential errors (5% chance)
                if (Math.random() < 0.05) {
                    const error = `Warning: Minor issue on page ${i + 1}`;
                    this.errors.push(error);
                    this.showNotification(error, 'error');
                }

                // Simulate scraped data
                const mockData = this.generateMockData(config.scrapeType);
                this.addResult(mockData);
                this.totalScraped += Math.floor(Math.random() * 5) + 1;
                
                this.updateStats(i + 1, this.totalScraped);
            }

            if (this.isRunning) {
                const duration = (Date.now() - this.startTime) / 1000;
                this.updateStatus('Completed', 'status-stopped');
                this.enableDownload();
                this.showNotification(`Bot completed in ${duration.toFixed(1)}s!`, 'success');
            }
        } catch (error) {
            this.errors.push(error.message);
            this.showNotification('Bot encountered an error', 'error');
            this.updateStatus('Error', 'status-stopped');
        }
        
        this.isRunning = false;
    }

    // Simulate progress delay with visual feedback
    async simulateProgressDelay(delay) {
        const steps = 10;
        const stepDelay = delay / steps;
        
        for (let i = 0; i < steps; i++) {
            if (!this.isRunning) break;
            await new Promise(resolve => setTimeout(resolve, stepDelay));
        }
    }

    // Generate mock data based on scrape type
    generateMockData(scrapeType) {
        const mockData = {
            leads: {
                company: `Sample Company ${Math.floor(Math.random() * 100)}`,
                contact: `contact${Math.floor(Math.random() * 100)}@example.com`,
                phone: `+1-555-${Math.floor(Math.random() * 9000) + 1000}`,
                industry: 'Technology'
            },
            products: {
                name: `Product ${Math.floor(Math.random() * 100)}`,
                price: `$${(Math.random() * 500 + 10).toFixed(2)}`,
                rating: `${(Math.random() * 2 + 3).toFixed(1)}/5`,
                availability: 'In Stock'
            },
            'real-estate': {
                address: `${Math.floor(Math.random() * 9999)} Sample St`,
                price: `$${(Math.random() * 500000 + 100000).toFixed(0)}`,
                beds: Math.floor(Math.random() * 5) + 1,
                baths: Math.floor(Math.random() * 3) + 1
            },
            jobs: {
                title: `Job Title ${Math.floor(Math.random() * 100)}`,
                company: `Company ${Math.floor(Math.random() * 100)}`,
                location: 'Remote',
                salary: `$${(Math.random() * 50000 + 40000).toFixed(0)}/year`
            },
            custom: {
                data: `Custom data point ${Math.floor(Math.random() * 1000)}`,
                value: Math.floor(Math.random() * 100),
                timestamp: new Date().toISOString()
            }
        };

        return mockData[scrapeType] || mockData.custom;
    }

    // Enable download button
    enableDownload() {
        const downloadBtn = document.getElementById('download-results');
        if (downloadBtn) {
            downloadBtn.disabled = false;
        }
    }

    // Download results
    downloadResults(format) {
        if (this.results.length === 0) {
            alert('No results to download');
            return;
        }

        let content, filename, mimeType;

        switch (format) {
            case 'json':
                content = JSON.stringify(this.results, null, 2);
                filename = 'scraped-data.json';
                mimeType = 'application/json';
                break;
            case 'csv':
                content = this.convertToCSV(this.results);
                filename = 'scraped-data.csv';
                mimeType = 'text/csv';
                break;
            default:
                content = JSON.stringify(this.results, null, 2);
                filename = 'scraped-data.json';
                mimeType = 'application/json';
        }

        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Convert results to CSV format
    convertToCSV(data) {
        if (data.length === 0) return '';

        const headers = Object.keys(data[0]);
        const csvRows = [headers.join(',')];

        for (const row of data) {
            const values = headers.map(header => {
                const value = row[header];
                return typeof value === 'string' ? `"${value}"` : value;
            });
            csvRows.push(values.join(','));
        }

        return csvRows.join('\n');
    }

    // Stop bot
    stop() {
        this.isRunning = false;
        this.isPaused = false;
        this.updateStatus('Stopped', 'status-stopped');
    }

    // Pause bot
    pause() {
        this.isPaused = true;
        this.updateStatus('Paused', 'status-paused');
    }

    // Resume bot
    resume() {
        this.isPaused = false;
        this.updateStatus('Running', 'status-running');
    }
}

// Make BotIntegration globally available
window.BotIntegration = BotIntegration;
