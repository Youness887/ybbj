// Payment Integration System
// This handles payment processing for bot services

class PaymentIntegration {
    constructor() {
        this.pricingPlans = {
            'basic': {
                name: 'Basic Plan',
                price: 29.99,
                features: ['Web Scraper Bot', '1,000 requests/month', 'Basic support'],
                stripePriceId: 'price_basic_monthly'
            },
            'pro': {
                name: 'Pro Plan',
                price: 99.99,
                features: ['All Bots', '10,000 requests/month', 'Priority support', 'Custom integrations'],
                stripePriceId: 'price_pro_monthly'
            },
            'enterprise': {
                name: 'Enterprise Plan',
                price: 299.99,
                features: ['Unlimited requests', 'Dedicated support', 'Custom development', 'API access'],
                stripePriceId: 'price_enterprise_monthly'
            }
        };
        
        this.paymentMethods = ['stripe', 'paypal', 'crypto'];
        this.setupPaymentButtons();
    }

    // Setup payment buttons
    setupPaymentButtons() {
        document.addEventListener('DOMContentLoaded', () => {
            this.addPricingSection();
            this.addPaymentModal();
        });
    }

    // Add pricing section to main page
    addPricingSection() {
        const contactSection = document.getElementById('contact');
        if (!contactSection) return;

        const pricingHTML = `
            <section id="pricing" class="pricing-section">
                <div class="container">
                    <h2>Choose Your Plan</h2>
                    <div class="pricing-grid">
                        ${Object.entries(this.pricingPlans).map(([key, plan]) => `
                            <div class="pricing-card ${key === 'pro' ? 'featured' : ''}">
                                <h3>${plan.name}</h3>
                                <div class="price">$${plan.price}<span>/month</span></div>
                                <ul class="features">
                                    ${plan.features.map(feature => `<li>${feature}</li>`).join('')}
                                </ul>
                                <button class="btn primary subscribe-btn" data-plan="${key}">
                                    Get Started
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </section>
        `;

        contactSection.insertAdjacentHTML('beforebegin', pricingHTML);
        this.addPricingStyles();
        this.attachPricingEvents();
    }

    // Add pricing styles
    addPricingStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .pricing-section {
                background: #f8f9fa;
                padding: 4rem 0;
                text-align: center;
            }
            .pricing-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 2rem;
                margin-top: 2rem;
            }
            .pricing-card {
                background: white;
                border-radius: 10px;
                padding: 2rem;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                transition: transform 0.3s ease;
            }
            .pricing-card:hover {
                transform: translateY(-5px);
            }
            .pricing-card.featured {
                border: 2px solid #007bff;
                transform: scale(1.05);
            }
            .pricing-card h3 {
                color: #333;
                margin-bottom: 1rem;
            }
            .price {
                font-size: 2.5rem;
                font-weight: bold;
                color: #007bff;
                margin: 1rem 0;
            }
            .price span {
                font-size: 1rem;
                color: #666;
            }
            .features {
                list-style: none;
                padding: 0;
                margin: 1.5rem 0;
            }
            .features li {
                padding: 0.5rem 0;
                border-bottom: 1px solid #eee;
            }
            .features li:last-child {
                border-bottom: none;
            }
            .subscribe-btn {
                width: 100%;
                padding: 1rem;
                margin-top: 1rem;
            }
        `;
        document.head.appendChild(style);
    }

