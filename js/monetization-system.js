// Complete Monetization System
class MonetizationSystem {
    constructor() {
        this.revenueStreams = {
            subscriptions: [],
            oneTimePayments: [],
            affiliateCommissions: [],
            adRevenue: [],
            leadGeneration: []
        };
        
        this.pricingPlans = {
            starter: { 
                price: 29, 
                features: ['1 Bot', '5K operations/month', 'Email support'],
                conversionGoal: 'low-commitment'
            },
            professional: { 
                price: 99, 
                features: ['3 Bots', '50K operations/month', 'Priority support', 'Analytics'],
                conversionGoal: 'high-value',
                mostPopular: true
            },
            enterprise: { 
                price: 299, 
                features: ['All Bots', 'Unlimited operations', '24/7 support', 'Custom integrations'],
                conversionGoal: 'enterprise'
            }
        };
        
        this.affiliatePrograms = this.setupAffiliatePrograms();
        this.leadMagnets = this.setupLeadMagnets();
        
        this.init();
    }

    init() {
        this.setupDynamicPricing();
        this.setupConversionOptimization();
        this.setupEmailCapture();
        this.setupRetargeting();
        this.setupUpsellSystem();
        this.setupAnalyticsIntegration();
        this.initializePaymentGateways();
    }

    // Dynamic Pricing Based on User Behavior
    setupDynamicPricing() {
        const userSegment = window.getUserSegment ? window.getUserSegment() : 'casual-visitor';
        const leadScore = window.getLeadScore ? window.getLeadScore() : 0;
        
        // Adjust pricing based on user behavior
        if (userSegment === 'hot-lead' && leadScore > 80) {
            // Hot leads see premium pricing
            this.showPremiumPricing();
        } else if (userSegment === 'casual-visitor') {
            // Casual visitors get discount offers
            this.showDiscountPricing();
        }
        
        // Time-sensitive offers
        this.setupUrgencyTimers();
    }

