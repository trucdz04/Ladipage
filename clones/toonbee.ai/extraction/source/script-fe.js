document.querySelectorAll('.video-playbar[data-duration]').forEach(function(bar) {
    var totalSeconds = parseInt(bar.dataset.duration);
    var progress = bar.querySelector('.video-playbar-progress');
    var badge = bar.querySelector('.video-duration-badge');
    var elapsed = Math.floor(Math.random() * totalSeconds);

    function formatTime(sec) {
        var m = Math.floor(sec / 60);
        var s = sec % 60;
        return m + ':' + (s < 10 ? '0' : '') + s;
    }

    var pct = (elapsed / totalSeconds) * 100;
    progress.style.transition = 'none';
    progress.style.width = pct + '%';
    badge.textContent = formatTime(totalSeconds - elapsed);
    progress.offsetWidth;
    progress.style.transition = '';

    function tick() {
        elapsed++;
        if (elapsed >= totalSeconds) elapsed = 0;
        var pct = (elapsed / totalSeconds) * 100;
        progress.style.width = pct + '%';
        badge.textContent = formatTime(totalSeconds - elapsed);
    }

    setInterval(tick, 2000);
});
