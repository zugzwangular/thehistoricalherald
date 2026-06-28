// --- TRACKING CONSTANTS ---
const TIME_BEFORE_FIRST_SHOW = 60000; // 5 seconds (Set to 60000 later)
const TIME_BEFORE_RESHOW = 240000; // 4 minutes
const START_TIME_KEY = 'heraldStartTime';
const NEXT_SHOW_TIME_KEY = 'heraldNextShowTime'; 

// 1. NEW: This function automatically puts the Popup HTML on every page
function injectPopup() {
    const popupHTML = `
        <div id="popup-wrapper" class="popup-overlay">
            <div class="popup-content">
                <span class="popup-close" onclick="closeDonationPopup()">×</span>
                <h2>Keep The Historical Herald free!</h2>
                <p>The Historical Herald isn't hidden behind a paywall, and I want to keep it that way. The website costs me money to maintain, and I rely on donations to ensure it stays free.</p>
                <p>I need $11 a year to cover the cost!</p>
                <a href="https://venmo.com/u/zugzwangular" target="_blank" class="popup-donate-button">Make a Donation</a>
                <p class="popup-reminder">*Please include "Historical Herald" in your note for tracking!</p>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', popupHTML);
}

// 2. Function to show the pop-up
function showDonationPopup() {
    const wrapper = document.getElementById('popup-wrapper');
    if (wrapper) {
        wrapper.style.display = 'block';
        document.body.style.overflow = 'hidden'; 
    }
}

// 3. Function to close the pop-up
function closeDonationPopup() {
    const wrapper = document.getElementById('popup-wrapper');
    if (wrapper) {
        wrapper.style.display = 'none';
        document.body.style.overflow = 'auto'; 
        
        const now = Date.now();
        // Sets the "Next Show Time" to 4 minutes from right now
        localStorage.setItem(NEXT_SHOW_TIME_KEY, now + TIME_BEFORE_RESHOW);
    }
}

// 4. Main function to check and track time across pages
function checkAndTrackTime() {
    let now = Date.now();
    let nextShowTime = localStorage.getItem(NEXT_SHOW_TIME_KEY);
    
    // 1. Check if they recently clicked 'X' (The 4-minute Snooze)
    if (nextShowTime && parseInt(nextShowTime) > now) {
        // Calculate how many seconds/minutes are left in the snooze
        const snoozeRemaining = parseInt(nextShowTime) - now;
        const minutes = Math.floor(snoozeRemaining / 60000);
        const seconds = Math.floor((snoozeRemaining % 60000) / 1000);
        
        console.log(`Popup is snoozed. Remaining time: ${minutes}m ${seconds}s`);
        return; 
    }

    // 2. Track arrival for the WHOLE session (across pages)
    let arrivalTime = sessionStorage.getItem("ARRIVAL_TIME");
    if (!arrivalTime) {
        sessionStorage.setItem("ARRIVAL_TIME", now);
        arrivalTime = now;
        console.log("New session started. Clock begins now.");
    }

    // 3. Calculate remaining time based on that first arrival
    const timeElapsed = now - parseInt(arrivalTime);
    const waitTime = Math.max(0, TIME_BEFORE_FIRST_SHOW - timeElapsed);

    if (waitTime > 0) {
        console.log("Popup will show in " + (waitTime / 1000) + " seconds (Session total).");
        setTimeout(showDonationPopup, waitTime);
    } else {
        showDonationPopup();
    }
}
// 5. Your existing News Ticker
function createNewsTicker() {
    const tickerHTML = `
        <div class="news-ticker">
            <div class="ticker-wrapper">
                <div class="ticker-content">
                    <span>Llywelyn, Prince of Wales, is assasinated</span>
                    <span>Mongol invasion fleet destroyed by cyclone</span>
                    <span>Cairo's economy crashes after flood of gold in the market</span>
                    <span>Travel book ordered by Marinid sultan is released</span>
					<span>The Great Mortality sweeps through Europe</span>
                </div>
                <div class="ticker-content">
                    <span>Llywelyn, Prince of Wales, is assasinated</span>
                    <span>Mongol invasion fleet destroyed by cyclone</span>
                    <span>Cairo's economy crashes after flood of gold in the market</span>
                    <span>Travel book ordered by Marinid sultan is released</span>
					<span>The Great Mortality sweeps through Europe</span>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', tickerHTML);
}

// 6. Run EVERYTHING when page loads
window.onload = function() {
    injectPopup();       // Put the popup HTML in
    createNewsTicker();  // Put the ticker HTML in
    checkAndTrackTime(); // Start the timer
};
