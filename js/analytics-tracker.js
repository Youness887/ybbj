// Advanced Analytics Tracker for Audience Analysis
class AdvancedAnalytics {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.startTime = Date.now();
        this.pageViews = [];
        this.interactions = [];
        this.userBehavior = {
            scrollDepth: 0,
            timeOnPage: 0,
            clickHeatmap: [],
            formInteractions: [],
            botInterests: []
        };
        this.deviceInfo = this.getDeviceInfo();
        this.trafficSource = this.getTrafficSource();
        
        this.init();
    }

    init() {
        // Track page load
        this.trackPageView();
        
        // Set up event listeners
        this.setupScrollTracking();
        this.setupClickTracking();
        this.setupFormTracking();
        this.setupTimeTracking();
        this.setupBotInterestTracking();
        
        // Send data periodically
        setInterval(() => this.sendAnalyticsData(), 30000); // Every 30 seconds
        
        // Send data before page unload
        window.addEventListener('beforeunload', () => this.sendAnalyticsData());
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    getDeviceInfo() {
        const ua = navigator.userAgent;
        return {
            userAgent: ua,
            platform: navigator.platform,
            language: navigator.language,
            screenResolution: `${screen.width}x${screen.height}`,
            viewportSize: `${window.innerWidth}x${window.innerHeight}`,
            deviceType: this.getDeviceType(ua),
            browser: this.getBrowser(ua),
            os: this.getOS(ua)
        };
    }

    getDeviceType(ua) {
        if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet';
        if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(ua)) return 'mobile';
        return 'desktop';
    }

    getBrowser(ua) {
        if (ua.includes('Chrome')) return 'Chrome';
        if (ua.includes('Firefox')) return 'Firefox';
        if (ua.includes('Safari')) return 'Safari';
        if (ua.includes('Edge')) return 'Edge';
        return 'Other';
    }

    getOS(ua) {
        if (ua.includes('Windows')) return 'Windows';
        if (ua.includes('Mac')) return 'macOS';
        if (ua.includes('Linux')) return 'Linux';
        if (ua.includes('Android')) return 'Android';
        if (ua.includes('iOS')) return 'iOS';
        return 'Other';
    }

    getTrafficSource() {
        const referrer = document.referrer;
        const utm = new URLSearchParams(window.location.search);
        
        return {
            referrer: referrer || 'direct',
            utmSource: utm.get('utm_source'),
            utmMedium: utm.get('utm_medium'),
            utmCampaign: utm.get('utm_campaign'),
            utmTerm: utm.get('utm_term'),
            utmContent: utm.get('utm_content')
        };
    }

    trackPageView() {
        const pageView = {
            url: window.location.href,
            title: document.title,
            timestamp: Date.now(),
            referrer: document.referrer
        };
        
        this.pageViews.push(pageView);
        console.log('📊 Page view tracked:', pageView);
    }

    setupScrollTracking() {
        let maxScroll = 0;
        
        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            );
            
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                this.userBehavior.scrollDepth = maxScroll;
            }
        });
    }

    setupClickTracking() {
        document.addEventListener('click', (event) => {
            const clickData = {
                element: event.target.tagName,
                className: event.target.className,
                id: event.target.id,
                text: event.target.textContent?.substring(0, 50),
                x: event.clientX,
                y: event.clientY,
                timestamp: Date.now()
            };
            
            this.userBehavior.clickHeatmap.push(clickData);
            
            // Track bot interest based on clicks
            if (event.target.textContent?.toLowerCase().includes('bot') || 
                event.target.closest('.bot-card') ||
                event.target.closest('[class*="bot"]')) {
                this.trackBotInterest(event.target);
            }
        });
    }

    setupFormTracking() {
        // Track form interactions
        document.querySelectorAll('input, textarea, select').forEach(element => {
            element.addEventListener('focus', () => {
                this.userBehavior.formInteractions.push({
                    type: 'focus',
                    element: element.name || element.id || element.type,
                    timestamp: Date.now()
                });
            });

            element.addEventListener('blur', () => {
                this.userBehavior.formInteractions.push({
                    type: 'blur',
                    element: element.name || element.id || element.type,
                    value: element.value ? 'filled' : 'empty',
                    timestamp: Date.now()
                });
            });
        });

        // Track form submissions
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', (event) => {
                this.userBehavior.formInteractions.push({
                    type: 'submit',
                    formId: form.id || 'unnamed',
                    timestamp: Date.now()
                });
            });
        });
    }

    setupTimeTracking() {
        setInterval(() => {
            this.userBehavior.timeOnPage = Date.now() - this.startTime;
        }, 1000);
    }

    setupBotInterestTracking() {
        // Track which bots users are most interested in
        const botElements = document.querySelectorAll('.bot-card, [href*="bot"], [class*="bot"]');
        
        botElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                const botType = this.identifyBotType(element);
                if (botType) {
                    this.userBehavior.botInterests.push({
                        type: 'hover',
                        bot: botType,
                        timestamp: Date.now()
                    });
                }
            });
        });
    }

    trackBotInterest(element) {
        const botType = this.identifyBotType(element);
        if (botType) {
            this.userBehavior.botInterests.push({
                type: 'click',
                bot: botType,
                timestamp: Date.now()
            });
        }
    }

    identifyBotType(element) {
        const text = element.textContent?.toLowerCase() || '';
        const className = element.className?.toLowerCase() || '';
        const href = element.href?.toLowerCase() || '';
        
        if (text.includes('tiktok') || className.includes('tiktok') || href.includes('tiktok')) {
            return 'tiktok';
        }
        if (text.includes('scraper') || text.includes('scraping') || className.includes('scraper')) {
            return 'webscraper';
        }
        if (text.includes('content') || text.includes('generator') || className.includes('content')) {
            return 'content';
        }
        if (text.includes('prospect') || text.includes('hunter') || className.includes('prospect')) {
            return 'prospect';
        }
        if (text.includes('money') || text.includes('maker') || className.includes('money')) {
            return 'moneymaker';
        }
        
        return null;
    }

    // Conversion tracking
    trackConversion(type, value = 0, currency = 'USD') {
        const conversion = {
            type: type, // 'signup', 'purchase', 'trial', 'contact'
            value: value,
            currency: currency,
            timestamp: Date.now(),
            sessionId: this.sessionId
        };
        
        this.sendConversionData(conversion);
        console.log('💰 Conversion tracked:', conversion);
    }

    // Lead scoring based on behavior
    calculateLeadScore() {
        let score = 0;
        
        // Time on site scoring
        const timeMinutes = this.userBehavior.timeOnPage / (1000 * 60);
        if (timeMinutes > 5) score += 20;
        else if (timeMinutes > 2) score += 10;
        else if (timeMinutes > 1) score += 5;
        
        // Scroll depth scoring
        if (this.userBehavior.scrollDepth > 80) score += 15;
        else if (this.userBehavior.scrollDepth > 50) score += 10;
        else if (this.userBehavior.scrollDepth > 25) score += 5;
        
        // Interaction scoring
        score += Math.min(this.userBehavior.clickHeatmap.length * 2, 20);
        score += this.userBehavior.formInteractions.length * 5;
        score += this.userBehavior.botInterests.length * 3;
        
        // Traffic source scoring
        if (this.trafficSource.utmSource) score += 10; // Came from marketing campaign
        if (this.trafficSource.referrer && this.trafficSource.referrer !== 'direct') score += 5;
        
        return Math.min(score, 100); // Cap at 100
    }

    // A/B testing support
    getTestVariant(testName) {
        const hash = this.hashCode(this.sessionId + testName);
        return hash % 2 === 0 ? 'A' : 'B';
    }

    hashCode(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash);
    }

    // Send analytics data to server
    async sendAnalyticsData() {
        const data = {
            sessionId: this.sessionId,
            timestamp: Date.now(),
            deviceInfo: this.deviceInfo,
            trafficSource: this.trafficSource,
            userBehavior: this.userBehavior,
            pageViews: this.pageViews,
            leadScore: this.calculateLeadScore()
        };

        try {
            // In a real implementation, you would send this to your analytics server
            console.log('📈 Analytics data:', data);
            
            // Store in localStorage for now (in production, send to server)
            const existingData = JSON.parse(localStorage.getItem('userAnalytics') || '[]');
            existingData.push(data);
            localStorage.setItem('userAnalytics', JSON.stringify(existingData.slice(-10))); // Keep last 10 sessions
            
            // You could also send to Google Analytics, Mixpanel, or your own server
            // await fetch('/api/analytics', { method: 'POST', body: JSON.stringify(data) });
            
        } catch (error) {
            console.error('Failed to send analytics data:', error);
        }
    }

    async sendConversionData(conversion) {
        try {
            // In production, send to conversion tracking service
            const existingConversions = JSON.parse(localStorage.getItem('conversions') || '[]');
            existingConversions.push(conversion);
            localStorage.setItem('conversions', JSON.stringify(existingConversions));
            
            console.log('💰 Conversion data stored:', conversion);
        } catch (error) {
            console.error('Failed to send conversion data:', error);
        }
    }

    // Public methods for manual tracking
    trackCustomEvent(eventName, properties = {}) {
        const event = {
            name: eventName,
            properties: properties,
            timestamp: Date.now(),
            sessionId: this.sessionId
        };
        
        this.interactions.push(event);
        console.log('🎯 Custom event tracked:', event);
    }

    // Get user segment based on behavior
    getUserSegment() {
        const leadScore = this.calculateLeadScore();
        const timeOnSite = this.userBehavior.timeOnPage / (1000 * 60);
        const botInterests = this.userBehavior.botInterests.length;
        
        if (leadScore >= 70 && timeOnSite >= 5) return 'hot-lead';
        if (leadScore >= 40 && botInterests >= 3) return 'interested-prospect';
        if (timeOnSite >= 2) return 'engaged-visitor';
        return 'casual-visitor';
    }
}

// Initialize analytics
window.analytics = new AdvancedAnalytics();

// Expose tracking methods globally
window.trackConversion = (type, value, currency) => window.analytics.trackConversion(type, value, currency);
window.trackCustomEvent = (name, properties) => window.analytics.trackCustomEvent(name, properties);
window.getUserSegment = () => window.analytics.getUserSegment();
window.getLeadScore = () => window.analytics.calculateLeadScore();

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdvancedAnalytics;
}
