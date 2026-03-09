/**
 * Jadwal Imsakiyah — Astronomical Flow (Awwwards Style)
 * Noor Ramadhan | Dynamic City Search v14
 */

let ALL_CITIES = [];
let ACTIVE_CITY_ID = localStorage.getItem('last_city_id') || '1301';
let ACTIVE_CITY_NAME = localStorage.getItem('last_city_name') || 'Jakarta';

document.addEventListener('DOMContentLoaded', () => {
    initDropdown();
    initImsakiyah();
});

const now = new Date();
const YEAR = now.getFullYear();
const MONTH = String(now.getMonth() + 1).padStart(2, '0');

async function initDropdown() {
    const triggerBtn = document.getElementById('trigger-city-dropdown');
    const menu = document.getElementById('city-dropdown-menu');
    const arrow = document.getElementById('city-dropdown-arrow');
    const cityText = document.getElementById('city-dropdown-text');
    const searchInput = document.getElementById('city-search-input');

    // Set initial text
    if (cityText) cityText.innerText = ACTIVE_CITY_NAME;

    // Toggle dropdown
    triggerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isActive = menu.classList.toggle('active');
        if (isActive) {
            arrow?.classList.add('-rotate-180');
            searchInput?.focus();
            if (ALL_CITIES.length === 0) fetchAllCities();
        } else {
            arrow?.classList.remove('-rotate-180');
        }
    });

    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
        if (!menu.contains(e.target) && !triggerBtn.contains(e.target)) {
            menu.classList.remove('active');
            arrow?.classList.remove('-rotate-180');
        }
    });

    // Search Filtering
    searchInput?.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        filterCities(query);
    });
}

async function fetchAllCities() {
    const cityList = document.getElementById('city-list');
    const loading = document.getElementById('city-list-loading');
    
    try {
        const response = await fetch('https://api.myquran.com/v2/sholat/kota/semua');
        const data = await response.json();
        
        if (data.status && data.data) {
            ALL_CITIES = data.data;
            loading.classList.add('hidden');
            renderCityList(ALL_CITIES);
        }
    } catch (err) {
        console.error('Failed to fetch cities:', err);
        loading.innerHTML = '<span class="text-red-400 text-[10px] font-bold uppercase">Gagal memuat kota</span>';
    }
}

function renderCityList(cities) {
    const cityList = document.getElementById('city-list');
    const cityItems = cityList.querySelectorAll('.custom-dropdown-item');
    cityItems.forEach(item => item.remove());

    cities.forEach(city => {
        const isSelected = city.id === ACTIVE_CITY_ID;
        const item = document.createElement('div');
        item.className = `custom-dropdown-item px-5 py-4 cursor-pointer transition-all duration-300 flex items-center gap-3 group/item relative overflow-hidden group hover:pl-7 ${isSelected ? 'text-accent font-bold active-city' : 'text-primary/50'}`;
        item.dataset.id = city.id;
        
        item.innerHTML = `
            <div class="absolute left-0 top-0 bottom-0 w-1 bg-accent ${isSelected ? 'opacity-100' : 'opacity-0'} group-hover/item:opacity-100 transition-opacity duration-300"></div>
            <span class="material-symbols-outlined text-[1.2rem] transition-transform duration-300 group-hover/item:rotate-12 group-hover/item:scale-110 group-hover/item:text-accent">location_on</span>
            <span class="custom-val-text relative z-10 transition-colors duration-300 group-hover/item:text-primary">${city.lokasi}</span>
        `;

        item.addEventListener('click', () => {
            selectCity(city.id, city.lokasi);
        });

        cityList.appendChild(item);
    });
}

function filterCities(query) {
    const filtered = ALL_CITIES.filter(city => city.lokasi.toLowerCase().includes(query));
    const emptyState = document.getElementById('city-list-empty');
    
    if (filtered.length === 0) {
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
    }
    
    renderCityList(filtered);
}

function selectCity(id, name) {
    ACTIVE_CITY_ID = id;
    ACTIVE_CITY_NAME = name;
    
    // Save to persistence
    localStorage.setItem('last_city_id', id);
    localStorage.setItem('last_city_name', name);

    // Update UI
    const cityText = document.getElementById('city-dropdown-text');
    if (cityText) cityText.innerText = name;

    const menu = document.getElementById('city-dropdown-menu');
    const arrow = document.getElementById('city-dropdown-arrow');
    menu.classList.remove('active');
    arrow?.classList.remove('-rotate-180');

    // Fetch new data
    fetchJadwal(id);
}

