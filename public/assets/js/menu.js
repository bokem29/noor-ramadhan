document.addEventListener('DOMContentLoaded', () => {
    const isInPages = window.location.pathname.includes('/pages/');
    const currentPath = window.location.pathname;
    const isIndex = currentPath.endsWith('index.html') || currentPath.endsWith('/') || !currentPath.includes('.html');

    const navItems = [
        { label: 'Beranda', url: isInPages ? '../index.html' : 'index.html', active: isIndex },
        { label: 'Jadwal Imsakiyah', url: isInPages ? 'imsakiyah.html' : 'pages/imsakiyah.html', active: currentPath.includes('imsakiyah.html') },
        { label: 'Kitab Amal', url: isInPages ? 'todolist.html' : 'pages/todolist.html', active: currentPath.includes('todolist.html') },
        { label: 'Zikir Counter', url: isInPages ? 'zikir.html' : 'pages/zikir.html', active: currentPath.includes('zikir.html') },
        { label: 'Kalkulator Zakat', url: isInPages ? 'zakat.html' : 'pages/zakat.html', active: currentPath.includes('zakat.html') },
        { label: 'Doa & Niat', url: isInPages ? 'doa.html' : 'pages/doa.html', active: currentPath.includes('doa.html') },
    ];

    // Helper: generate staggered letter spans for hover effect
    function staggeredLabel(label, isActive) {
        const chars = label.split('');
        const defaultSpans = chars.map((char, i) =>
            `<span class="inline-block transition-transform duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]" style="transition-delay: ${i * 25}ms">${char === ' ' ? '&nbsp;' : char}</span>`
        ).join('');
        const hoverSpans = chars.map((char, i) =>
            `<span class="inline-block transition-transform duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] translate-y-full" style="transition-delay: ${i * 25}ms">${char === ' ' ? '&nbsp;' : char}</span>`
        ).join('');
        return `
            <span class="sr-only">${label}</span>
            <span class="nav-stagger-wrap relative overflow-hidden inline-flex" aria-hidden="true">
                <span class="nav-stagger-default inline-flex">${defaultSpans}</span>
                <span class="nav-stagger-hover absolute inset-0 inline-flex text-accent">${hoverSpans}</span>
            </span>
        `;
    }

    // Determine if this page has a dark hero (index/landing page)
    const hasDarkHero = isIndex;
    const logoDark = isInPages ? '../public/assets/images/logo3.png' : './public/assets/images/logo3.png';
    const logoLight = isInPages ? '../public/assets/images/logo2.png' : './public/assets/images/logo2.png';

    // Initial colors: dark hero = white text, light pages = primary text
    const initialTextClass = hasDarkHero ? 'text-surface/90' : 'text-primary/70';
    const initialBurgerBg = hasDarkHero ? 'bg-surface' : 'bg-primary';
    const initialLogo = hasDarkHero ? logoLight : logoDark;

    const menuHTML = `
        <!-- Edge-to-Edge Navbar -->
        <header id="main-navbar" class="fixed top-0 left-0 w-full z-[110] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
            <div id="navbar-pill" class="bg-transparent w-full px-6 md:px-12 lg:px-16 py-4 md:py-5 flex justify-between items-center shadow-none border-b border-transparent transition-all duration-500">

                <!-- Logo -->
                <a id="navbar-logo" href="${navItems[0].url}" class="relative z-10 flex items-center gap-3 group shrink-0 transition-all duration-500">
                    <img id="navbar-logo-img" src="${initialLogo}" alt="Noor Ramadhan" class="h-7 md:h-9 w-auto object-contain transition-all duration-500 group-hover:scale-105">
                </a>

                <!-- Desktop Navigation -->
                <nav class="hidden lg:flex items-center gap-8 relative z-10">
                    ${navItems.map(item => `
                        <a href="${item.url}" class="nav-link group relative flex items-center font-sans text-[11px] font-bold uppercase tracking-[0.18em] ${item.active ? 'text-accent' : initialTextClass} py-2 whitespace-nowrap cursor-pointer transition-colors duration-500">
                            <!-- Creative Active Indicator (Spinning Star) -->
                            <div class="flex items-center justify-center w-0 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${item.active ? 'w-5 opacity-100 mr-1' : 'w-0 opacity-0 mr-0 group-hover:w-4 group-hover:opacity-50 group-hover:mr-1'}">
                                <svg class="${item.active ? 'animate-spin-slow' : 'rotate-45 group-hover:rotate-90 transition-transform duration-700'} w-3 h-3 text-accent shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                                </svg>
                            </div>

                            <div class="relative overflow-hidden inline-flex">
                                <span class="relative z-10 block transition-transform duration-300 transform-none">${staggeredLabel(item.label, item.active)}</span>
                            </div>
                        </a>
                    `).join('')}
                </nav>

                <!-- Mobile Hamburger Trigger -->
                <button id="menu-trigger" aria-label="Toggle Menu" class="lg:hidden relative z-10 w-10 h-10 flex flex-col justify-center items-end gap-[5px] group cursor-pointer overflow-hidden rounded-full transition-colors duration-300 shrink-0">
                    <span data-burger class="w-5 h-[2px] ${initialBurgerBg} rounded-full transform transition-all duration-500 origin-right group-[.menu-open]:-rotate-45 group-[.menu-open]:-translate-x-1 group-[.menu-open]:w-6"></span>
                    <span data-burger class="w-4 h-[2px] ${initialBurgerBg} rounded-full transform transition-all duration-500 origin-right group-[.menu-open]:opacity-0 shadow-[0_2px_4px_rgba(27,67,50,0.1)]"></span>
                    <span data-burger class="w-5 h-[2px] ${initialBurgerBg} rounded-full transform transition-all duration-500 origin-right group-[.menu-open]:rotate-45 group-[.menu-open]:-translate-x-1 group-[.menu-open]:w-6"></span>
                </button>
            </div>
        </header>

        <!-- Mobile Fullscreen Menu -->
        <div id="fullscreen-menu" class="fixed inset-0 z-[105] pointer-events-none opacity-0 transition-opacity duration-300 flex items-center justify-center overflow-hidden">
            <!-- Liquid BG effect -->
            <div id="menu-bg-circle" class="absolute top-6 right-6 w-4 h-4 bg-primary rounded-full transition-transform duration-[800ms] ease-[cubic-bezier(0.76,0,0.24,1)]" style="transform: scale(0);"></div>
            
            <nav class="relative z-10 flex flex-col items-center gap-8 text-center w-full px-6">
                ${navItems.map((item, index) => `
                    <a href="${item.url}" class="menu-item group font-bold font-sans ${item.active ? 'text-accent' : 'text-surface'} text-2xl transition-all duration-700 translate-y-16 opacity-0 flex perspective-[1000px]">
                        <span class="sr-only">${item.label}</span>
                        <div class="flex overflow-hidden relative" aria-hidden="true">
                            ${item.label.split('').map((char, i) => `<span class="inline-block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] transform group-hover:-translate-y-full" style="transition-delay: ${i * 15}ms">${char === ' ' ? '&nbsp;' : char}</span>`).join('')}
                            <div class="absolute inset-0 flex text-accent">
                                ${item.label.split('').map((char, i) => `<span class="inline-block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] transform translate-y-full group-hover:translate-y-0" style="transition-delay: ${i * 15}ms">${char === ' ' ? '&nbsp;' : char}</span>`).join('')}
                            </div>
                        </div>
                    </a>
                `).join('')}
            </nav>
            
            <!-- Ornaments inside menu -->
            <div id="menu-ornament" class="absolute bottom-12 left-1/2 -translate-x-1/2 transition-all duration-1000 translate-y-10 flex flex-col items-center">
                <img src="${isInPages ? '../public/assets/images/logo3.png' : './public/assets/images/logo2.png'}" alt="Logo Noor Ramadhan" class="h-10 w-auto object-contain ">
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('afterbegin', menuHTML);

    const navbar = document.getElementById('main-navbar');
    const pill = document.getElementById('navbar-pill');
    const navLogo = document.getElementById('navbar-logo');
    const navLogoImg = document.getElementById('navbar-logo-img');
    const trigger = document.getElementById('menu-trigger');
    const menu = document.getElementById('fullscreen-menu');
    const bgCircle = document.getElementById('menu-bg-circle');
    const items = document.querySelectorAll('.menu-item');
    const ornament = document.getElementById('menu-ornament');
    const burgerBars = document.querySelectorAll('[data-burger]');
    const navLinks = document.querySelectorAll('.nav-link:not(.text-accent)');

    let isOpen = false;
    let isScrolled = false;

    // ── Desktop Staggered Hover Effect ──
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('mouseenter', () => {
            const defaultSpans = link.querySelectorAll('.nav-stagger-default > span');
            const hoverSpans = link.querySelectorAll('.nav-stagger-hover > span');
            defaultSpans.forEach(s => s.style.transform = 'translateY(-100%)');
            hoverSpans.forEach(s => s.style.transform = 'translateY(0)');
        });
        link.addEventListener('mouseleave', () => {
            const defaultSpans = link.querySelectorAll('.nav-stagger-default > span');
            const hoverSpans = link.querySelectorAll('.nav-stagger-hover > span');
            defaultSpans.forEach(s => s.style.transform = 'translateY(0)');
            hoverSpans.forEach(s => s.style.transform = 'translateY(100%)');
        });
    });

    // ── Scroll Effect: transparent → solid ──
    function updateNavbarState() {
        const scrolled = window.scrollY > 50;
        if (scrolled === isScrolled) return;
        isScrolled = scrolled;

        if (scrolled) {
            // Scrolled: white bg, primary text, dark logo
            pill.classList.replace('bg-transparent', 'bg-white');
            pill.classList.replace('shadow-none', 'shadow-[0_6px_30px_rgba(27,67,50,0.12)]');
            pill.classList.replace('border-transparent', 'border-primary/5');
            navLogoImg.src = logoDark;

            // Switch nav links to primary
            navLinks.forEach(link => {
                if (hasDarkHero) {
                    link.classList.remove('text-surface/90');
                }
                link.classList.add('text-primary/70');
            });
            // Switch burger bars to primary
            burgerBars.forEach(bar => {
                if (hasDarkHero) bar.classList.replace('bg-surface', 'bg-primary');
            });
        } else {
            // At top: transparent bg, adapt text
            pill.classList.replace('bg-white', 'bg-transparent');
            pill.classList.replace('shadow-[0_6px_30px_rgba(27,67,50,0.12)]', 'shadow-none');
            pill.classList.replace('border-primary/5', 'border-transparent');
            navLogoImg.src = initialLogo;

            // Restore initial nav link colors
            navLinks.forEach(link => {
                link.classList.remove('text-primary/70');
                if (hasDarkHero) {
                    link.classList.add('text-surface/90');
                } else {
                    link.classList.add('text-primary/70');
                }
            });
            // Restore burger bars
            burgerBars.forEach(bar => {
                if (hasDarkHero) bar.classList.replace('bg-primary', 'bg-surface');
            });
        }
    }

    window.addEventListener('scroll', updateNavbarState, { passive: true });

    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        isOpen = !isOpen;

        if (isOpen) {
            trigger.classList.add('menu-open');
            // Change burger color to white because background expands to dark primary
            burgerBars.forEach(bar => {
                bar.classList.remove('bg-primary', 'bg-surface');
                bar.classList.add('bg-surface');
            });

            // Hide navbar visuals so it doesn't show over fullscreen menu
            pill.classList.remove('bg-white');
            pill.classList.add('bg-transparent');
            pill.style.boxShadow = 'none';
            pill.style.borderColor = 'transparent';
            navLogo.classList.add('opacity-0', 'pointer-events-none');
            
            menu.classList.remove('pointer-events-none', 'opacity-0');
            menu.classList.add('opacity-100', 'pointer-events-auto');

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    bgCircle.style.transform = 'scale(250)';
                });
            });

            // Prevent scroll shift
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.paddingRight = `${scrollbarWidth}px`;
            navbar.style.paddingRight = `calc(1.5rem + ${scrollbarWidth}px)`;
            if (window.innerWidth >= 768) {
                navbar.style.paddingRight = `calc(3rem + ${scrollbarWidth}px)`;
            }

            document.body.style.overflow = 'hidden';

            items.forEach((item, i) => {
                setTimeout(() => {
                    item.classList.remove('translate-y-16', 'opacity-0');
                    item.classList.add('translate-y-0', 'opacity-100');
                }, 300 + (i * 100)); // staggered delay
            });

            setTimeout(() => {
                ornament.classList.remove('translate-y-10', 'opacity-0');
            }, 600);

        } else {
            trigger.classList.remove('menu-open');
            // Restore burger color based on current scroll state
            const currentBurgerColor = (isScrolled || !hasDarkHero) ? 'bg-primary' : 'bg-surface';
            burgerBars.forEach(bar => {
                bar.classList.remove('bg-primary', 'bg-surface');
                bar.classList.add(currentBurgerColor);
            });

            items.forEach((item) => {
                item.classList.remove('translate-y-0', 'opacity-100');
                item.classList.add('translate-y-16', 'opacity-0');
            });

            ornament.classList.add('translate-y-10', 'opacity-0');

            setTimeout(() => {
                bgCircle.style.transform = 'scale(0)';
            }, 200);

            setTimeout(() => {
                // Restore navbar state based on scroll position
                pill.classList.remove('bg-transparent', 'bg-white');
                pill.classList.add(isScrolled ? 'bg-white' : 'bg-transparent');
                pill.style.boxShadow = '';
                pill.style.borderColor = '';
                navLogo.classList.remove('opacity-0', 'pointer-events-none');

                menu.classList.remove('opacity-100', 'pointer-events-auto');
                menu.classList.add('pointer-events-none', 'opacity-0');
                document.body.style.overflow = '';
                document.body.style.paddingRight = '';
                navbar.style.paddingRight = '';
            }, 800);
        }
    });

    menu.addEventListener('click', (e) => {
        if (e.target === menu || e.target.tagName.toLowerCase() === 'nav') {
            trigger.click();
        }
    });
});
