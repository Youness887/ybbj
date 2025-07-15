// Money Maker Bot JavaScript
// This file handles the functionality for the money maker bot page

document.addEventListener('DOMContentLoaded', function() {
    const botIntegration = new BotIntegration();
    
    // Revenue tracking
    let dailyRevenue = 0;
    let totalRevenue = 0;
    let activeCampaigns = 0;
    let conversionRate = 0;
    let leadsConverted = 0;
    
    // Get form elements
    const strategyType = document.getElementById('strategy-type');
    const targetMarket = document.getElementById('target-market');
    const budget = document.getElementById('budget');
    const campaignName = document.getElementById('campaign-name');
    const keywords = document.getElementById('keywords');
    const targetROI = document.getElementById('target-roi');
    const checkFrequency = document.getElementById('check-frequency');
    const autoOptimize = document.getElementById('auto-optimize');
    const riskLevel = document.getElementById('risk-level');
    
    // Get control buttons
    const startBtn = document.getElementById('start-bot');
    const pauseBtn = document.getElementById('pause-bot');
    const stopBtn = document.getElementById('stop-bot');
    const downloadBtn = document.getElementById('download-results');
    
    // Get stat display elements
    const dailyRevenueEl = document.getElementById('daily-revenue');
    const totalRevenueEl = document.getElementById('total-revenue');
    const activeCampaignsEl = document.getElementById('active-campaigns');
    const conversionRateEl = document.getElementById('conversion-rate');
    const activeCountEl = document.getElementById('active-count');
    const revenueTodayEl = document.getElementById('revenue-today');
    const leadsConvertedEl = document.getElementById('leads-converted');
    
    // Update revenue stats display
    function updateStats() {
        dailyRevenueEl.textContent = `$${dailyRevenue.toFixed(2)}`;
        totalRevenueEl.textContent = `$${totalRevenue.toFixed(2)}`;
        activeCampaignsEl.textContent = activeCampaigns;
        conversionRateEl.textContent = `${conversionRate.toFixed(1)}%`;
        activeCountEl.textContent = activeCampaigns;
        revenueTodayEl.textContent = dailyRevenue.toFixed(2);
        leadsConvertedEl.textContent = leadsConverted;
    }
    
    // Validate form inputs
    function validateForm() {
        const market = targetMarket.value.trim();
        const name = campaignName.value.trim();
        const kwds = keywords.value.trim();
        const budgetValue = parseFloat(budget.value);
        
        if (!market) {
            alert('Please enter a target market');
            return false;
        }
        
        if (!name) {
            alert('Please enter a campaign name');
            return false;
        }
        
        if (!kwds) {
            alert('Please enter keywords or niches');
            return false;
        }
        
        if (budgetValue < 10 || budgetValue > 10000) {
            alert('Daily budget must be between $10 and $10,000');
            return false;
        }
        
        return true;
    }
    
    // Get configuration from form
    function getConfig() {
        return {
            strategyType: strategyType.value,
            targetMarket: targetMarket.value.trim(),
            budget: parseFloat(budget.value),
            campaignName: campaignName.value.trim(),
            keywords: keywords.value.trim(),
            targetROI: parseFloat(targetROI.value),
            checkFrequency: parseInt(checkFrequency.value),
            autoOptimize: autoOptimize.value === 'enabled',
            riskLevel: riskLevel.value
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
    
    // Generate revenue based on strategy
    function generateRevenue(config) {
        const baseRevenue = config.budget * 0.1; // 10% of budget as base
        const riskMultiplier = {
            'low': 0.8,
            'medium': 1.2,
            'high': 1.8
        };
        
        const strategyMultiplier = {
            'affiliate': 1.5,
            'lead-gen': 1.2,
            'arbitrage': 2.0,
            'email-marketing': 1.1,
            'social-media': 1.3
        };
        
        const revenue = baseRevenue * 
                       riskMultiplier[config.riskLevel] * 
                       strategyMultiplier[config.strategyType] * 
                       (Math.random() * 0.6 + 0.7); // Random factor between 0.7 and 1.3
        
        return Math.max(0, revenue);
    }
    
    // Simulate money making activities
    async function simulateMoneyMaking(config) {
        const checkInterval = config.checkFrequency * 60 * 1000; // Convert to milliseconds
        let campaignCount = 0;
        let totalConversions = 0;
        let totalOpportunities = 0;
        
        while (botIntegration.isRunning) {
            // Check if paused
            while (botIntegration.isPaused && botIntegration.isRunning) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            
            if (!botIntegration.isRunning) break;
            
            // Simulate finding opportunities
            const opportunities = Math.floor(Math.random() * 5) + 1;
            totalOpportunities += opportunities;
            
            // Simulate conversions
            const conversions = Math.floor(opportunities * (Math.random() * 0.3 + 0.1));
            totalConversions += conversions;
            leadsConverted += conversions;
            
            // Generate revenue
            const revenue = generateRevenue(config);
            dailyRevenue += revenue;
            totalRevenue += revenue;
            
            // Update campaigns
            if (Math.random() > 0.7) {
                activeCampaigns = Math.min(activeCampaigns + 1, 5);
            }
            
            // Calculate conversion rate
            conversionRate = totalOpportunities > 0 ? (totalConversions / totalOpportunities) * 100 : 0;
            
            // Update display
            updateStats();
            
            // Add activity to results
            const activity = {
                timestamp: new Date().toLocaleString(),
                strategy: config.strategyType,
                revenue: revenue.toFixed(2),
                conversions: conversions,
                opportunities: opportunities,
                campaign: config.campaignName
            };
            
            botIntegration.addResult(activity);
            
            // Wait for next check
            await new Promise(resolve => setTimeout(resolve, checkInterval));
        }
    }
    
    // Start bot
    startBtn.addEventListener('click', async function() {
        if (!validateForm()) return;
        
        const config = getConfig();
        
        // Reset stats
        dailyRevenue = 0;
        totalRevenue = 0;
        activeCampaigns = 1;
        conversionRate = 0;
        leadsConverted = 0;
        botIntegration.results = [];
        
        // Update display
        updateStats();
        
        // Clear previous results
        const container = document.getElementById('results-container');
        container.innerHTML = '<p>Starting money making campaign...</p>';
        
        // Update button states
        updateButtonStates(true, false);
        downloadBtn.disabled = true;
        
        // Update status
        botIntegration.updateStatus('Running', 'status-running');
        
        // Start the money making simulation
        await simulateMoneyMaking(config);
        
        // Update button states when done
        updateButtonStates(false, false);
        
        if (botIntegration.results.length > 0) {
            downloadBtn.disabled = false;
        }
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
        const reportData = {
            campaign: campaignName.value,
            strategy: strategyType.value,
            dailyRevenue: dailyRevenue,
            totalRevenue: totalRevenue,
            activeCampaigns: activeCampaigns,
            conversionRate: conversionRate,
            leadsConverted: leadsConverted,
            activities: botIntegration.results
        };
        
        const content = JSON.stringify(reportData, null, 2);
        const blob = new Blob([content], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `money-maker-report-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
    
    // Update campaign suggestions based on strategy
    strategyType.addEventListener('change', function() {
        const strategy = this.value;
        const suggestions = {
            'affiliate': 'Amazon Associates, ClickBank, Commission Junction',
            'lead-gen': 'Local businesses, Real estate agents, Insurance companies',
            'arbitrage': 'Amazon FBA, eBay, Shopify dropshipping',
            'email-marketing': 'Newsletter monetization, Product launches, Course sales',
            'social-media': 'Instagram influencers, YouTube channels, TikTok marketing'
        };
        
        keywords.placeholder = suggestions[strategy] || 'Enter keywords or niches';
        
        // Update target market suggestions
        const marketSuggestions = {
            'affiliate': 'Online shoppers, Deal seekers, Product reviewers',
            'lead-gen': 'Small business owners, Service providers, B2B companies',
            'arbitrage': 'Retail arbitrage, Online sellers, Dropshippers',
            'email-marketing': 'Subscribers, Email lists, Newsletter readers',
            'social-media': 'Social media users, Content creators, Influencers'
        };
        
        targetMarket.placeholder = marketSuggestions[strategy] || 'Enter target market';
    });
    
    // Initialize with default suggestions
    strategyType.dispatchEvent(new Event('change'));
    
    // Add tooltips
    function addTooltip(element, text) {
        element.title = text;
        element.style.cursor = 'help';
    }
    
    addTooltip(budget, 'Daily budget for your money making campaign');
    addTooltip(targetROI, 'Target return on investment percentage');
    addTooltip(checkFrequency, 'How often to check for new opportunities');
    addTooltip(riskLevel, 'Higher risk = higher potential returns but more volatility');
    
    // Initialize stats display
    updateStats();
    
    console.log('Money Maker Bot initialized successfully');
});