    // Attach pricing events
    attachPricingEvents() {
        document.querySelectorAll('.subscribe-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const plan = e.target.dataset.plan;
                this.showPaymentModal(plan);
            });
        });
    }

    // Add payment modal
    addPaymentModal() {
        const modalHTML = `
            <div id="payment-modal" class="payment-modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Complete Your Purchase</h2>
                        <span class="close-modal">&times;</span>
                    </div>
                    <div class="modal-body">
                        <div class="plan-summary">
                            <h3 id="selected-plan-name"></h3>
                            <div id="selected-plan-price"></div>
                            <ul id="selected-plan-features"></ul>
                        </div>
                        
                        <div class="payment-methods">
                            <h4>Choose Payment Method</h4>
                            <div class="payment-options">
                                <button class="payment-option" data-method="stripe">
                                    <img src="https://stripe.com/img/v3/home/social.png" alt="Stripe" style="width: 60px;">
                                    Credit Card
                                </button>
                                <button class="payment-option" data-method="paypal">
                                    <img src="https://www.paypalobjects.com/webstatic/mktg/Logo/pp-logo-100px.png" alt="PayPal" style="width: 60px;">
                                    PayPal
                                </button>
                                <button class="payment-option" data-method="crypto">
                                    <span style="font-size: 24px;">₿</span>
                                    Cryptocurrency
                                </button>
                            </div>
                        </div>
                        
                        <div class="payment-form" id="payment-form">
                            <!-- Payment form will be inserted here -->
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.addModalStyles();
        this.attachModalEvents();
    }

    // Add modal styles
    addModalStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .payment-modal {
                display: none;
                position: fixed;
                z-index: 1000;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0,0,0,0.5);
            }
            .modal-content {
                background-color: white;
                margin: 5% auto;
                padding: 0;
                border-radius: 10px;
                width: 90%;
                max-width: 600px;
                max-height: 80vh;
                overflow-y: auto;
            }
            .modal-header {
                padding: 1rem 2rem;
                border-bottom: 1px solid #eee;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .close-modal {
                font-size: 2rem;
                cursor: pointer;
                color: #999;
            }
            .modal-body {
                padding: 2rem;
            }
            .plan-summary {
                background: #f8f9fa;
                padding: 1rem;
                border-radius: 5px;
                margin-bottom: 2rem;
            }
            .payment-options {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 1rem;
                margin: 1rem 0;
            }
            .payment-option {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 0.5rem;
                padding: 1rem;
                border: 2px solid #ddd;
                border-radius: 5px;
                background: white;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            .payment-option:hover {
                border-color: #007bff;
            }
            .payment-option.selected {
                border-color: #007bff;
                background: #f0f8ff;
            }
            .payment-form {
                margin-top: 2rem;
            }
        `;
        document.head.appendChild(style);
    }

    // Attach modal events
    attachModalEvents() {
        const modal = document.getElementById('payment-modal');
        const closeBtn = document.querySelector('.close-modal');
        
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        // Payment method selection
        document.querySelectorAll('.payment-option').forEach(option => {
            option.addEventListener('click', (e) => {
                document.querySelectorAll('.payment-option').forEach(opt => opt.classList.remove('selected'));
                e.currentTarget.classList.add('selected');
                
                const method = e.currentTarget.dataset.method;
                this.showPaymentForm(method);
            });
        });
    }

    // Show payment modal
    showPaymentModal(planKey) {
        const plan = this.pricingPlans[planKey];
        const modal = document.getElementById('payment-modal');
        
        // Store current plan for crypto payments
        this.currentPlan = planKey;
        
        document.getElementById('selected-plan-name').textContent = plan.name;
        document.getElementById('selected-plan-price').textContent = `$${plan.price}/month`;
        document.getElementById('selected-plan-features').innerHTML = 
            plan.features.map(feature => `<li>${feature}</li>`).join('');
        
        modal.style.display = 'block';
    }

    // Show payment form based on method
    showPaymentForm(method) {
        const formContainer = document.getElementById('payment-form');
        
        switch(method) {
            case 'stripe':
                formContainer.innerHTML = this.getStripeForm();
                this.initializeStripe();
                break;
            case 'paypal':
                formContainer.innerHTML = this.getPayPalForm();
                this.initializePayPal();
                break;
            case 'crypto':
                formContainer.innerHTML = this.getCryptoForm();
                this.initializeCrypto();
                break;
        }
    }

    // Get Stripe form
    getStripeForm() {
        return `
            <div class="stripe-form">
                <h4>Credit Card Payment</h4>
                <div class="form-group">
                    <label>Card Number</label>
                    <input type="text" id="card-number" placeholder="1234 5678 9012 3456">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Expiry Date</label>
                        <input type="text" id="expiry" placeholder="MM/YY">
                    </div>
                    <div class="form-group">
                        <label>CVC</label>
                        <input type="text" id="cvc" placeholder="123">
                    </div>
                </div>
                <div class="form-group">
                    <label>Cardholder Name</label>
                    <input type="text" id="cardholder-name" placeholder="John Doe">
                </div>
                <button class="btn primary" id="stripe-submit">Complete Payment</button>
            </div>
        `;
    }

    // Get PayPal form
    getPayPalForm() {
        return `
            <div class="paypal-form">
                <h4>PayPal Payment</h4>
                <p>You will be redirected to PayPal to complete your payment.</p>
                <div id="paypal-button-container"></div>
            </div>
        `;
    }

    // Get crypto form
    getCryptoForm() {
        return `
            <div class="crypto-form">
                <h4>Cryptocurrency Payment</h4>
                <p class="crypto-info">Select your preferred cryptocurrency below:</p>
                <div class="crypto-options">
                    <button class="crypto-option" data-crypto="bitcoin">
                        <span style="font-size: 24px; color: #f7931a;">₿</span> Bitcoin
                    </button>
                    <button class="crypto-option" data-crypto="ethereum">
                        <span style="font-size: 24px; color: #627eea;">Ξ</span> Ethereum
                    </button>
                    <button class="crypto-option" data-crypto="usdt">
                        <span style="font-size: 24px; color: #26a17b;">₮</span> USDT
                    </button>
                    <button class="crypto-option" data-crypto="litecoin">
                        <span style="font-size: 24px; color: #bfbbbb;">Ł</span> Litecoin
                    </button>
                    <button class="crypto-option" data-crypto="dogecoin">
                        <span style="font-size: 24px; color: #c2a633;">Ð</span> Dogecoin
                    </button>
                </div>
                <div id="crypto-payment-details" style="display: none;">
                    <div class="payment-instructions">
                        <h5>Payment Instructions:</h5>
                        <ol>
                            <li>Copy the wallet address below</li>
                            <li>Send the exact amount to this address</li>
                            <li>Your subscription will be activated once payment is confirmed</li>
                        </ol>
                    </div>
                    <div class="crypto-address-section">
                        <label>Wallet Address:</label>
                        <div class="crypto-address">
                            <input type="text" id="crypto-address" readonly>
                            <button class="btn secondary" id="copy-address">Copy</button>
                        </div>
                    </div>
                    <div class="crypto-amount-section">
                        <label>Amount to Send:</label>
                        <div class="amount-display">
                            <span id="crypto-amount"></span>
                        </div>
                    </div>
                    <div class="crypto-warning">
                        <p><strong>Important:</strong> Send only the exact amount shown above. Sending a different amount may result in loss of funds.</p>
                    </div>
                </div>
            </div>
        `;
    }

    // Initialize Stripe (placeholder - requires actual Stripe integration)
    initializeStripe() {
        // This would integrate with actual Stripe API
        document.getElementById('stripe-submit').addEventListener('click', () => {
            alert('Stripe integration would be implemented here. Please set up your Stripe account and add the actual integration.');
        });
    }

    // Initialize PayPal (placeholder - requires actual PayPal integration)
    initializePayPal() {
        const paypalConfig = window.PaymentConfig?.paypal || {};
        const currentPlan = this.currentPlan || 'basic';
        const planPrice = this.pricingPlans[currentPlan].price;
        
        // Create PayPal.Me link with amount
        const paypalMeLink = paypalConfig.paypalMeLink ? 
            `${paypalConfig.paypalMeLink}/${planPrice}` : 
            paypalConfig.returnUrls.cancel;
lConfig.returnUrls.cancel;
        
        document.getElementById('paypal-button-container').innerHTML = `
            <div class="paypal-options">
                <a href="${paypalMeLink}" target="_blank" class="btn primary paypal-me-btn">
                    Pay $${planPrice} with PayPal.Me
                </a>
                <p class="paypal-info">Click the button above to pay via PayPal.Me</p>
                <p class="paypal-email">Or send payment to: ${paypalConfig.businessEmail || 'Not configured'}</p>
            </div>
        `;
    }

    // Initialize Crypto payments
    initializeCrypto() {
        const cryptoOptions = document.querySelectorAll('.crypto-option');
        const cryptoDetails = document.getElementById('crypto-payment-details');
        
        cryptoOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                const crypto = e.currentTarget.dataset.crypto;
                this.showCryptoPayment(crypto);
                cryptoDetails.style.display = 'block';
            });
        });
    }

    // Show crypto payment details
    showCryptoPayment(crypto) {
        // Use addresses from PaymentConfig
        const walletConfig = window.PaymentConfig?.cryptoWallets || {};
        const pricingConfig = window.PaymentConfig?.pricing || {};
        
        // Get current plan price
        const currentPlan = this.currentPlan || 'basic';
        const planPricing = pricingConfig[currentPlan];
        
        // Set wallet address
        const walletAddress = walletConfig[crypto]?.address || 'Wallet not configured';
        document.getElementById('crypto-address').value = walletAddress;
        
        // Set amount based on current plan
        let amount = '0';
        let unit = crypto.toUpperCase();
        
        if (planPricing && planPricing.crypto && planPricing.crypto[crypto]) {
            amount = planPricing.crypto[crypto];
            
            // Format amount based on cryptocurrency
            switch(crypto) {
                case 'bitcoin':
                    unit = 'BTC';
                    break;
                case 'ethereum':
                    unit = 'ETH';
                    break;
                case 'usdt':
                    unit = 'USDT';
                    break;
                case 'litecoin':
                    unit = 'LTC';
                    break;
                case 'dogecoin':
                    unit = 'DOGE';
                    break;
            }
        }
        
        document.getElementById('crypto-amount').textContent = `${amount} ${unit}`;
        
        // Add copy functionality
        this.addCopyFunctionality();
    }
    
    // Add copy functionality for crypto addresses
    addCopyFunctionality() {
        const copyBtn = document.getElementById('copy-address');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                const addressInput = document.getElementById('crypto-address');
                addressInput.select();
                addressInput.setSelectionRange(0, 99999); // For mobile devices
                
                try {
                    document.execCommand('copy');
                    copyBtn.textContent = 'Copied!';
                    copyBtn.style.backgroundColor = '#28a745';
                    
                    setTimeout(() => {
                        copyBtn.textContent = 'Copy';
                        copyBtn.style.backgroundColor = '';
                    }, 2000);
                } catch (err) {
                    console.error('Failed to copy address:', err);
                    alert('Failed to copy address. Please copy manually.');
                }
            });
        }
    }

    // Add affiliate tracking
    setupAffiliateTracking() {
        // Track referrals for commission payments
        const urlParams = new URLSearchParams(window.location.search);
        const referralCode = urlParams.get('ref');
        
        if (referralCode) {
            localStorage.setItem('referralCode', referralCode);
        }
    }
}

// Initialize payment integration
document.addEventListener('DOMContentLoaded', () => {
    const paymentSystem = new PaymentIntegration();
    paymentSystem.setupAffiliateTracking();
});