function initImsakiyah() {
    // Initial fetch using persisted OR default city
    setTimeout(() => {
        fetchJadwal(ACTIVE_CITY_ID);
    }, 500);
}

async function fetchJadwal(cityId) {
    const mainContent = document.getElementById('main-content');
    const loader = document.getElementById('loader');
    const errorState = document.getElementById('error-state');
    const tableSection = document.getElementById('table-section');
    const tbody = document.getElementById('imsakiyah-tbody');

    // Show loading state
    loader.classList.add('active');
    mainContent.style.opacity = '0';
    mainContent.style.transform = 'translateY(10px)';
    errorState.classList.remove('active');

    try {
        const response = await fetch(`https://api.myquran.com/v2/sholat/jadwal/${cityId}/${YEAR}/${MONTH}`);
        const result = await response.json();

        if (result.status && result.data && result.data.jadwal) {
            setTimeout(() => {
                tbody.innerHTML = '';
                renderTable(result.data.jadwal);
                
                loader.classList.remove('active');
                tableSection.style.display = 'block';

                requestAnimationFrame(() => {
                    mainContent.style.opacity = '1';
                    mainContent.style.transform = 'translateY(0)';
                });
                
                scrollToToday();
            }, 800);
        } else {
            throw new Error('Invalid data');
        }
    } catch (error) {
        console.error('Fetch error:', error);
        loader.classList.remove('active');
        tableSection.style.display = 'none';
        errorState.classList.add('active');
        
        requestAnimationFrame(() => {
            mainContent.style.opacity = '1';
            mainContent.style.transform = 'translateY(0)';
        });
    }
}

function renderTable(jadwal) {
    const tbody = document.getElementById('imsakiyah-tbody');
    const todayStr = getTodayISO();
    
    // Determine Timezone based on the currently active city name
    const currentTz = getTimezoneHelper(ACTIVE_CITY_NAME);

    const icons = {
        imsak: 'bedtime',
        subuh: 'brightness_3',
        dzuhur: 'light_mode',
        ashar: 'wb_sunny',
        maghrib: 'event_upcoming',
        isya: 'nights_stay'
    };

    jadwal.forEach((day, index) => {
        const isToday = day.date === todayStr;
        const tr = document.createElement('tr');
        tr.className = `stagger-row table-slab group ${isToday ? 'today' : ''}`;
        tr.style.animationDelay = `${index * 0.05}s`;

        const timeCell = (key, time) => `
            <td class="p-6 transition-all duration-500 ${isToday ? '' : 'group-hover:bg-accent/5'}">
                <div class="flex flex-col gap-1.5 items-start">
                    <div class="flex items-center gap-2 opacity-30 group-hover:opacity-100 transition-opacity duration-500">
                        <span class="material-symbols-outlined text-[1rem] ${isToday ? 'text-accent' : 'text-primary'}">${icons[key]}</span>
                        <span class="font-sans text-[10px] font-bold tracking-widest uppercase ${isToday ? 'text-background/60' : 'text-primary'}">${currentTz}</span>
                    </div>
                    <span class="font-sans text-[1.4rem] tabular-nums font-bold ${isToday ? 'text-accent' : 'text-primary'}">
                        ${time}
                    </span>
                </div>
            </td>
        `;

        tr.innerHTML = `
            <td class="p-6 relative overflow-hidden text-center lg:text-left ${isToday ? 'border-l-4 border-accent' : ''}">
                <div class="flex flex-col gap-1 items-center lg:items-start">
                    <div class="flex items-center gap-3">
                        <span class="font-serif text-2xl font-bold ${isToday ? 'text-background' : 'text-primary'}">${formatDate(day.tanggal)}</span>
                        ${isToday ? '<span class="w-2 h-2 bg-accent rounded-full animate-pulse shadow-[0_0_8px_rgba(212,175,55,0.6)]"></span>' : ''}
                    </div>
                </div>
            </td>
            ${timeCell('imsak', day.imsak)}
            ${timeCell('subuh', day.subuh)}
            ${timeCell('dzuhur', day.dzuhur)}
            ${timeCell('ashar', day.ashar)}
            ${timeCell('maghrib', day.maghrib)}
            ${timeCell('isya', day.isya)}
        `;
        tbody.appendChild(tr);
    });
}

