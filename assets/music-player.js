/**
 * Music Player Controller
 * Handles all music player functionality including play/pause, volume, and progress
 */

(function() {
    'use strict';
    
    const audio = document.getElementById('background-music');
    if (!audio) {
        console.warn('Audio element not found');
        return;
    }
    
    // Get DOM elements
    const playPauseBtn = document.getElementById('play-pause-btn');
    const progressBar = document.getElementById('progress-bar');
    const timeNow = document.getElementById('time-now');
    const timeFull = document.getElementById('time-full');
    const volumeSlider = document.getElementById('volume-slider');
    const volumeFill = document.getElementById('volume-fill');
    const volumeHandle = document.getElementById('volume-handle');
    const equalizer = document.getElementById('music-equalizer');
    const musicTime = document.querySelector('.music-time');
    
    if (!playPauseBtn || !progressBar) {
        console.warn('Required music player elements not found');
        return;
    }
    
    // State
    let isDragging = false;
    let isVolumeDragging = false;
    
    // SVG icons for play/pause states
    const PAUSE_ICON = '<path fill-rule="evenodd" d="M21.6 12a9.6 9.6 0 1 1-19.2 0 9.6 9.6 0 0 1 19.2 0ZM8.4 9.6a1.2 1.2 0 1 1 2.4 0v4.8a1.2 1.2 0 1 1-2.4 0V9.6Zm6-1.2a1.2 1.2 0 0 0-1.2 1.2v4.8a1.2 1.2 0 1 0 2.4 0V9.6a1.2 1.2 0 0 0-1.2-1.2Z" clip-rule="evenodd" />';
    const PLAY_ICON = '<path fill-rule="evenodd" d="M21.6 12a9.6 9.6 0 1 1-19.2 0 9.6 9.6 0 0 1 19.2 0ZM10.8 8.4a1.2 1.2 0 0 1 1.2 1.2v4.8a1.2 1.2 0 1 1-2.4 0V9.6a1.2 1.2 0 0 1 1.2-1.2Z" clip-rule="evenodd" />';
    
    /**
     * Format seconds to MM:SS
     */
    function formatTime(seconds) {
        if (!isFinite(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    /**
     * Update progress bar based on current time
     */
    function updateProgress() {
        if (audio.duration && !isDragging) {
            const progress = (audio.currentTime / audio.duration) * 100;
            progressBar.style.width = progress + '%';
            if (timeNow) {
                timeNow.textContent = formatTime(audio.currentTime);
            }
        }
    }
    
    /**
     * Update total time display
     */
    function updateTotalTime() {
        if (audio.duration && timeFull) {
            timeFull.textContent = formatTime(audio.duration);
        }
    }
    
    /**
     * Update equalizer animation state
     */
    function updateEqualizer(isPlaying) {
        if (!equalizer) return;
        
        if (isPlaying) {
            equalizer.classList.remove('paused');
        } else {
            equalizer.classList.add('paused');
        }
    }
    
    /**
     * Update play/pause button icon
     */
    function updatePlayPauseIcon(isPlaying) {
        if (!playPauseBtn) return;
        playPauseBtn.innerHTML = isPlaying ? PAUSE_ICON : PLAY_ICON;
    }
    
    /**
     * Toggle play/pause
     */
    function togglePlayPause() {
        if (audio.paused) {
            audio.play().catch(err => {
                console.error('Error playing audio:', err);
            });
        } else {
            audio.pause();
        }
    }
    
    /**
     * Update volume controls
     */
    function updateVolume(percentage) {
        percentage = Math.max(0, Math.min(1, percentage));
        audio.volume = percentage;
        
        if (volumeFill) {
            volumeFill.style.width = (percentage * 100) + '%';
        }
        if (volumeHandle) {
            volumeHandle.style.right = ((1 - percentage) * 80 + 20) + '%';
        }
        
        // Save volume preference
        try {
            localStorage.setItem('musicPlayerVolume', percentage);
        } catch (e) {
            console.warn('Could not save volume preference:', e);
        }
    }
    
    /**
     * Seek to position in track
     */
    function seekTo(percentage) {
        if (audio.duration) {
            audio.currentTime = percentage * audio.duration;
        }
    }
    
    // Event Listeners
    
    // Play/Pause button
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', togglePlayPause);
    }
    
    // Progress bar click
    if (musicTime) {
        musicTime.addEventListener('click', function(e) {
            if (audio.duration) {
                const rect = musicTime.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const percentage = clickX / rect.width;
                seekTo(percentage);
            }
        });
    }
    
    // Volume slider click
    if (volumeSlider) {
        volumeSlider.addEventListener('click', function(e) {
            const rect = volumeSlider.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const percentage = clickX / rect.width;
            updateVolume(percentage);
        });
    }
    
    // Volume handle drag
    if (volumeHandle) {
        volumeHandle.addEventListener('mousedown', function(e) {
            isVolumeDragging = true;
            e.preventDefault();
        });
    }
    
    document.addEventListener('mousemove', function(e) {
        if (isVolumeDragging && volumeSlider) {
            const rect = volumeSlider.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const percentage = clickX / rect.width;
            updateVolume(percentage);
        }
    });
    
    document.addEventListener('mouseup', function() {
        isVolumeDragging = false;
    });
    
    // Audio events
    audio.addEventListener('loadedmetadata', updateTotalTime);
    audio.addEventListener('timeupdate', updateProgress);
    
    audio.addEventListener('play', function() {
        updateEqualizer(true);
        updatePlayPauseIcon(true);
    });
    
    audio.addEventListener('pause', function() {
        updateEqualizer(false);
        updatePlayPauseIcon(false);
    });
    
    audio.addEventListener('ended', function() {
        updateEqualizer(false);
        updatePlayPauseIcon(false);
    });
    
    audio.addEventListener('error', function(e) {
        console.error('Audio error:', e);
    });
    
    // Initialize
    function init() {
        // Load saved volume or use default
        let savedVolume = 0.8;
        try {
            const saved = localStorage.getItem('musicPlayerVolume');
            if (saved !== null) {
                savedVolume = parseFloat(saved);
            }
        } catch (e) {
            console.warn('Could not load volume preference:', e);
        }
        
        updateVolume(savedVolume);
        updateEqualizer(false);
        updatePlayPauseIcon(false);
    }
    
    init();
    
})();
