let count = 0;
let target = 33;
const display = document.getElementById('count-display');
const targetDisplay = document.getElementById('target-display');
const touchArea = document.getElementById('touch-area');
const particleContainer = document.getElementById('particle-container');
const phraseDisplay = document.getElementById('phrase-display');
const parallaxText = document.getElementById('parallax-text');
const ambientGlow = document.getElementById('ambient-glow');
const celebScreen = document.getElementById('celebration-screen');
const resetModal = document.getElementById('reset-modal');

const phrases = [
    { text: "سُبْحَانَ ٱللَّٰهِ", glow: "bg-accent/10", bg: "bg-primary" },
    { text: "ٱلْحَمْدُ لِلَّٰهِ", glow: "bg-blue-500/10", bg: "bg-slate-900" },
    { text: "ٱللَّٰهُ أَكْبَرُ", glow: "bg-teal-500/10", bg: "bg-teal-950" }
];

// Audio State and Setup
let soundEnabled = false; // Default off, per HTML icon state
const soundIconOn = document.getElementById('sound-icon-on');
const soundIconOff = document.getElementById('sound-icon-off');

// Pre-load the user's custom tap sound 
// Using a relative path from the page location (pages/zikir.html) to the sound folder
const tapAudioOrig = new Audio('../public/assets/sound/tap-tiny-wooden-gamemaster-audio-higher-tone-1-00-00.mp3');
tapAudioOrig.volume = 0.8; // Set appropriate volume level

function toggleSound() {
    soundEnabled = !soundEnabled;
    if (soundEnabled) {
        if (soundIconOn) soundIconOn.classList.remove('hidden');
        if (soundIconOff) soundIconOff.classList.add('hidden');

        // Dummy play to unlock audio context on iOS/Safari upon first interaction
        tapAudioOrig.play().then(() => {
            tapAudioOrig.pause();
            tapAudioOrig.currentTime = 0;
        }).catch(e => console.log('Audio unlock pending user interaction.'));

    } else {
        if (soundIconOn) soundIconOn.classList.add('hidden');
        if (soundIconOff) soundIconOff.classList.remove('hidden');
    }
}

function playTapSound() {
    if (!soundEnabled) return;

    // Clone node allows rapid consecutive playback without clipping/waiting
    const tapSoundNode = tapAudioOrig.cloneNode();
    tapSoundNode.volume = tapAudioOrig.volume;
    tapSoundNode.play().catch(e => console.log('Playback prevented by browser policy'));
}

setTimeout(() => {
    if (phraseDisplay) {
        phraseDisplay.classList.remove('opacity-0', 'translate-y-4');
    }
}, 500);

function updateTheme(phaseIndex) {
    const phase = phrases[phaseIndex % phrases.length];

    if (!phraseDisplay || !parallaxText || !ambientGlow) return;

    phraseDisplay.classList.add('opacity-0', '-translate-y-4');

    const parallaxSpan = parallaxText.querySelector('span');
    if (parallaxSpan) parallaxSpan.classList.add('opacity-0');

    setTimeout(() => {
        phraseDisplay.innerText = phase.text;
        if (parallaxSpan) parallaxSpan.innerText = phase.text;

        phraseDisplay.classList.remove('-translate-y-4');
        phraseDisplay.classList.add('translate-y-4');

        ambientGlow.className = `fixed top-1/2 left-0 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[60vw] md:h-[60vw] rounded-full blur-[120px] pointer-events-none transition-colors duration-1000 z-0 ${phase.glow}`;

        if (touchArea) {
            phrases.forEach(p => touchArea.classList.remove(p.bg));
            touchArea.classList.add(phase.bg);
        }

        setTimeout(() => {
            phraseDisplay.classList.remove('opacity-0', 'translate-y-4');
            if (parallaxSpan) parallaxSpan.classList.remove('opacity-0');
        }, 50);
    }, 500);
}

let pendingTarget = null;

function setTarget(newTarget) {
    if (newTarget === target) return;

    if (count > 0) {
        pendingTarget = newTarget;
        if (resetModal) resetModal.classList.add('reset-modal-active');
    } else {
        applyTarget(newTarget);
    }
}

