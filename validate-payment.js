// Payment System Validation Script
// Run this in the browser console to test payment integration

console.log("🚀 Starting Payment System Validation...");

// Test 1: Check if PaymentConfig is loaded
function testPaymentConfig() {
    console.log("\n📋 Test 1: Payment Configuration");
    
    if (typeof PaymentConfig === 'undefined') {
        console.error("❌ PaymentConfig is not defined");
        return false;
    }
    
    console.log("✅ PaymentConfig loaded successfully");
    
    // Check crypto wallets
    console.log("🔍 Checking crypto wallets:");
    Object.entries(PaymentConfig.cryptoWallets).forEach(([crypto, wallet]) => {
        if (wallet.address && !wallet.address.includes('YOUR_')) {
            console.log(`✅ ${crypto}: ${wallet.address}`);
        } else {
            console.log(`❌ ${crypto}: Address not configured`);
        }
    });
    
    // Check PayPal
    console.log("🔍 Checking PayPal:");
    if (PaymentConfig.paypal.businessEmail && !PaymentConfig.paypal.businessEmail.includes('YOUR_')) {
        console.log(`✅ PayPal Email: ${PaymentConfig.paypal.businessEmail}`);
    } else {
        console.log("❌ PayPal Email: Not configured");
    }
    
    if (PaymentConfig.paypal.paypalMeLink && !PaymentConfig.paypal.paypalMeLink.includes('YourUsername')) {
        console.log(`✅ PayPal.Me: ${PaymentConfig.paypal.paypalMeLink}`);
    } else {
        console.log("❌ PayPal.Me: Not configured");
    }
    
    return true;
}

// Test 2: Check if PaymentIntegration is loaded
function testPaymentIntegration() {
    console.log("\n💳 Test 2: Payment Integration");
    
    if (typeof PaymentIntegration === 'undefined') {
        console.error("❌ PaymentIntegration is not defined");
        return false;
    }
    
    console.log("✅ PaymentIntegration loaded successfully");
    
    // Test creating an instance
    try {
        const paymentSystem = new PaymentIntegration();
        console.log("✅ PaymentIntegration instance created successfully");
        
        // Test pricing plans
        console.log("🔍 Checking pricing plans:");
        Object.entries(paymentSystem.pricingPlans).forEach(([plan, details]) => {
            console.log(`✅ ${plan}: $${details.price}/month`);
        });
        
        return true;
    } catch (error) {
        console.error("❌ Failed to create PaymentIntegration instance:", error);
        return false;
    }
}

// Test 3: Test crypto price functionality
async function testCryptoPrices() {
    console.log("\n💰 Test 3: Crypto Price Update");
    
    try {
        await PaymentConfig.updateCryptoPrices();
        console.log("✅ Crypto prices updated successfully");
        
        // Show updated prices
        console.log("🔍 Updated crypto pricing:");
        Object.entries(PaymentConfig.pricing).forEach(([plan, pricing]) => {
            console.log(`📊 ${plan.toUpperCase()} Plan ($${pricing.usd}):`);
            Object.entries(pricing.crypto).forEach(([crypto, amount]) => {
                console.log(`  ${crypto}: ${amount}`);
            });
        });
        
        return true;
    } catch (error) {
        console.error("❌ Failed to update crypto prices:", error);
        return false;
    }
}

// Test 4: Test modal functionality
function testModal() {
    console.log("\n🎭 Test 4: Modal Functionality");
    
    try {
        const paymentSystem = new PaymentIntegration();
        
        // Test if modal elements exist
        const modal = document.getElementById('payment-modal');
        if (modal) {
            console.log("✅ Payment modal exists");
        } else {
            console.log("❌ Payment modal not found");
        }
        
        // Test showing modal
        paymentSystem.showPaymentModal('basic');
        console.log("✅ Modal display test completed");
        
        return true;
    } catch (error) {
        console.error("❌ Modal test failed:", error);
        return false;
    }
}

// Run all tests
async function runAllTests() {
    console.log("🎯 Payment System Validation Results:");
    console.log("=" .repeat(50));
    
    const results = {
        config: testPaymentConfig(),
        integration: testPaymentIntegration(),
        prices: await testCryptoPrices(),
        modal: testModal()
    };
    
    console.log("\n📊 Summary:");
    console.log("=" .repeat(50));
    
    const passed = Object.values(results).filter(r => r === true).length;
    const total = Object.keys(results).length;
    
    Object.entries(results).forEach(([test, result]) => {
        console.log(`${result ? '✅' : '❌'} ${test}: ${result ? 'PASSED' : 'FAILED'}`);
    });
    
    console.log(`\n🎯 Overall: ${passed}/${total} tests passed`);
    
    if (passed === total) {
        console.log("🎉 All tests passed! Payment system is ready!");
    } else {
        console.log("⚠️  Some tests failed. Please check the configuration.");
    }
}

// Auto-run when script is loaded
if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
        setTimeout(runAllTests, 1000); // Wait 1 second for all scripts to load
    });
}

// Export for manual testing
window.validatePaymentSystem = runAllTests;
