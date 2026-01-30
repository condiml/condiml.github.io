/**
 * Dark / Light Theme Toggle
 * Saves preference to localStorage, respects system preference on first visit
 */

(function() {
    'use strict';

    const STORAGE_KEY = 'theme';
    const THEME_DARK = 'dark';
    const THEME_LIGHT = 'light';

    /**
     * Get saved theme or system preference
     */
    function getPreferredTheme() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved === THEME_DARK || saved === THEME_LIGHT) {
                return saved;
            }
        } catch (e) {
            console.warn('Could not read theme from localStorage:', e);
        }

        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            return THEME_LIGHT;
        }
        return THEME_DARK;
    }

    /**
     * Apply theme to document and meta theme-color
     */
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);

        var metaTheme = document.querySelector('meta[name="theme-color"]');
        if (metaTheme) {
            metaTheme.setAttribute('content', theme === THEME_LIGHT ? '#f5f5f7' : '#050505');
        }

        try {
            localStorage.setItem(STORAGE_KEY, theme);
        } catch (e) {
            console.warn('Could not save theme to localStorage:', e);
        }
    }

    /**
     * Toggle between dark and light
     */
    function toggleTheme() {
        var current = document.documentElement.getAttribute('data-theme');
        var next = current === THEME_LIGHT ? THEME_DARK : THEME_LIGHT;
        applyTheme(next);
    }

    /**
     * Init: apply saved/preferred theme and bind button
     */
    function init() {
        applyTheme(getPreferredTheme());

        var btn = document.getElementById('theme-toggle');
        if (btn) {
            btn.addEventListener('click', toggleTheme);
            btn.setAttribute('aria-label', document.documentElement.getAttribute('data-theme') === THEME_LIGHT ? 'Chuyển sang giao diện tối' : 'Chuyển sang giao diện sáng');
        }

        // Update aria-label when theme changes (for accessibility)
        if (btn) {
            var observer = new MutationObserver(function() {
                var theme = document.documentElement.getAttribute('data-theme');
                btn.setAttribute('aria-label', theme === THEME_LIGHT ? 'Chuyển sang giao diện tối' : 'Chuyển sang giao diện sáng');
            });
            observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
        }

        // Listen for system theme change (optional)
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
                if (!localStorage.getItem(STORAGE_KEY)) {
                    applyTheme(e.matches ? THEME_DARK : THEME_LIGHT);
                }
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
