// Zakat Logic & Dashboard Management

// State Variables
let currentType = 'penghasilan';
const NISAB_GRAM = 85;
const ZAKAT_RATE = 0.025; // 2.5%
const MEAL_PRICE = 25000; // Asumsi 1 porsi makan bergizi Rp 25.000

// DOM Elements
const dropdownTrigger = document.getElementById('custom-dropdown-trigger');
const dropdownMenu = document.getElementById('custom-dropdown-menu');
const dropdownText = document.getElementById('custom-dropdown-text');
const dropdownArrow = document.getElementById('custom-dropdown-arrow');
const dropdownOptions = document.querySelectorAll('#custom-dropdown-menu [data-value]');
const formPenghasilan = document.getElementById('form-penghasilan');
const formEmas = document.getElementById('form-emas');

const inputHargaEmas = document.getElementById('harga-emas');
const inputGaji = document.getElementById('gaji-pokok');
const inputTambahan = document.getElementById('gaji-tambahan');
const inputGramEmas = document.getElementById('emas-gram');

const resTotal = document.getElementById('res-total');
const resNisab = document.getElementById('res-nisab');
const resStatusLabel = document.getElementById('res-status-label');
const resNisabLabel = document.getElementById('res-nisab-label');
const resZakat = document.getElementById('res-zakat');
const resCurrency = document.getElementById('res-currency');
const zakatGlowBg = document.getElementById('zakat-glow-bg');

const insightEmpty = document.getElementById('insight-empty');
const insightResult = document.getElementById('insight-result');
const impactBox = document.getElementById('impact-box');
const impactRice = document.getElementById('impact-rice');
const errHargaEmas = document.getElementById('err-harga-emas');
const toastError = document.getElementById('toast-error');
const toastMessage = document.getElementById('toast-message');

// Format to Rupiah string
function formatRupiah(number) {
    return new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(number);
}

// Parse raw number from input
function parseNumber(valueString) {
    if (!valueString) return 0;
    const cleanString = valueString.toString().replace(/[^0-9]/g, '');
    const num = parseInt(cleanString, 10);
    return isNaN(num) ? 0 : num;
}

// Custom Dropdown Interactivity
if (dropdownTrigger) {
    dropdownTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = dropdownMenu.classList.contains('opacity-100');
        if (isOpen) {
            closeCustomDropdown();
        } else {
            dropdownMenu.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
            dropdownMenu.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto');
            dropdownArrow.classList.add('-rotate-180');
        }
    });
}

function closeCustomDropdown() {
    if (dropdownMenu) {
        dropdownMenu.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-auto');
        dropdownMenu.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none');
        dropdownArrow.classList.remove('-rotate-180');
    }
}

document.addEventListener('click', closeCustomDropdown);

window.handleCustomSelect = function(optionEl) {
    const val = optionEl.getAttribute('data-value');
    const text = optionEl.querySelector('.custom-val-text').innerText.trim();
    
    if (dropdownText) dropdownText.innerText = text;
    
    dropdownOptions.forEach(opt => {
        if (opt === optionEl) {
            opt.classList.replace('text-primary/50', 'text-primary');
            opt.classList.add('font-bold');
        } else {
            opt.classList.replace('text-primary', 'text-primary/50');
            opt.classList.remove('font-bold');
        }
    });

    closeCustomDropdown();
    switchZakatType(val);
};

// Auto-format input numbers
function handleInputFormatting(e) {
    const rawValue = parseNumber(e.target.value);
    e.target.value = rawValue === 0 ? '' : formatRupiah(rawValue);
}

// Attach event listeners to all inputs for formatting
[inputHargaEmas, inputGaji, inputTambahan, inputGramEmas].forEach(input => {
    input.addEventListener('input', handleInputFormatting);
});

// Hide/Show Logic
window.switchZakatType = function(type) {
    if (currentType === type) return;
    currentType = type;

    if (type === 'penghasilan') {
        formEmas.classList.remove('translate-y-0', 'opacity-100');
        formEmas.classList.add('translate-y-4', 'opacity-0');
        setTimeout(() => {
            formEmas.classList.add('hidden');
            formEmas.classList.remove('flex');
            formPenghasilan.classList.remove('hidden');
            formPenghasilan.classList.add('flex');
            requestAnimationFrame(() => {
                formPenghasilan.classList.remove('translate-y-4', 'opacity-0');
                formPenghasilan.classList.add('translate-y-0', 'opacity-100');
            });
        }, 500);
    } else {
        formPenghasilan.classList.remove('translate-y-0', 'opacity-100');
        formPenghasilan.classList.add('translate-y-4', 'opacity-0');
        setTimeout(() => {
            formPenghasilan.classList.add('hidden');
            formPenghasilan.classList.remove('flex');
            formEmas.classList.remove('hidden');
            formEmas.classList.add('flex');
            requestAnimationFrame(() => {
                formEmas.classList.remove('translate-y-4', 'opacity-0');
                formEmas.classList.add('translate-y-0', 'opacity-100');
            });
        }, 500);
    }
    resetDashboard();
};

function resetDashboard() {
    insightResult.classList.remove('opacity-100', 'scale-100');
    insightResult.classList.add('opacity-0', 'scale-95', 'pointer-events-none');
    impactBox.classList.remove('opacity-100', 'translate-y-0');
    impactBox.classList.add('opacity-0', 'translate-y-8');
    setTimeout(() => {
        insightEmpty.classList.remove('opacity-0', 'scale-95');
        insightEmpty.classList.add('opacity-100', 'scale-100');
    }, 500);
}

