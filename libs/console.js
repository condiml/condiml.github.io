/**
 * Console branding and developer message
 */
(function() {
    'use strict';
    
    // Branding
    console.log(
        '%c🍉 Watermeloz',
        'color:#00e676; font-family:monospace; font-size:20px; font-weight:bold; text-shadow: 2px 2px 4px rgba(0,230,118,0.3);'
    );
    
    console.log(
        '%cNguyễn Hà Sơn',
        'color:#b9bbbe; font-family:monospace; font-size:14px; margin-top:5px;'
    );
    
    console.log(
        '%c\n👋 Xin chào! Bạn đang xem console à?\n💻 Nếu bạn quan tâm đến code, hãy xem GitHub của mình nhé!\n🔗 https://github.com/lewe2k6\n',
        'color:#6366f1; font-family:monospace; font-size:12px; line-height:1.5;'
    );
    
    // Performance info
    if (window.performance && window.performance.timing) {
        window.addEventListener('load', function() {
            setTimeout(function() {
                const perfData = window.performance.timing;
                const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                const connectTime = perfData.responseEnd - perfData.requestStart;
                const renderTime = perfData.domComplete - perfData.domLoading;
                
                console.log(
                    '%c⚡ Performance Stats',
                    'color:#faa61a; font-family:monospace; font-size:14px; font-weight:bold;'
                );
                console.log(
                    `%c📊 Page Load: ${pageLoadTime}ms | Connection: ${connectTime}ms | Render: ${renderTime}ms`,
                    'color:#b9bbbe; font-family:monospace; font-size:11px;'
                );
            }, 0);
        });
    }
    
    // Easter egg
    window.watermeloz = function() {
        console.log(
            '%c🎵 Đang nghe: Diễm Xưa',
            'color:#1db954; font-family:monospace; font-size:14px; background:#151515; padding:10px; border-radius:5px;'
        );
    };
    
})();

