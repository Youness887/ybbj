// Prospect Hunter Bot JavaScript
// This file handles the functionality for the prospect hunter bot page

document.addEventListener('DOMContentLoaded', function() {
    const botIntegration = new BotIntegration();
    
    // Prospect tracking
    let leadsFound = 0;
    let qualifiedProspects = 0;
    let followUpActions = 0;
    let conversionRate = 0;
    
    // Get form elements
    const industryFocus = document.getElementById('industry-focus');
    const targetGeo = document.getElementById('target-geo');
    const prospectCriteria = document.getElementById('prospect-criteria');
    const qualificationScore = document.getElementById('qualification-score');
    const maxProspects = document.getElementById('max-prospects');
    const contactMethod = document.getElementById('contact-method');
    
    // Get control buttons
    const startBtn = document.getElementById('start-bot');
    const pauseBtn = document.getElementById('pause-bot');
    const stopBtn = document.getElementById('stop-bot');
    const downloadBtn = document.getElementById('download-results');
    
    // Get stat display elements
    const leadsFoundEl = document.getElementById('leads-found');
    const qualifiedEl = document.getElementById('qualified');
    const followUpEl = document.getElementById('follow-up');
    const conversionRateEl = document.getElementById('conversion-rate');
    const activitiesConductedEl = document.getElementById('activities-conducted');
    const currentConversionRateEl = document.getElementById('current-conversion-rate');
    
    // Update prospect stats display
    function updateStats() {
        leadsFoundEl.textContent = leadsFound;
        qualifiedEl.textContent = qualifiedProspects;
        followUpEl.textContent = followUpActions;
        conversionRateEl.textContent = `${conversionRate.toFixed(1)}%`;
        activitiesConductedEl.textContent = leadsFound;
        currentConversionRateEl.textContent = conversionRate.toFixed(1);
    }
    
    // Validate form inputs
    function validateForm() {
        const geo = targetGeo.value.trim();
        const criteria = prospectCriteria.value.trim();
        
        if (!geo) {
            alert('Please enter a target geography');
            return false;
        }
        
        if (!criteria) {
            alert('Please enter prospect criteria');
            return false;
        }
        
        return true;
    }
    
    // Get configuration from form
    function getConfig() {
        return {
            industryFocus: industryFocus.value,
            targetGeo: targetGeo.value.trim(),
            prospectCriteria: prospectCriteria.value.trim(),
            qualificationScore: parseInt(qualificationScore.value),
            maxProspects: parseInt(maxProspects.value),
            contactMethod: contactMethod.value
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
    
    // Simulate prospecting activities
    async function simulateProspecting(config) {
        while (botIntegration.isRunning) {
            // Check if paused
            while (botIntegration.isPaused  botIntegration.isRunning) {
                await new Promise(resolve = 3e setTimeout(resolve, 100));
            }
            
            if (!botIntegration.isRunning) break;
            
            // Simulate finding prospects
            const prospects = Math.floor(Math.random() * 10) + 1;
            leadsFound += prospects;
            
            // Simulate qualification
            const qualified = Math.floor(prospects * (Math.random() * 0.4 + 0.2));
            qualifiedProspects += qualified;
            followUpActions += Math.floor(qualified * (Math.random() * 0.5));
            
            // Calculate conversion rate
            conversionRate = leadsFound > 0 ? (qualifiedProspects / leadsFound) * 100 : 0;
            
            // Update display
            updateStats();
            
            // Add activity to results
            const activity = {
                timestamp: new Date().toLocaleString(),
                industry: config.industryFocus,
                geography: config.targetGeo,
                qualified: qualified,
                prospects: prospects,
                contact: config.contactMethod
            };
            
            botIntegration.addResult(activity);
            
            // Wait between activities
            await new Promise(resolve = 3e setTimeout(resolve, Math.random() * 5000 + 2000)); // 2 to 7 seconds delay
        }
    }
    
    // Start bot
    startBtn.addEventListener('click', async function() {
        if (!validateForm()) return;
        
        const config = getConfig();
        
        // Reset stats
        leadsFound = 0;
        qualifiedProspects = 0;
        followUpActions = 0;
        conversionRate = 0;
        botIntegration.results = [];
        
        // Update display
        updateStats();
        
        // Clear previous results
        const container = document.getElementById('results-container');
        container.innerHTML = ' 3cp 3eStarting prospect hunting... 3c/p 3e';
        
        // Update button states
        updateButtonStates(true, false);
        downloadBtn.disabled = true;
        
        // Update status
        botIntegration.updateStatus('Running', 'status-running');
        
        // Start the prospecting simulation
        await simulateProspecting(config);
        
        // Update button states when done
        updateButtonStates(false, false);
        
        if (botIntegration.results.length  3e 0) {
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
        
        if (botIntegration.results.length  3e 0) {
            downloadBtn.disabled = false;
        }
    });
    
    // Download results
    downloadBtn.addEventListener('click', function() {
        const reportData = {
            industry: industryFocus.value,
            geography: targetGeo.value,
            leadsFound: leadsFound,
            qualifiedProspects: qualifiedProspects,
            followUpActions: followUpActions,
            conversionRate: conversionRate,
            activities: botIntegration.results
        };
        
        const content = JSON.stringify(reportData, null, 2);
        const blob = new Blob([content], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `prospect-report-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
    
    // Add tooltips
    function addTooltip(element, text) {
        element.title = text;
        element.style.cursor = 'help';
    }
    
    addTooltip(qualificationScore, 'Score required to qualify a prospect');
    addTooltip(maxProspects, 'Number of prospects to analyze per session');
    addTooltip(contactMethod, 'Preferred way to initiate contact');
    
    // Initialize stats display
    updateStats();
    
    console.log('Prospect Hunter Bot initialized successfully');
});