function showToast(msg) {
    if (!toastError || !toastMessage) return;
    toastMessage.innerText = msg;
    toastError.classList.remove('opacity-0', 'translate-y-10', 'pointer-events-none');
    toastError.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto');
    
    setTimeout(() => {
        toastError.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-auto');
        toastError.classList.add('opacity-0', 'translate-y-10', 'pointer-events-none');
    }, 4000);
}

// Animate Numbers
function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.floor(easeProgress * (end - start) + start);
        obj.innerHTML = formatRupiah(currentVal);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

let currentZakatMemory = 0;
let currentTotalMemory = 0;
let currentNisabMemory = 0;
let currentRiceMemory = 0;

function calculateZakat() {
    const hargaEmasVal = inputHargaEmas.value;
    const gajiVal = inputGaji.value;
    const tambahanVal = inputTambahan.value;
    const gramEmasVal = inputGramEmas.value;
    
    const hargaEmas = parseNumber(hargaEmasVal);

    // Validation
    let emptyFields = [];
    if (hargaEmas === 0) emptyFields.push(inputHargaEmas);
    if (currentType === 'penghasilan') {
        if (parseNumber(gajiVal) === 0 && parseNumber(tambahanVal) === 0) {
            emptyFields.push(inputGaji, inputTambahan);
        }
    } else {
        if (parseNumber(gramEmasVal) === 0) emptyFields.push(inputGramEmas);
    }

    if (emptyFields.length > 0) {
        showToast("Mohon lengkapi nominal harta Anda terlebih dahulu.");
        emptyFields.forEach(f => {
            const parent = f.closest('.group');
            if (parent) {
                parent.classList.add('shake');
                setTimeout(() => parent.classList.remove('shake'), 600);
            }
        });
        return;
    }

    if (hargaEmas > 0 && hargaEmas < 800000) {
        errHargaEmas.classList.remove('opacity-0', 'h-0');
        errHargaEmas.classList.add('opacity-100', 'h-auto');
        resetDashboard();
        return;
    } else {
        errHargaEmas.classList.remove('opacity-100', 'h-auto');
        errHargaEmas.classList.add('opacity-0', 'h-0');
    }

    const annualNisab = hargaEmas * NISAB_GRAM;
    const nisabValue = (currentType === 'penghasilan') ? annualNisab / 12 : annualNisab;

    let totalHarta = (currentType === 'penghasilan') 
        ? parseNumber(inputGaji.value) + parseNumber(inputTambahan.value)
        : parseNumber(inputGramEmas.value) * hargaEmas; 

    const isWajib = totalHarta >= nisabValue;
    const targetZakat = isWajib ? Math.floor(totalHarta * ZAKAT_RATE) : 0;
    const targetRice = isWajib ? Math.floor(targetZakat / MEAL_PRICE) : 0;

    insightEmpty.classList.remove('opacity-100', 'scale-100');
    insightEmpty.classList.add('opacity-0', 'scale-95');

    setTimeout(() => {
        insightResult.classList.remove('opacity-0', 'scale-95', 'pointer-events-none');
        insightResult.classList.add('opacity-100', 'scale-100');

        // Dynamic Label for Competition Clarity
        if (resNisabLabel) {
            resNisabLabel.innerText = (currentType === 'penghasilan') ? 'Batas Nisab (Bulanan)' : 'Batas Nisab (85g Emas)';
        }

        if (isWajib) {
            resStatusLabel.innerText = 'WAJIB ZAKAT';
            resStatusLabel.className = 'inline-block px-4 py-1.5 rounded-full font-sans text-[10px] font-bold tracking-widest uppercase transition-all duration-500 bg-accent/20 text-accent border border-accent/40';
            resCurrency.classList.replace('opacity-60', 'opacity-90');
            resZakat.classList.replace('text-white/20', 'text-white');
            zakatGlowBg.classList.replace('bg-accent/0', 'bg-accent/10');
            setTimeout(() => {
                impactBox.classList.remove('opacity-0', 'translate-y-8');
                impactBox.classList.add('opacity-100', 'translate-y-0');
            }, 400);
        } else {
            resStatusLabel.innerText = 'TIDAK WAJIB';
            resStatusLabel.className = 'inline-block px-4 py-1.5 rounded-full font-sans text-[10px] font-bold tracking-widest uppercase transition-all duration-500 bg-white/10 text-white/40';
            resCurrency.classList.replace('opacity-90', 'opacity-60');
            resZakat.classList.replace('text-white', 'text-white/20');
            zakatGlowBg.classList.replace('bg-accent/10', 'bg-accent/0');
            impactBox.classList.remove('opacity-100', 'translate-y-0');
            impactBox.classList.add('opacity-0', 'translate-y-8');
        }

        animateValue(resTotal, currentTotalMemory, totalHarta, 800);
        animateValue(resNisab, currentNisabMemory, nisabValue, 800);
        animateValue(resZakat, currentZakatMemory, targetZakat, 1000);
        animateValue(impactRice, currentRiceMemory, targetRice, 1200);

        currentTotalMemory = totalHarta;
        currentNisabMemory = nisabValue;
        currentZakatMemory = targetZakat;
        currentRiceMemory = targetRice;

    }, 500);
}

const btnHitung = document.getElementById('btn-hitung');
if (btnHitung) {
    btnHitung.addEventListener('click', calculateZakat);
}

setTimeout(() => {
    document.querySelectorAll('.animate-fade-up').forEach(el => {
        el.classList.remove('opacity-0', 'translate-y-4');
    });
}, 200);
