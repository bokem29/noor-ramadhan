/**
 * Kitab Amal — Ramadhan To-Do List
 * Noor Ramadhan | Misi 4
 */

// ============================================
// STATE
// ============================================
const STORAGE_KEY = 'noor_ramadhan_todolist';
const CIRCUMFERENCE = 2 * Math.PI * 32; // ~201.06

let state = {
    shalat: { subuh: false, dzuhur: false, ashar: false, maghrib: false, isya: false },
    quran: { target: 0, read: 0, complete: false },
    puasa: {}, // { "1": true, "2": false, ... }
    dzikir: 0
};

// ============================================
// INIT
// ============================================
document.addEventListener('DOMContentLoaded', function () {
    loadState();
    initConstellationCalendar();
    updateRamadhanDay();
    renderShalatState();
    renderQuranState();
    renderPuasaState();
    updateAllOrbits();

    // Trigger tab content active animation
    setTimeout(function () {
        const activeTab = document.querySelector('.tab-content.active');
        if (activeTab) {
            activeTab.style.opacity = '1';
            activeTab.style.transform = 'translateY(0)';
        }
    }, 600);
});

// ============================================
// LOCAL STORAGE
// ============================================
function loadState() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            state = { ...state, ...parsed };
        }
    } catch (e) {
        console.warn('Failed to load state:', e);
    }
}

function saveState() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
        console.warn('Failed to save state:', e);
    }
}

// ============================================
// RAMADHAN DAY CALCULATION
// ============================================
function updateRamadhanDay() {
    // Ramadhan 1447H starts Feb 19, 2026 — ends Mar 19, 2026
    const ramadhanStart = new Date(2026, 1, 19); // Feb 19, 2026
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    ramadhanStart.setHours(0, 0, 0, 0);
    const diffTime = today - ramadhanStart;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    const day = Math.max(1, Math.min(30, diffDays));

    const headerEl = document.getElementById('ramadhan-day-header');
    const labelEl = document.getElementById('ramadhan-day-label');
    if (headerEl) headerEl.textContent = 'Hari ke-' + day;
    if (labelEl) labelEl.textContent = 'Hari ke-' + day;

    return day;
}

