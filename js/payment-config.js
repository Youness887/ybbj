// Payment Configuration
// Store your actual wallet addresses and payment details here

const PaymentConfig = {
    // Cryptocurrency Wallet Addresses
    cryptoWallets: {
        bitcoin: {
            address: '17JzGZZmPhC1vwpoV9ReMxUiNr4AmoGAZ3', // Your actual Bitcoin address
            network: 'mainnet',
            qrCode: null // Optional: Add QR code URL for easier payments
        },
        ethereum: {
            address: '0xcb3a33346812d7f826215d1cad8a9dd3fe99c9c8', // Your actual Ethereum address
            network: 'mainnet',
            qrCode: null
        },
        usdt: {
            address: 'TYvGHf3wYo2BZsSxxWJyzfujbWJHonBq1u', // Your actual USDT address (TRC20)
            network: 'tron', // TRC20 network
            qrCode: null
        },
        // Add more cryptocurrencies as needed
        litecoin: {
            address: 'LSfK3Vty3VNsJNnzYDNuSMeiqv9SqyPzZG', // Your actual Litecoin address
            network: 'mainnet',
            qrCode: null
        },
        dogecoin: {
            address: 'DSX5JnxYh8ozmxcgRa7LJnyvxF2oy4iRUg', // Your actual Dogecoin address
            network: 'mainnet',
            qrCode: null
        }
    },

    // PayPal Configuration
    paypal: {
        // For PayPal Business Account
        businessEmail: 'younessjaadani@gmail.com', // Your actual PayPal business email
        merchantId: 'YOUR_PAYPAL_MERCHANT_ID', // Replace with your PayPal merchant ID when you have one
        clientId: 'YOUR_PAYPAL_CLIENT_ID', // Replace with your PayPal client ID (for PayPal SDK)
        
        // PayPal Environment
        environment: 'production', // 'sandbox' for testing, 'production' for live
        
        // PayPal.Me link (alternative payment method)
        paypalMeLink: 'https://paypal.me/younessjaadani626' // Your actual PayPal.Me link
    },

    // Stripe Configuration
    stripe: {
        publishableKey: 'YOUR_STRIPE_PUBLISHABLE_KEY', // Replace with your Stripe publishable key
        secretKey: 'YOUR_STRIPE_SECRET_KEY', // Keep this secure - should be on server side
        webhookSecret: 'YOUR_STRIPE_WEBHOOK_SECRET' // For webhook verification
    },

    // Pricing with crypto amounts (automatically calculated based on current rates)
    pricing: {
        basic: {
            usd: 29.99,
            crypto: {
                bitcoin: 0.0008, // Will be updated based on current BTC price
                ethereum: 0.025, // Will be updated based on current ETH price
                usdt: 29.99,
                litecoin: 0.4,
                dogecoin: 350
            }
        },
        pro: {
            usd: 99.99,
            crypto: {
                bitcoin: 0.0026,
                ethereum: 0.083,
                usdt: 99.99,
                litecoin: 1.33,
                dogecoin: 1166
            }
        },
        enterprise: {
            usd: 299.99,
            crypto: {
                bitcoin: 0.008,
                ethereum: 0.25,
                usdt: 299.99,
                litecoin: 4.0,
                dogecoin: 3500
            }
        }
    },

    // API Keys for crypto price fetching (optional)
    priceApi: {
        coinGecko: 'YOUR_COINGECKO_API_KEY', // Optional: for real-time crypto prices
        coinMarketCap: 'YOUR_COINMARKETCAP_API_KEY' // Optional: alternative price source
    },

    // Webhook URLs for payment confirmations
    webhooks: {
        stripe: 'https://bothub.com/webhooks/stripe',
        paypal: 'https://bothub.com/webhooks/paypal',
        crypto: 'https://bothub.com/webhooks/crypto'
    },

    // Success and cancel URLs
    returnUrls: {
        success: 'https://bothub.com/payment-success',
        cancel: 'https://bothub.com/payment-cancel'
    },

    // Payment notifications
    notifications: {
        email: 'younessjaadani@gmail.com',
        webhook: 'https://bothub.com/webhooks/payment-notification'
    }
};

// Validation function to check if configuration is complete
PaymentConfig.validate = function() {
    const errors = [];
    
    // Check crypto wallets
    Object.keys(this.cryptoWallets).forEach(crypto => {
        if (this.cryptoWallets[crypto].address.includes('YOUR_') || 
            this.cryptoWallets[crypto].address === '') {
            errors.push(`${crypto} wallet address not configured`);
        }
    });
    
    // Check PayPal
    if (this.paypal.businessEmail.includes('YOUR_') || 
        this.paypal.businessEmail === '') {
        errors.push('PayPal business email not configured');
    }
    
    // Check Stripe
    if (this.stripe.publishableKey.includes('YOUR_') || 
        this.stripe.publishableKey === '') {
        errors.push('Stripe publishable key not configured');
    }
    
    return errors;
};

// Function to get current crypto prices (you can implement this with a real API)
PaymentConfig.updateCryptoPrices = async function() {
    // This is a placeholder - implement with real API calls
    try {
        // Example: fetch from CoinGecko API
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether,litecoin,dogecoin&vs_currencies=usd');
        const prices = await response.json();
        
        // Update pricing based on current rates
        Object.keys(this.pricing).forEach(plan => {
            const usdPrice = this.pricing[plan].usd;
            this.pricing[plan].crypto.bitcoin = (usdPrice / prices.bitcoin.usd).toFixed(8);
            this.pricing[plan].crypto.ethereum = (usdPrice / prices.ethereum.usd).toFixed(6);
            this.pricing[plan].crypto.litecoin = (usdPrice / prices.litecoin.usd).toFixed(4);
            this.pricing[plan].crypto.dogecoin = Math.round(usdPrice / prices.dogecoin.usd);
        });
    } catch (error) {
        console.warn('Failed to update crypto prices:', error);
    }
};

// Make configuration globally available
window.PaymentConfig = PaymentConfig;
