/**
 * Discord Status Fetcher
 * Fetches and displays real-time Discord status using Lanyard API
 */

(function() {
    'use strict';
    
    const DISCORD_USER_ID = '394469439606882305';
    const API_URL = `https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`;
    const UPDATE_INTERVAL = 30000; // 30 seconds
    
    // Get DOM elements
    const statusIndicator = document.getElementById('discord-status-indicator');
    const statusText = document.getElementById('discord-status-text');
    
    if (!statusIndicator || !statusText) {
        console.warn('Discord status elements not found');
        return;
    }
    
    // Status mapping
    const STATUS_MAP = {
        online: {
            text: 'Online',
            class: 'online'
        },
        dnd: {
            text: 'Không làm phiền',
            class: 'dnd'
        },
        idle: {
            text: 'AFK',
            class: 'idle'
        },
        offline: {
            text: 'Offline',
            class: 'offline'
        }
    };
    
    /**
     * Update status UI
     */
    function updateStatusUI(status, isError = false) {
        if (isError) {
            statusText.textContent = 'Lỗi';
            statusText.classList.add('error');
            statusIndicator.className = 'status-indicator error';
            return;
        }
        
        const statusInfo = STATUS_MAP[status] || STATUS_MAP.offline;
        statusText.textContent = statusInfo.text;
        statusText.classList.remove('error');
        statusIndicator.className = `status-indicator ${statusInfo.class}`;
    }
    
    /**
     * Fetch Discord status from Lanyard API
     */
    async function fetchDiscordStatus() {
        try {
            const response = await fetch(API_URL, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success && data.data) {
                const discordStatus = data.data.discord_status;
                updateStatusUI(discordStatus);
            } else {
                throw new Error('Invalid API response data');
            }
            
        } catch (error) {
            console.error('Failed to fetch Discord status:', error);
            updateStatusUI(null, true);
        }
    }
    
    /**
     * Initialize status fetcher
     */
    function init() {
        // Initial fetch
        fetchDiscordStatus();
        
        // Set up periodic updates
        setInterval(fetchDiscordStatus, UPDATE_INTERVAL);
        
        // Update on page visibility change
        document.addEventListener('visibilitychange', function() {
            if (!document.hidden) {
                fetchDiscordStatus();
            }
        });
    }
    
    // Start when page is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();