    showPremiumPricing() {
        // Highlight enterprise features and benefits
        document.querySelectorAll('.pricing-card').forEach(card => {
            if (card.textContent.includes('Enterprise')) {
                card.style.transform = 'scale(1.05)';
                card.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.3)';
            }
        });
    }

    showDiscountPricing() {
        // Add discount badges and limited-time offers
        const discountBanner = document.createElement('div');
        discountBanner.className = 'discount-banner';
        discountBanner.innerHTML = `
            <div class="discount-content">
                <span class="discount-text">🎉 Limited Time: 25% OFF First Month!</span>
                <span class="discount-code">Use code: SAVE25</span>
            </div>
        `;
        discountBanner.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
            color: white;
            padding: 10px;
            text-align: center;
            font-weight: bold;
            z-index: 1000;
            animation: slideDown 0.5s ease-out;
        `;
        
        document.body.insertBefore(discountBanner, document.body.firstChild);
        
        // Adjust main content for banner
        document.body.style.paddingTop = '50px';
        
        // Update pricing displays
        this.applyDiscount(25);
    }

    applyDiscount(percentage) {
        document.querySelectorAll('.text-4xl.font-bold').forEach(priceElement => {
            if (priceElement.textContent.includes('$')) {
                const originalPrice = parseInt(priceElement.textContent.replace(/\D/g, ''));
                const discountedPrice = Math.round(originalPrice * (1 - percentage / 100));
                
                priceElement.innerHTML = `
                    <span style="text-decoration: line-through; color: #999; font-size: 0.7em;">$${originalPrice}</span><br>
                    $${discountedPrice}
                `;
            }
        });
    }

    // Conversion Optimization
    setupConversionOptimization() {
        // Exit intent detection
        let exitIntentShown = false;
        document.addEventListener('mouseleave', (e) => {
            if (e.clientY <= 0 && !exitIntentShown) {
                this.showExitIntentPopup();
                exitIntentShown = true;
            }
        });

        // Scroll-based triggers
        window.addEventListener('scroll', () => {
            const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            
            if (scrollPercent > 75 && !document.querySelector('.conversion-sticky')) {
                this.showStickyConversionBar();
            }
        });

        // Time-based triggers
        setTimeout(() => {
            if (!localStorage.getItem('emailCaptured')) {
                this.showTimedEmailCapture();
            }
        }, 45000); // After 45 seconds
    }

    showExitIntentPopup() {
        const popup = document.createElement('div');
        popup.className = 'exit-intent-popup';
        popup.innerHTML = `
            <div class="popup-overlay">
                <div class="popup-content">
                    <button class="close-popup">&times;</button>
                    <h3>Wait! Don't Leave Empty-Handed!</h3>
                    <p>Get our <strong>FREE Bot Setup Guide</strong> + 14-day trial</p>
                    <form class="email-capture-form">
                        <input type="email" placeholder="Enter your email" required>
                        <button type="submit">Get Free Guide</button>
                    </form>
                    <small>No spam, unsubscribe anytime</small>
                </div>
            </div>
        `;
        
        popup.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease-out;
        `;
        
        document.body.appendChild(popup);
        
        // Handle form submission
        popup.querySelector('form').addEventListener('submit', (e) => {
            e.preventDefault();
            const email = popup.querySelector('input[type="email"]').value;
            this.captureEmail(email, 'exit-intent');
            popup.remove();
        });
        
        // Close popup
        popup.querySelector('.close-popup').addEventListener('click', () => {
            popup.remove();
        });
    }

    showStickyConversionBar() {
        const stickyBar = document.createElement('div');
        stickyBar.className = 'conversion-sticky';
        stickyBar.innerHTML = `
            <div class="sticky-content">
                <span class="sticky-text">🚀 Ready to automate your business?</span>
                <button class="sticky-cta" onclick="document.getElementById('pricing').scrollIntoView()">
                    Start Free Trial
                </button>
                <button class="sticky-close">&times;</button>
            </div>
        `;
        
        stickyBar.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: linear-gradient(45deg, #667eea, #764ba2);
            color: white;
            padding: 15px;
            text-align: center;
            z-index: 1000;
            animation: slideUp 0.5s ease-out;
        `;
        
        document.body.appendChild(stickyBar);
        
        // Close functionality
        stickyBar.querySelector('.sticky-close').addEventListener('click', () => {
            stickyBar.remove();
        });
    }

    // Email Capture System
    setupEmailCapture() {
        // Add multiple email capture points
        this.addNewsletterSignup();
        this.addContentUpgrades();
        this.addProgressiveProfiling();
    }

    addNewsletterSignup() {
        const newsletter = document.createElement('div');
        newsletter.className = 'newsletter-signup';
        newsletter.innerHTML = `
            <div class="newsletter-content">
                <h3>📧 Get Bot Automation Tips</h3>
                <p>Weekly insights on maximizing your bot ROI</p>
                <form class="newsletter-form">
                    <input type="email" placeholder="Your email address" required>
                    <button type="submit">Subscribe</button>
                </form>
            </div>
        `;
        
        // Insert before footer
        const footer = document.querySelector('footer');
        if (footer) {
            footer.parentNode.insertBefore(newsletter, footer);
        }
        
        newsletter.querySelector('form').addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletter.querySelector('input').value;
            this.captureEmail(email, 'newsletter');
        });
    }

    captureEmail(email, source) {
        // Store email capture
        const emailData = {
            email: email,
            source: source,
            timestamp: Date.now(),
            userSegment: window.getUserSegment ? window.getUserSegment() : 'unknown',
            leadScore: window.getLeadScore ? window.getLeadScore() : 0
        };
        
        // Store locally (in production, send to your email service)
        const emails = JSON.parse(localStorage.getItem('capturedEmails') || '[]');
        emails.push(emailData);
        localStorage.setItem('capturedEmails', JSON.stringify(emails));
        localStorage.setItem('emailCaptured', 'true');
        
        // Track conversion
        if (window.trackConversion) {
            window.trackConversion('email-capture', 0);
        }
        
        // Start email automation sequence
        this.triggerEmailSequence(emailData);
        
        // Show success message
        this.showSuccessMessage('Thanks! Check your email for your free guide.');
        
        console.log('📧 Email captured:', emailData);
    }

    triggerEmailSequence(emailData) {
        // Email automation sequence (integrate with your email service)
        const sequence = [
            { day: 0, subject: 'Your Free Bot Setup Guide', type: 'welcome' },
            { day: 1, subject: 'How Sarah Made $10K with TikTok Bots', type: 'case-study' },
            { day: 3, subject: 'Common Bot Mistakes to Avoid', type: 'educational' },
            { day: 7, subject: 'Ready to Start? 50% Off This Week', type: 'promotion' },
            { day: 14, subject: 'Last Chance: Your Trial Expires Soon', type: 'urgency' }
        ];
        
        // Store sequence for processing
        localStorage.setItem(`emailSequence_${emailData.email}`, JSON.stringify(sequence));
        
        console.log('📨 Email sequence triggered for:', emailData.email);
    }

    // Affiliate & Partnership Programs
    setupAffiliatePrograms() {
        return {
            // High-converting affiliate products
            zapier: {
                name: 'Zapier Automation',
                commission: 0.30,
                cookieDuration: 90,
                link: 'https://zapier.com/?via=affiliate',
                relevance: 'automation-tools'
            },
            hubspot: {
                name: 'HubSpot CRM',
                commission: 0.15,
                cookieDuration: 90,
                link: 'https://hubspot.com/?via=affiliate',
                relevance: 'lead-management'
            },
            mailchimp: {
                name: 'Mailchimp Email Marketing',
                commission: 0.20,
                cookieDuration: 30,
                link: 'https://mailchimp.com/?via=affiliate',
                relevance: 'email-marketing'
            }
        };
    }

    addAffiliateRecommendations() {
        const recommendations = document.createElement('div');
        recommendations.className = 'affiliate-recommendations';
        recommendations.innerHTML = `
            <div class="recommendations-container">
                <h3>🛠️ Recommended Tools to Maximize Your Bot ROI</h3>
                <div class="tools-grid">
                    <div class="tool-card">
                        <h4>Zapier Integration</h4>
                        <p>Connect your bots to 3000+ apps</p>
                        <a href="${this.affiliatePrograms.zapier.link}" target="_blank" class="affiliate-link">
                            Try Free →
                        </a>
                    </div>
                    <div class="tool-card">
                        <h4>HubSpot CRM</h4>
                        <p>Manage leads generated by your bots</p>
                        <a href="${this.affiliatePrograms.hubspot.link}" target="_blank" class="affiliate-link">
                            Get Started →
                        </a>
                    </div>
                </div>
            </div>
        `;
        
        // Add after services section
        const servicesSection = document.getElementById('services');
        if (servicesSection) {
            servicesSection.parentNode.insertBefore(recommendations, servicesSection.nextSibling);
        }
        
        // Track affiliate clicks
        recommendations.querySelectorAll('.affiliate-link').forEach(link => {
            link.addEventListener('click', () => {
                if (window.trackCustomEvent) {
                    window.trackCustomEvent('affiliate-click', {
                        product: link.closest('.tool-card').querySelector('h4').textContent
                    });
                }
            });
        });
    }

    // Lead Generation & Qualification
    setupLeadMagnets() {
        return {
            botSetupGuide: {
                title: 'Complete Bot Setup Guide',
                description: '50-page guide on setting up profitable bots',
                value: 47,
                conversionRate: 0.35
            },
            profitCalculator: {
                title: 'Bot ROI Calculator',
                description: 'Calculate your potential monthly profits',
                value: 29,
                conversionRate: 0.42,
                interactive: true
            },
            caseStudyPack: {
                title: '10 Bot Success Stories',
                description: 'Real case studies with exact strategies',
                value: 67,
                conversionRate: 0.28
            }
        };
    }

    createInteractiveCalculator() {
        const calculator = document.createElement('div');
        calculator.className = 'profit-calculator';
        calculator.innerHTML = `
            <div class="calculator-container">
                <h3>🧮 Calculate Your Bot Profit Potential</h3>
                <div class="calculator-form">
                    <div class="input-group">
                        <label>Hours you spend on manual tasks per week:</label>
                        <input type="range" id="manual-hours" min="5" max="60" value="20">
                        <span id="hours-display">20 hours</span>
                    </div>
                    <div class="input-group">
                        <label>Your hourly rate ($):</label>
                        <input type="number" id="hourly-rate" value="25" min="10" max="200">
                    </div>
                    <div class="calculator-result">
                        <h4>Monthly Savings: $<span id="monthly-savings">2000</span></h4>
                        <h4>Yearly Savings: $<span id="yearly-savings">24000</span></h4>
                    </div>
                    <button class="get-calculator" onclick="monetization.requestCalculatorAccess()">
                        Get Full Calculator + Strategy Guide
                    </button>
                </div>
            </div>
        `;
        
        // Add interactive functionality
        const hoursSlider = calculator.querySelector('#manual-hours');
        const hourlyRate = calculator.querySelector('#hourly-rate');
        const hoursDisplay = calculator.querySelector('#hours-display');
        const monthlySavings = calculator.querySelector('#monthly-savings');
        const yearlySavings = calculator.querySelector('#yearly-savings');
        
        const updateCalculation = () => {
            const hours = parseInt(hoursSlider.value);
            const rate = parseInt(hourlyRate.value);
            const monthly = hours * rate * 4; // 4 weeks per month
            const yearly = monthly * 12;
            
            hoursDisplay.textContent = `${hours} hours`;
            monthlySavings.textContent = monthly.toLocaleString();
            yearlySavings.textContent = yearly.toLocaleString();
        };
        
        hoursSlider.addEventListener('input', updateCalculation);
        hourlyRate.addEventListener('input', updateCalculation);
        
        return calculator;
    }

    requestCalculatorAccess() {
        // Show email capture for calculator
        const email = prompt('Enter your email to get the full calculator:');
        if (email) {
            this.captureEmail(email, 'calculator');
            alert('Calculator sent! Check your email.');
        }
    }

    // Payment Integration
    initializePaymentGateways() {
        // Multiple payment options for global reach
        this.paymentMethods = {
            stripe: this.initializeStripe(),
            paypal: this.initializePayPal(),
            crypto: this.initializeCrypto()
        };
    }

    initializeStripe() {
        if (typeof Stripe !== 'undefined') {
            return Stripe(process.env.STRIPE_PUBLIC_KEY || 'pk_test_demo');
        }
        return null;
    }

    initializePayPal() {
        // PayPal integration would go here
        return {
            clientId: process.env.PAYPAL_CLIENT_ID || 'demo',
            currency: 'USD'
        };
    }

    initializeCrypto() {
        // Crypto payment integration (Coinbase Commerce, etc.)
        return {
            supportedCurrencies: ['BTC', 'ETH', 'USDC'],
            apiKey: process.env.COINBASE_API_KEY || 'demo'
        };
    }

    // Revenue Analytics
    trackRevenue(amount, source, currency = 'USD') {
        const revenueData = {
            amount: amount,
            source: source,
            currency: currency,
            timestamp: Date.now(),
            userSegment: window.getUserSegment ? window.getUserSegment() : 'unknown'
        };
        
        // Store revenue data
        const revenue = JSON.parse(localStorage.getItem('revenueData') || '[]');
        revenue.push(revenueData);
        localStorage.setItem('revenueData', JSON.stringify(revenue));
        
        // Update revenue streams
        if (source.includes('subscription')) {
            this.revenueStreams.subscriptions.push(revenueData);
        } else if (source.includes('affiliate')) {
            this.revenueStreams.affiliateCommissions.push(revenueData);
        } else {
            this.revenueStreams.oneTimePayments.push(revenueData);
        }
        
        console.log('💰 Revenue tracked:', revenueData);
        
        // Trigger thank you sequence
        this.triggerPostPurchaseSequence(revenueData);
    }

    triggerPostPurchaseSequence(revenueData) {
        // Post-purchase automation
        setTimeout(() => {
            this.showUpsellOffers(revenueData);
        }, 2000);
        
        // Schedule follow-up emails
        const followUps = [
            { day: 1, type: 'onboarding' },
            { day: 7, type: 'tips' },
            { day: 30, type: 'upsell' }
        ];
        
        localStorage.setItem(`followUp_${Date.now()}`, JSON.stringify(followUps));
    }

    // Upsell & Cross-sell System
    setupUpsellSystem() {
        // Show relevant upsells based on user behavior
        document.addEventListener('click', (event) => {
            if (event.target.textContent?.includes('Get Started') || 
                event.target.textContent?.includes('Start Trial')) {
                
                setTimeout(() => {
                    this.showRelevantUpsells();
                }, 5000);
            }
        });
    }

    showRelevantUpsells() {
        const userSegment = window.getUserSegment ? window.getUserSegment() : 'casual-visitor';
        
        let upsellOffer;
        if (userSegment === 'hot-lead') {
            upsellOffer = {
                title: '🚀 Upgrade to Professional',
                description: 'Get 3 bots + priority support for just $70 more',
                savings: '$29/month savings'
            };
        } else {
            upsellOffer = {
                title: '📈 Add Web Scraper Bot',
                description: 'Perfect complement to your TikTok bot',
                savings: 'Limited time: 50% off'
            };
        }
        
        this.displayUpsellModal(upsellOffer);
    }

    displayUpsellModal(offer) {
        const modal = document.createElement('div');
        modal.className = 'upsell-modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <h3>${offer.title}</h3>
                    <p>${offer.description}</p>
                    <div class="savings">${offer.savings}</div>
                    <div class="modal-actions">
                        <button class="accept-upsell">Yes, Add This!</button>
                        <button class="decline-upsell">No Thanks</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.querySelector('.accept-upsell').addEventListener('click', () => {
            this.trackRevenue(70, 'upsell-professional');
            modal.remove();
        });
        
        modal.querySelector('.decline-upsell').addEventListener('click', () => {
            modal.remove();
        });
    }

    // Analytics Dashboard
    generateRevenueReport() {
        const totalRevenue = this.calculateTotalRevenue();
        const revenueBySource = this.getRevenueBySource();
        const conversionRates = this.calculateConversionRates();
        
        return {
            totalRevenue,
            revenueBySource,
            conversionRates,
            topPerformingOffers: this.getTopPerformingOffers(),
            userSegmentValue: this.getUserSegmentValue()
        };
    }

    calculateTotalRevenue() {
        const allRevenue = JSON.parse(localStorage.getItem('revenueData') || '[]');
        return allRevenue.reduce((total, item) => total + item.amount, 0);
    }

    getRevenueBySource() {
        const allRevenue = JSON.parse(localStorage.getItem('revenueData') || '[]');
        const bySource = {};
        
        allRevenue.forEach(item => {
            bySource[item.source] = (bySource[item.source] || 0) + item.amount;
        });
        
        return bySource;
    }

    showSuccessMessage(message) {
        const successDiv = document.createElement('div');
        successDiv.textContent = message;
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }
}

// Initialize monetization system
const monetization = new MonetizationSystem();

// Expose methods globally
window.monetization = monetization;
window.trackRevenue = (amount, source, currency) => monetization.trackRevenue(amount, source, currency);

// Auto-start key features
document.addEventListener('DOMContentLoaded', () => {
    // Add affiliate recommendations
    setTimeout(() => {
        monetization.addAffiliateRecommendations();
    }, 2000);
    
    // Add profit calculator
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
        const calculator = monetization.createInteractiveCalculator();
        servicesSection.parentNode.insertBefore(calculator, servicesSection.nextSibling);
    }
});

console.log('🚀 Monetization system initialized');
