document.addEventListener('DOMContentLoaded', () => {
    // ── Configuration ──
    const path = window.location.pathname;
    const isInPages = path.includes('/pages/');
    const isIndex = path.endsWith('index.html') || path.endsWith('/') || !path.includes('.html');
    
    const navItems = [
        { label: 'Beranda', url: isInPages ? '../index.html' : 'index.html', active: isIndex },
        { label: 'Jadwal Imsakiyah', url: isInPages ? 'imsakiyah.html' : 'pages/imsakiyah.html', active: path.includes('imsakiyah.html') },
        { label: 'Kitab Amal', url: isInPages ? 'todolist.html' : 'pages/todolist.html', active: path.includes('todolist.html') },
        { label: 'Zikir Counter', url: isInPages ? 'zikir.html' : 'pages/zikir.html', active: path.includes('zikir.html') },
        { label: 'Kalkulator Zakat', url: isInPages ? 'zakat.html' : 'pages/zakat.html', active: path.includes('zakat.html') },
        { label: 'Doa & Niat', url: isInPages ? 'doa.html' : 'pages/doa.html', active: path.includes('doa.html') },
    ];

    const assets = {
        logoDark: isInPages ? '../public/assets/images/logo3.png' : './public/assets/images/logo3.png',
        logoLight: isInPages ? '../public/assets/images/logo2.png' : './public/assets/images/logo2.png'
    };

    // ── Helpers ──
    const createStaggerHTML = (label, isMobile = false) => {
        const speed = isMobile ? 15 : 25;
        const chars = label.split('').map((char, i) => 
            `<span class="inline-block transition-transform duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]" style="transition-delay: ${i * speed}ms">${char === ' ' ? '&nbsp;' : char}</span>`
        ).join('');
        
        if (isMobile) return chars; // Mobile uses a simpler structure with CSS classes for hover

        return `
            <span class="sr-only">${label}</span>
            <span class="nav-stagger-wrap relative overflow-hidden inline-flex" aria-hidden="true">
                <span class="nav-stagger-default inline-flex">${chars}</span>
                <span class="nav-stagger-hover absolute inset-0 inline-flex text-accent">${chars.replace(/transition-transform/g, 'transition-transform translate-y-full')}</span>
            </span>
        `;
    };

    // ── Template Generation ──
    const initialLogo = isIndex ? assets.logoLight : assets.logoDark;
    const initialTheme = isIndex ? { text: 'text-surface/90', burger: 'bg-surface' } : { text: 'text-primary/70', burger: 'bg-primary' };

    const menuHTML = `
        <header id="main-navbar" class="fixed top-0 left-0 w-full z-[110] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
            <div id="navbar-pill" class="bg-transparent w-full px-6 md:px-12 lg:px-16 py-4 md:py-5 flex justify-between items-center shadow-none border-b border-transparent transition-all duration-500">
                <a id="navbar-logo" href="${navItems[0].url}" class="relative z-10 flex items-center gap-3 group shrink-0 transition-all duration-500">
                    <img id="navbar-logo-img" src="${initialLogo}" alt="Noor Ramadhan" class="h-7 md:h-9 w-auto object-contain transition-all duration-500 group-hover:scale-105">
                </a>

                <nav class="hidden lg:flex items-center gap-8 relative z-10">
                    ${navItems.map(item => `
                        <a href="${item.url}" class="nav-link group relative flex items-center font-sans text-[11px] font-bold uppercase tracking-[0.18em] ${item.active ? 'text-accent' : initialTheme.text} py-2 whitespace-nowrap cursor-pointer transition-colors duration-500">
                            <div class="flex items-center justify-center w-0 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${item.active ? 'w-5 opacity-100 mr-1' : 'w-0 opacity-0 mr-0 group-hover:w-4 group-hover:opacity-50 group-hover:mr-1'}">
                                <svg class="${item.active ? 'animate-spin-slow' : 'rotate-45 group-hover:rotate-90 transition-transform duration-700'} w-3 h-3 text-accent shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                                </svg>
                            </div>
                            <div class="relative overflow-hidden inline-flex">
                                <span class="relative z-10 block transition-transform duration-300 transform-none">${createStaggerHTML(item.label)}</span>
                            </div>
                        </a>
                    `).join('')}
                </nav>

                <button id="menu-trigger" aria-label="Toggle Menu" class="lg:hidden relative z-10 w-10 h-10 flex flex-col justify-center items-end gap-[5px] group cursor-pointer overflow-hidden rounded-full transition-colors duration-300 shrink-0">
                    <span data-burger class="w-5 h-[2px] ${initialTheme.burger} rounded-full transform transition-all duration-500 origin-right group-[.menu-open]:-rotate-45 group-[.menu-open]:-translate-x-1 group-[.menu-open]:w-6"></span>
                    <span data-burger class="w-4 h-[2px] ${initialTheme.burger} rounded-full transform transition-all duration-500 origin-right group-[.menu-open]:opacity-0 shadow-[0_2px_4px_rgba(27,67,50,0.1)]"></span>
                    <span data-burger class="w-5 h-[2px] ${initialTheme.burger} rounded-full transform transition-all duration-500 origin-right group-[.menu-open]:rotate-45 group-[.menu-open]:-translate-x-1 group-[.menu-open]:w-6"></span>
                </button>
            </div>
        </header>

        <div id="fullscreen-menu" class="fixed inset-0 z-[105] pointer-events-none opacity-0 transition-opacity duration-300 flex items-center justify-center overflow-hidden">
            <div id="menu-bg-circle" class="absolute top-6 right-6 w-4 h-4 bg-primary rounded-full transition-transform duration-[800ms] ease-[cubic-bezier(0.76,0,0.24,1)]" style="transform: scale(0);"></div>
            <nav class="relative z-10 flex flex-col items-center gap-8 text-center w-full px-6">
                ${navItems.map(item => `
                    <a href="${item.url}" class="menu-item group font-bold font-sans ${item.active ? 'text-accent' : 'text-surface'} text-2xl transition-all duration-700 translate-y-16 opacity-0 flex perspective-[1000px]">
                        <span class="sr-only">${item.label}</span>
                        <div class="flex overflow-hidden relative" aria-hidden="true">
                            <div class="inline-flex">${createStaggerHTML(item.label, true)}</div>



                        </div>
                    </a>
                `).join('')}
            </nav>
            <div id="menu-ornament" class="absolute bottom-12 left-1/2 -translate-x-1/2 transition-all duration-1000 translate-y-10 flex flex-col items-center">
                <img src="${assets.logoLight}" alt="Logo Noor Ramadhan" class="h-10 w-auto object-contain ">
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('afterbegin', menuHTML);

    // ── Selectors & State ──
    const elements = {
        navbar: document.getElementById('main-navbar'),
        pill: document.getElementById('navbar-pill'),
        logo: document.getElementById('navbar-logo'),
        logoImg: document.getElementById('navbar-logo-img'),
        trigger: document.getElementById('menu-trigger'),
        menu: document.getElementById('fullscreen-menu'),
        bgCircle: document.getElementById('menu-bg-circle'),
        items: document.querySelectorAll('.menu-item'),
        ornament: document.getElementById('menu-ornament'),
        burgerBars: document.querySelectorAll('[data-burger]'),
        navLinks: document.querySelectorAll('.nav-link:not(.text-accent)')
    };

    let state = { isOpen: false, isScrolled: false };

    // ── Hover Effects ──
    document.querySelectorAll('.nav-link').forEach(link => {
        const defaultSpans = link.querySelectorAll('.nav-stagger-default > span');
        const hoverSpans = link.querySelectorAll('.nav-stagger-hover > span');
        
        link.addEventListener('mouseenter', () => {
            defaultSpans.forEach(s => s.style.transform = 'translateY(-100%)');
            hoverSpans.forEach(s => s.style.transform = 'translateY(0)');
        });
        link.addEventListener('mouseleave', () => {
            defaultSpans.forEach(s => s.style.transform = 'translateY(0)');
            hoverSpans.forEach(s => s.style.transform = 'translateY(100%)');
        });
    });

    // ── Scroll & Menu Logic ──
    const updateNavbarUI = (scrolled) => {
        elements.pill.classList.toggle('bg-white', scrolled);
        elements.pill.classList.toggle('bg-transparent', !scrolled);
        elements.pill.classList.toggle('shadow-[0_6px_30px_rgba(27,67,50,0.12)]', scrolled);
        elements.pill.classList.toggle('shadow-none', !scrolled);
        elements.pill.classList.toggle('border-primary/5', scrolled);
        elements.pill.classList.toggle('border-transparent', !scrolled);
        
        elements.logoImg.src = scrolled ? assets.logoDark : initialLogo;
        
        elements.navLinks.forEach(link => {
            link.classList.toggle('text-primary/70', scrolled || !isIndex);
            if (isIndex) link.classList.toggle('text-surface/90', !scrolled);
        });
        
        elements.burgerBars.forEach(bar => {
            bar.classList.toggle('bg-primary', scrolled || !isIndex);
            if (isIndex) bar.classList.toggle('bg-surface', !scrolled);
        });
    };

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY > 50;
        if (scrolled !== state.isScrolled) {
            state.isScrolled = scrolled;
            updateNavbarUI(scrolled);
        }
    }, { passive: true });

    elements.trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        state.isOpen = !state.isOpen;
        const { isOpen } = state;

        elements.trigger.classList.toggle('menu-open', isOpen);
        elements.menu.classList.toggle('opacity-0', !isOpen);
        elements.menu.classList.toggle('opacity-100', isOpen);
        elements.menu.classList.toggle('pointer-events-none', !isOpen);
        elements.menu.classList.toggle('pointer-events-auto', isOpen);

        if (isOpen) {
            elements.burgerBars.forEach(bar => {
                bar.classList.remove('bg-primary', 'bg-surface');
                bar.classList.add('bg-surface');
            });

            elements.pill.classList.remove('bg-white');
            elements.pill.classList.add('bg-transparent');
            elements.pill.style.boxShadow = 'none';
            elements.logo.classList.add('opacity-0', 'pointer-events-none');
            
            elements.bgCircle.style.transform = 'scale(250)';
            document.body.style.overflow = 'hidden';

            elements.items.forEach((item, i) => {
                setTimeout(() => item.classList.remove('translate-y-16', 'opacity-0'), 300 + (i * 100));
            });
            setTimeout(() => elements.ornament.classList.remove('translate-y-10', 'opacity-0'), 600);
        } else {
            const currentBurgerColor = (state.isScrolled || !isIndex) ? 'bg-primary' : 'bg-surface';
            elements.burgerBars.forEach(bar => {
                bar.classList.remove('bg-primary', 'bg-surface');
                bar.classList.add(currentBurgerColor);
            });

            elements.items.forEach(item => item.classList.add('translate-y-16', 'opacity-0'));
            elements.ornament.classList.add('translate-y-10', 'opacity-0');
            
            setTimeout(() => elements.bgCircle.style.transform = 'scale(0)', 200);
            setTimeout(() => {
                elements.pill.classList.toggle('bg-white', state.isScrolled);
                elements.pill.classList.toggle('bg-transparent', !state.isScrolled);
                elements.pill.style.boxShadow = '';
                elements.logo.classList.remove('opacity-0', 'pointer-events-none');
                document.body.style.overflow = '';
            }, 800);
        }
    });

    elements.menu.addEventListener('click', (e) => {
        if (e.target === elements.menu || e.target.tagName.toLowerCase() === 'nav') elements.trigger.click();
    });
});