function applyTarget(newTarget) {
    target = newTarget;
    targetDisplay.innerText = target === Infinity ? '/ ∞' : `/ ${target}`;

    document.querySelectorAll('.target-btn').forEach(btn => {
        btn.classList.remove('target-active');
    });

    let activeId = target === 33 ? 'btn-33' : (target === 100 ? 'btn-100' : 'btn-inf');
    const activeBtn = document.getElementById(activeId);
    if (activeBtn) activeBtn.classList.add('target-active');
}

function spawnRipple(x, y) {
    const ripple = document.createElement('div');
    ripple.className = 'omni-ripple w-4 h-4';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    document.body.appendChild(ripple);

    requestAnimationFrame(() => {
        ripple.style.transform = 'translate(-50%, -50%) scale(25)';
        ripple.style.opacity = '0';
    });

    setTimeout(() => ripple.remove(), 1200);
}

function spawnGoldenParticle() {
    if (!particleContainer) return;
    const particle = document.createElement('div');
    particle.className = 'anim-thread-particle';
    particleContainer.appendChild(particle);

    setTimeout(() => particle.remove(), 2000);
}

function celebration() {

    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);

    if (celebScreen) celebScreen.classList.add('celeb-active');
}

function closeCelebration() {
    if (!celebScreen) return;

    setTimeout(() => {
        celebScreen.classList.add('celeb-closing');

        setTimeout(() => {
            celebScreen.classList.remove('celeb-active', 'celeb-closing');
        }, 300);
    }, 150);
}

function processZikir(clientX, clientY) {
    if (target !== Infinity && count >= target) return;

    count++;
    playTapSound();

    if (display) {
        display.innerText = count;
        display.classList.remove('anim-calm');
        void display.offsetWidth;
        display.classList.add('anim-calm');
    }

    if (clientX !== undefined && clientY !== undefined) {
        spawnRipple(clientX, clientY);
    }
    spawnGoldenParticle();

    if (count > 0 && count % 33 === 0) {
        let phaseIndex = Math.floor(count / 33);
        updateTheme(phaseIndex);

        if (target !== Infinity && count === target) {
            celebration();
        }
    } else if (target !== Infinity && count === target) {
        celebration();
    }
}

if (touchArea) {
    touchArea.addEventListener('pointerdown', (e) => {
        if (e.target.closest('nav') ||
            e.target.closest('footer') ||
            e.target.closest('#orb-tambah') ||
            e.target.closest('#btn-tambah') ||
            celebScreen.classList.contains('celeb-active') ||
            resetModal.classList.contains('reset-modal-active')) return;

        processZikir(e.clientX, e.clientY);
    });
}

window.handleIncrement = function (e) {
    e.stopPropagation();
    if (celebScreen.classList.contains('celeb-active') ||
        resetModal.classList.contains('reset-modal-active')) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX || (rect.left + rect.width / 2);
    const y = e.clientY || (rect.top + rect.height / 2);

    processZikir(x, y);
};

document.addEventListener('mousemove', (e) => {
    if (!parallaxText) return;
    const x = (window.innerWidth / 2 - e.pageX) / 40;
    const y = (window.innerHeight / 2 - e.pageY) / 40;
    parallaxText.style.transform = `translate(${x}px, ${y}px)`;
});

function reset() {
    if (count > 0) {
        if (resetModal) resetModal.classList.add('reset-modal-active');
    } else {
        performReset();
    }
}

function cancelReset() {
    setTimeout(() => {
        if (resetModal) resetModal.classList.remove('reset-modal-active');
        pendingTarget = null;
    }, 150);
}

function confirmReset() {
    setTimeout(() => {
        if (resetModal) resetModal.classList.remove('reset-modal-active');
        performReset();
        if (pendingTarget !== null) {
            applyTarget(pendingTarget);
            pendingTarget = null;
        }
    }, 150);
}

function performReset() {
    count = 0;
    if (display) display.innerText = count;
    updateTheme(0);

    if (display) display.classList.remove('anim-calm');

    if (navigator.vibrate) navigator.vibrate(50);
}

updateTheme(0);
