/**
 * Interaction Overlay Handler
 * Manages the initial user interaction overlay required for audio autoplay
 */

(function() {
    'use strict';
    
    const overlay = document.getElementById('interaction-overlay');
    const audio = document.getElementById('background-music');
    
    if (!overlay) {
        console.warn('Interaction overlay not found');
        return;
    }
    
    let hasInteracted = false;
    
    /**
     * Handle user interaction to start audio
     */
    function handleInteraction(event) {
        if (hasInteracted) return;
        
        hasInteracted = true;
        
        // Hide overlay with fade effect
        overlay.classList.add('hidden');
        
        // Remove overlay from DOM after transition
        setTimeout(function() {
            overlay.style.display = 'none';
        }, 500);
        
        // Start audio playback
        if (audio) {
            audio.play().catch(function(error) {
                console.warn('Could not play audio:', error);
                // Show a user-friendly message if needed
                if (error.name === 'NotAllowedError') {
                    console.info('Audio autoplay was blocked by browser. User can use the music player controls.');
                }
            });
        }
        
        // Clean up event listeners
        removeEventListeners();
    }
    
    /**
     * Remove event listeners after interaction
     */
    function removeEventListeners() {
        document.removeEventListener('click', handleInteraction);
        document.removeEventListener('touchstart', handleInteraction);
        overlay.removeEventListener('click', handleInteraction);
    }
    
    /**
     * Initialize overlay handlers
     */
    function init() {
        // Add event listeners for click and touch
        document.addEventListener('click', handleInteraction, { once: true });
        document.addEventListener('touchstart', handleInteraction, { once: true, passive: true });
        overlay.addEventListener('click', handleInteraction);
        
        // Check if user has already interacted (in case of page reload)
        try {
            const hasInteractedBefore = sessionStorage.getItem('hasInteracted');
            if (hasInteractedBefore === 'true') {
                // Skip overlay if user already interacted in this session
                handleInteraction();
            }
        } catch (e) {
            console.warn('Could not access sessionStorage:', e);
        }
    }
    
    /**
     * Save interaction state
     */
    function saveInteractionState() {
        try {
            sessionStorage.setItem('hasInteracted', 'true');
        } catch (e) {
            console.warn('Could not save interaction state:', e);
        }
    }
    
    // Save state when user interacts
    document.addEventListener('click', saveInteractionState, { once: true });
    
    init();
    
})();