function scrollToToday() {
    const todayRow = document.querySelector('.table-slab.today');
    if (todayRow) {
        setTimeout(() => {
            todayRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 600);
    }
}

function getTodayISO() {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function formatDate(tanggalStr) {
    const parts = tanggalStr.split(' ');
    if (parts.length < 2) return tanggalStr;
    const dateParts = parts[1].split('/');
    const day = dateParts[0];
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const month = months[parseInt(dateParts[1]) - 1];
    return `${day} ${month}`;
}

// Map Indonesian regions to their timezones
function getTimezoneHelper(cityName) {
    if (!cityName) return 'WIB';
    const nameStr = cityName.toUpperCase();

    // Mapping based on common province/island keywords in Indonesian cities
    
    // Waktu Indonesia Timur (WIT) - UTC+9
    const witKeywords = ['PAPUA', 'MALUKU', 'BIAK', 'JAYAPURA', 'MERAUKE', 'NABIRE', 'TIMIKA', 'AMBON', 'TUAL', 'TERNATE', 'TIDORE', 'SORONG', 'MANOKWARI', 'FAKFAK'];
    if (witKeywords.some(kw => nameStr.includes(kw))) {
        return 'WIT';
    }

    // Waktu Indonesia Tengah (WITA) - UTC+8
    const witaKeywords = [
        'BALI', 'DENPASAR', 'BADUNG', 'BANGLI', 'BULELENG', 'GIANYAR', 'JEMBRANA', 'KARANGASEM', 'KLUNGKUNG', 'TABANAN',
        'NUSA TENGGARA BARAT', 'NTB', 'MATARAM', 'BIMA', 'DOMPU', 'LOMBOK', 'SUMBAWA',
        'NUSA TENGGARA TIMUR', 'NTT', 'KUPANG', 'ALOR', 'BELU', 'ENDE', 'FLORES', 'MANGGARAI', 'NAGEKEO', 'NGADA', 'SABU', 'SIKKA', 'SUMBA', 'TIMOR',
        'SULAWESI', 'MAKASSAR', 'PALOPO', 'PAREPARE', 'PALU', 'BAUBAU', 'KENDARI', 'BITUNG', 'KOTAMOBAGU', 'MANADO', 'TOMOHON', 'GORONTALO', 'BONE', 'GOWA', 'LUWU', 'MAROS', 'PINRANG', 'TORAJA', 'WAJO', 'MUNA', 'BUTON', 'KOLAKA', 'BOMBANA', 'MINAHASA', 'SANGIHE', 'TALAUD', 'POHUWATO', 'PARIMO', 'POSO', 'TOLITOLI', 'BANGGAI', 'DONGGALA', 'MOROWALI', 'BUOL',
        'KALIMANTAN TIMUR', 'KALTIM', 'BALIKPAPAN', 'BONTANG', 'SAMARINDA', 'BERAU', 'KUTAI', 'PASER', 'PENAJAM', 'MAHAKAM',
        'KALIMANTAN SELATAN', 'KALSEL', 'BANJARBARU', 'BANJARMASIN', 'BALANGAN', 'BANJAR', 'BARITO', 'HULU SUNGAI', 'KOTABARU', 'TABALONG', 'TANAH BUMBU', 'TANAH LAUT', 'TAPIN',
        'KALIMANTAN UTARA', 'KALUT', 'TARAKAN', 'BULUNGAN', 'MALINAU', 'NUNUKAN', 'TANA TIDUNG',
        // Also capture generic 'KOTA ' and 'KAB. ' variations
        'KOTA BIMA', 'KOTA MATARAM', 'KOTA KUPANG', 'KOTA MAKASSAR', 'KOTA PALOPO', 'KOTA PAREPARE', 'KOTA BANJARBARU', 'KOTA BANJARMASIN', 'KOTA PALU', 'KOTA BAUBAU', 'KOTA KENDARI', 'KOTA BITUNG', 'KOTA KOTAMOBAGU', 'KOTA MANADO', 'KOTA TOMOHON', 'KOTA GORONTALO', 'KOTA BALIKPAPAN', 'KOTA BONTANG', 'KOTA SAMARINDA', 'KOTA TARAKAN'
    ];
    if (witaKeywords.some(kw => nameStr.includes(kw))) {
        return 'WITA';
    }

    // Default: Waktu Indonesia Barat (WIB) - UTC+7
    // Covers Sumatra, Java, West & Central Kalimantan
    return 'WIB';
}