function getRamadhanDay() {
    const ramadhanStart = new Date(2026, 1, 19); // Feb 19, 2026
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    ramadhanStart.setHours(0, 0, 0, 0);
    const diffDays = Math.floor((today - ramadhanStart) / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(1, Math.min(30, diffDays));
}

// ============================================
// TAB SWITCHING
// ============================================
function switchTab(tabName) {
    // Update beads
    document.querySelectorAll('.bead-tab').forEach(function (btn) {
        btn.classList.remove('active');
        if (btn.dataset.tab === tabName) btn.classList.add('active');
    });

    // Update labels
    document.querySelectorAll('.bead-label').forEach(function (label) {
        const lt = label.dataset.tabLabel;
        if (lt === tabName) {
            label.classList.add('text-accent', 'font-bold');
            label.classList.remove('text-primary/30', 'font-medium');
        } else {
            label.classList.remove('text-accent', 'font-bold');
            label.classList.add('text-primary/30', 'font-medium');
        }
    });

    // Switch content
    document.querySelectorAll('.tab-content').forEach(function (content) {
        content.classList.remove('active');
        content.style.opacity = '0';
        content.style.transform = 'translateY(20px)';
    });

    const target = document.getElementById('tab-' + tabName);
    if (target) {
        // Use rAF to ensure display:none is applied before showing the new tab
        requestAnimationFrame(function () {
            target.classList.add('active');
            // Force reflow so the browser registers opacity:0 + translateY(20px) before animating
            target.offsetHeight;
            requestAnimationFrame(function () {
                target.style.opacity = '1';
                target.style.transform = 'translateY(0)';
            });
        });
    }
}

// ============================================
// SHALAT
// ============================================
function toggleShalat(name) {
    state.shalat[name] = !state.shalat[name];
    renderShalatState();
    updateAllOrbits();

    // Ripple effect
    const row = document.querySelector('[data-shalat="' + name + '"]');
    if (row && state.shalat[name]) {
        const node = row.querySelector('.timeline-node');
        const ripple = document.createElement('div');
        ripple.className = 'node-ripple';
        node.appendChild(ripple);
        setTimeout(function () { ripple.remove(); }, 800);
    }
}

function renderShalatState() {
    const names = ['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'];
    let count = 0;

    names.forEach(function (name) {
        const row = document.querySelector('[data-shalat="' + name + '"]');
        if (!row) return;
        const node = row.querySelector('.timeline-node');
        const icon = row.querySelector('.shalat-check-icon');
        const nodeIcon = row.querySelector('.node-icon');

        if (state.shalat[name]) {
            count++;
            node.classList.add('checked');
            icon.style.opacity = '1';
            nodeIcon.textContent = 'check';
            nodeIcon.classList.remove('text-primary/30');
            nodeIcon.classList.add('text-primary');
        } else {
            node.classList.remove('checked');
            icon.style.opacity = '0';
            // restore original icon
            const icons = { subuh: 'wb_twilight', dzuhur: 'light_mode', ashar: 'wb_sunny', maghrib: 'wb_twilight', isya: 'nightlight' };
            nodeIcon.textContent = icons[name];
            nodeIcon.classList.add('text-primary/30');
            nodeIcon.classList.remove('text-primary');
        }
    });

    // Progress
    const pct = Math.round((count / 5) * 100);
    document.getElementById('shalat-progress-text').textContent = count + ' / 5';
    document.getElementById('shalat-progress-bar').style.width = pct + '%';

    // Timeline fill
    const fillPct = count === 0 ? 0 : ((count - 1) / 4) * 100;
    document.getElementById('shalat-timeline-fill').style.height = Math.min(100, fillPct + (count > 0 ? 12 : 0)) + '%';

    // Status
    const statusEl = document.getElementById('shalat-status');
    if (pct === 0) {
        statusEl.textContent = 'Belum ada shalat yang dicatat hari ini';
    } else if (pct <= 40) {
        statusEl.innerHTML = '<span class="text-amber-600 not-italic font-semibold">⚠ Belum optimal</span> — tetap semangat menunaikan shalat!';
    } else if (pct < 100) {
        statusEl.innerHTML = '<span class="text-emerald-600 not-italic font-semibold">✦ Cukup baik</span> — sedikit lagi menuju sempurna!';
    } else {
        statusEl.innerHTML = '<span class="text-accent not-italic font-semibold">✦ MasyaAllah, lengkap!</span> — semoga diterima oleh Allah SWT';
    }
}

function saveShalat() {
    saveState();
    showToast('Shalat check berhasil disimpan!');
}

// ============================================
// QURAN
// ============================================
function updateQuranProgress() {
    const targetEl = document.getElementById('quran-target');
    const readEl = document.getElementById('quran-read');
    const completeEl = document.getElementById('quran-complete');

    const target = parseInt(targetEl.value) || 0;
    const read = parseInt(readEl.value) || 0;
    const complete = completeEl.checked;

    state.quran = { target: target, read: read, complete: complete };

    const pct = target > 0 ? Math.min(100, Math.round((read / target) * 100)) : 0;
    const finalPct = complete ? 100 : pct;

    // Update visuals
    document.getElementById('quran-progress-pct').textContent = finalPct + '%';
    document.getElementById('quran-pages-text').textContent = read + ' / ' + target + ' halaman';
    document.getElementById('quran-progress-bar').style.width = finalPct + '%';

    // Book stack visual
    const maxHeight = 120;
    const readHeight = target > 0 ? (read / target) * maxHeight : 0;
    const unreadHeight = maxHeight - readHeight;
    document.getElementById('quran-book-read').style.height = Math.min(maxHeight, readHeight) + 'px';
    document.getElementById('quran-book-unread').style.height = Math.max(8, unreadHeight) + 'px';

    // Status
    const statusEl = document.getElementById('quran-status');
    if (target === 0) {
        statusEl.textContent = 'Masukkan target dan halaman yang sudah dibaca';
    } else if (finalPct < 50) {
        statusEl.innerHTML = '<span class="text-amber-600 not-italic font-semibold">📖 Masih bisa ditambah</span> — yuk baca lebih banyak!';
    } else if (finalPct < 100) {
        statusEl.innerHTML = '<span class="text-emerald-600 not-italic font-semibold">📖 Hampir selesai</span> — sedikit lagi mencapai target!';
    } else {
        statusEl.innerHTML = '<span class="text-accent not-italic font-semibold">📖 Target tercapai!</span> — Barakallahu fiik!';
    }

    updateAllOrbits();
}

function renderQuranState() {
    const targetEl = document.getElementById('quran-target');
    const readEl = document.getElementById('quran-read');
    const completeEl = document.getElementById('quran-complete');

    if (state.quran.target) targetEl.value = state.quran.target;
    if (state.quran.read) readEl.value = state.quran.read;
    if (state.quran.complete) completeEl.checked = true;

    updateQuranProgress();
}

function saveQuran() {
    saveState();
    showToast('Progress Qur\'an berhasil disimpan!');
}

// ============================================
// PUASA
// ============================================
function initConstellationCalendar() {
    const grid = document.getElementById('constellation-grid');
    if (!grid) return;
    grid.innerHTML = '';
    const currentDay = getRamadhanDay();

    for (let i = 1; i <= 30; i++) {
        const star = document.createElement('div');
        star.className = 'constellation-star';
        star.dataset.day = i;
        star.textContent = i;

        if (i === currentDay) {
            star.classList.add('today');
        }

        star.onclick = function () {
            togglePuasaDay(i);
        };

        grid.appendChild(star);
    }
}

function togglePuasaDay(day) {
    state.puasa[day] = !state.puasa[day];
    renderPuasaState();
    updateAllOrbits();
}

function togglePuasaToday() {
    const currentDay = getRamadhanDay();
    state.puasa[currentDay] = !state.puasa[currentDay];
    renderPuasaState();
    updateAllOrbits();
}

function renderPuasaState() {
    const currentDay = getRamadhanDay();
    let count = 0;

    // Update stars
    document.querySelectorAll('.constellation-star').forEach(function (star) {
        const day = parseInt(star.dataset.day);
        if (state.puasa[day]) {
            star.classList.add('fasted');
            star.innerHTML = '<span class="material-symbols-outlined" style="font-size:18px!important;color:#1B4332">check</span>';
            count++;
        } else {
            star.classList.remove('fasted');
            star.textContent = day;
        }
    });

    // Today button
    const todayBtn = document.getElementById('btn-puasa-today');
    const todayIcon = document.getElementById('puasa-today-icon');
    if (state.puasa[currentDay]) {
        todayBtn.classList.add('bg-accent', 'border-accent');
        todayBtn.classList.remove('border-primary/20');
        todayIcon.textContent = 'check_circle';
        todayIcon.classList.add('text-primary');
        todayIcon.classList.remove('text-primary/30');
    } else {
        todayBtn.classList.remove('bg-accent', 'border-accent');
        todayBtn.classList.add('border-primary/20');
        todayIcon.textContent = 'radio_button_unchecked';
        todayIcon.classList.remove('text-primary');
        todayIcon.classList.add('text-primary/30');
    }

    // Progress
    const pct = Math.round((count / 30) * 100);
    document.getElementById('puasa-progress-text').textContent = count + ' / 30 hari';
    document.getElementById('puasa-progress-bar').style.width = pct + '%';

    // Status
    const statusEl = document.getElementById('puasa-status');
    if (count === 0) {
        statusEl.textContent = 'Belum ada hari puasa yang dicatat';
    } else if (pct <= 40) {
        statusEl.innerHTML = '<span class="text-amber-600 not-italic font-semibold">☪ Terus semangat!</span> — setiap hari puasa adalah keberkahan.';
    } else if (pct < 100) {
        statusEl.innerHTML = '<span class="text-emerald-600 not-italic font-semibold">☪ Konsisten!</span> — MasyaAllah, terus pertahankan!';
    } else {
        statusEl.innerHTML = '<span class="text-accent not-italic font-semibold">☪ Sempurna 30 hari!</span> — Taqabbalallahu minna wa minkum!';
    }
}

function savePuasa() {
    saveState();
    showToast('Data puasa berhasil disimpan!');
}

// ============================================
// ORBIT PROGRESS
// ============================================
function updateAllOrbits() {
    // Shalat orbit
    const shalatCount = Object.values(state.shalat).filter(Boolean).length;
    const shalatPct = (shalatCount / 5) * 100;
    setOrbit('orbit-shalat', shalatPct);
    document.getElementById('orbit-shalat-pct').textContent = Math.round(shalatPct) + '%';

    // Quran orbit
    const quranTarget = state.quran.target || 0;
    const quranRead = state.quran.read || 0;
    const quranPct = state.quran.complete ? 100 : (quranTarget > 0 ? Math.min(100, (quranRead / quranTarget) * 100) : 0);
    setOrbit('orbit-quran', quranPct);
    document.getElementById('orbit-quran-pct').textContent = Math.round(quranPct) + '%';

    // Puasa orbit
    const puasaCount = Object.values(state.puasa).filter(Boolean).length;
    const puasaPct = (puasaCount / 30) * 100;
    setOrbit('orbit-puasa', puasaPct);
    document.getElementById('orbit-puasa-pct').textContent = Math.round(puasaPct) + '%';

    // Dzikir orbit (from zikir counter localStorage)
    let dzikirPct = 0;
    try {
        const zikirData = localStorage.getItem('zikir_count');
        const zikirTarget = localStorage.getItem('zikir_target');
        if (zikirData && zikirTarget) {
            dzikirPct = Math.min(100, (parseInt(zikirData) / parseInt(zikirTarget)) * 100);
        }
    } catch (e) { }
    setOrbit('orbit-dzikir', dzikirPct);
    document.getElementById('orbit-dzikir-pct').textContent = Math.round(dzikirPct) + '%';

    // Total average
    const totalPct = Math.round((shalatPct + quranPct + puasaPct + dzikirPct) / 4);
    animateNumber('total-progress-num', totalPct);

    // Update motivasi status
    updateMotivasi(totalPct);
}

function setOrbit(id, pct) {
    const el = document.getElementById(id);
    if (!el) return;
    const offset = CIRCUMFERENCE - (pct / 100) * CIRCUMFERENCE;
    el.setAttribute('stroke-dashoffset', offset);

    // Add glow when complete
    if (pct >= 100) {
        el.parentElement.parentElement.classList.add('orbit-complete');
    } else {
        el.parentElement.parentElement.classList.remove('orbit-complete');
    }
}

function animateNumber(id, target) {
    const el = document.getElementById(id);
    if (!el) return;
    const current = parseInt(el.textContent) || 0;
    if (current === target) return;

    const diff = target - current;
    const step = diff > 0 ? 1 : -1;
    const steps = Math.abs(diff);
    const duration = Math.min(800, steps * 20);
    const interval = duration / steps;

    let value = current;
    const timer = setInterval(function () {
        value += step;
        el.textContent = value;
        if (value === target) clearInterval(timer);
    }, interval);
}

// ============================================
// MOTIVASI STATUS
// ============================================
function updateMotivasi(pct) {
    const el = document.getElementById('status-motivasi');
    if (!el) return;

    let message = '';
    let emoji = '☽';

    if (pct === 0) {
        message = 'Mulai isi ibadahmu hari ini';
        emoji = '☽';
    } else if (pct <= 25) {
        message = 'Awal yang baik, terus tingkatkan!';
        emoji = '🌙';
    } else if (pct <= 50) {
        message = 'MasyaAllah, terus semangat!';
        emoji = '⭐';
    } else if (pct <= 75) {
        message = 'Luar biasa! Hampir sempurna!';
        emoji = '✨';
    } else if (pct < 100) {
        message = 'Sedikit lagi menuju kesempurnaan!';
        emoji = '🌟';
    } else {
        message = 'Sempurna! Taqabbalallahu minna!';
        emoji = '🏆';
    }

    el.innerHTML = '<p class="font-sans text-xs text-primary/60 font-medium tracking-wide"><span class="mr-1">' + emoji + '</span> ' + message + '</p>';
}

// ============================================
// TOAST
// ============================================
function showToast(message) {
    const toast = document.getElementById('toast-save');
    const msgEl = document.getElementById('toast-save-message');
    if (!toast || !msgEl) return;

    msgEl.textContent = message;
    toast.style.opacity = '1';
    toast.style.transform = 'translate(-50%, 0)';
    toast.style.pointerEvents = 'auto';

    setTimeout(function () {
        toast.style.opacity = '0';
        toast.style.transform = 'translate(-50%, 10px)';
        toast.style.pointerEvents = 'none';
    }, 2500);
}
