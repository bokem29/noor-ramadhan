document.addEventListener('DOMContentLoaded', () => {
    // Generate the menu HTML dynamically so we only maintain it in one place
    const isInPages = window.location.pathname.includes('/pages/');
    const menuHTML = `
        <button id="menu-trigger" aria-label="Toggle Menu" class="fixed top-6 right-6 md:top-10 md:right-10 z-[110] w-14 h-14 flex flex-col justify-center items-center gap-[6px] group cursor-pointer overflow-hidden rounded-[8px] bg-primary border border-surface/20 transition-colors duration-500 hover:bg-primary/90 hover:border-accent">
            <span class="w-6 h-[2px] bg-accent rounded-full transform transition-all duration-500 origin-center group-[.menu-open]:rotate-45 group-[.menu-open]:translate-y-[8px]"></span>
            <span class="w-6 h-[2px] bg-accent rounded-full transform transition-all duration-500 origin-center group-[.menu-open]:opacity-0 group-[.menu-open]:translate-x-4"></span>
            <span class="w-6 h-[2px] bg-accent rounded-full transform transition-all duration-500 origin-center group-[.menu-open]:-rotate-45 group-[.menu-open]:-translate-y-[8px]"></span>
        </button>

        <!-- Fullscreen Menu -->
        <div id="fullscreen-menu" class="fixed inset-0 z-[105] pointer-events-none opacity-0 transition-opacity duration-300 flex items-center justify-center overflow-hidden">
            <!-- Liquid/Orbit BG effect -->
            <div id="menu-bg-circle" class="absolute top-10 right-10 md:top-14 md:right-14 w-4 h-4 bg-[#0a1e16] rounded-full transition-transform duration-[800ms] ease-[cubic-bezier(0.76,0,0.24,1)]" style="transform: scale(0);"></div>
            
            <nav class="relative z-10 flex flex-col items-center gap-8 md:gap-12 text-center w-full px-6 -mt-16">
                <a href="${isInPages ? '../index.html' : 'index.html'}" class="menu-item group font-bold font-sans text-background text-2xl md:text-3xl lg:text-4xl transition-all duration-700 translate-y-16 opacity-0 flex perspective-[1000px]">
                    <span class="sr-only">Doa & Niat Puasa</span>
                    <div class="flex overflow-hidden relative" aria-hidden="true">
                        ${'Doa & Niat Puasa'.split('').map((char, index) => `<span class="inline-block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] transform group-hover:-translate-y-full" style="transition-delay: ${index * 20}ms">${char === ' ' ? '&nbsp;' : char}</span>`).join('')}
                        <div class="absolute inset-0 flex text-accent">
                            ${'Doa & Niat Puasa'.split('').map((char, index) => `<span class="inline-block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] transform translate-y-full group-hover:translate-y-0" style="transition-delay: ${index * 20}ms">${char === ' ' ? '&nbsp;' : char}</span>`).join('')}
                        </div>
                    </div>
                </a>
                
                <a href="${isInPages ? 'zikir.html' : 'pages/zikir.html'}" class="menu-item group font-bold font-sans text-background text-2xl md:text-3xl lg:text-4xl transition-all duration-700 translate-y-16 opacity-0 flex perspective-[1000px]">
                    <span class="sr-only">Zikir Counter</span>
                    <div class="flex overflow-hidden relative" aria-hidden="true">
                        ${'Zikir Counter'.split('').map((char, index) => `<span class="inline-block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] transform group-hover:-translate-y-full" style="transition-delay: ${index * 20}ms">${char === ' ' ? '&nbsp;' : char}</span>`).join('')}
                        <div class="absolute inset-0 flex text-accent">
                            ${'Zikir Counter'.split('').map((char, index) => `<span class="inline-block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] transform translate-y-full group-hover:translate-y-0" style="transition-delay: ${index * 20}ms">${char === ' ' ? '&nbsp;' : char}</span>`).join('')}
                        </div>
                    </div>
                </a>

                <a href="${isInPages ? 'zakat.html' : 'pages/zakat.html'}" class="menu-item group font-bold font-sans text-background text-2xl md:text-3xl lg:text-4xl transition-all duration-700 translate-y-16 opacity-0 flex perspective-[1000px]">
                    <span class="sr-only">Kalkulator Zakat</span>
                    <div class="flex overflow-hidden relative" aria-hidden="true">
                        ${'Kalkulator Zakat'.split('').map((char, index) => `<span class="inline-block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] transform group-hover:-translate-y-full" style="transition-delay: ${index * 20}ms">${char === ' ' ? '&nbsp;' : char}</span>`).join('')}
                        <div class="absolute inset-0 flex text-accent">
                            ${'Kalkulator Zakat'.split('').map((char, index) => `<span class="inline-block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] transform translate-y-full group-hover:translate-y-0" style="transition-delay: ${index * 20}ms">${char === ' ' ? '&nbsp;' : char}</span>`).join('')}
                        </div>
                    </div>
                </a>

                <a href="${isInPages ? 'todolist.html' : 'pages/todolist.html'}" class="menu-item group font-bold font-sans text-background text-2xl md:text-3xl lg:text-4xl transition-all duration-700 translate-y-16 opacity-0 flex perspective-[1000px]">
                    <span class="sr-only">Kitab Amal</span>
                    <div class="flex overflow-hidden relative" aria-hidden="true">
                        ${'Kitab Amal'.split('').map((char, index) => `<span class="inline-block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] transform group-hover:-translate-y-full" style="transition-delay: ${index * 20}ms">${char === ' ' ? '&nbsp;' : char}</span>`).join('')}
                        <div class="absolute inset-0 flex text-accent">
                            ${'Kitab Amal'.split('').map((char, index) => `<span class="inline-block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] transform translate-y-full group-hover:translate-y-0" style="transition-delay: ${index * 20}ms">${char === ' ' ? '&nbsp;' : char}</span>`).join('')}
                        </div>
                    </div>
                </a>
            </nav>
            
            <!-- Ornaments inside menu -->
            <div id="menu-ornament" class="absolute bottom-16 left-1/2 -translate-x-1/2 opacity-0 transition-all duration-1000 translate-y-10 flex flex-col items-center">
                <img src="${isInPages ? '../public/assets/images/logo2.png' : './public/assets/images/logo2.png'}" alt="Logo Noor Ramadhan" class="h-12 w-auto object-contain ">
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', menuHTML);

    const trigger = document.getElementById('menu-trigger');
    const menu = document.getElementById('fullscreen-menu');
    const bgCircle = document.getElementById('menu-bg-circle');
    const items = document.querySelectorAll('.menu-item');
    const ornament = document.getElementById('menu-ornament');

    let isOpen = false;

    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        isOpen = !isOpen;

        if (isOpen) {
            trigger.classList.add('menu-open');
            // Show menu container
            menu.classList.remove('pointer-events-none', 'opacity-0');
            menu.classList.add('opacity-100', 'pointer-events-auto');

            // Double rAF ensures the browser paints the flexbox visibility before starting the transition
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    bgCircle.style.transform = 'scale(250)';
                });
            });

            // Calculate scrollbar width to prevent layout shift
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

            // Apply padding to body and button to compensate for removed scrollbar
            document.body.style.paddingRight = `${scrollbarWidth}px`;
            trigger.style.right = `calc(1.5rem + ${scrollbarWidth}px)`; // right-6 + scrollbar
            if (window.innerWidth >= 768) { // md:right-10
                trigger.style.right = `calc(2.5rem + ${scrollbarWidth}px)`;
            }

            // Disable body scroll smoothly
            document.body.style.overflow = 'hidden';

            // Animate items in
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

            // Animate items out quickly
            items.forEach((item) => {
                item.classList.remove('translate-y-0', 'opacity-100');
                item.classList.add('translate-y-16', 'opacity-0');
            });

            ornament.classList.add('translate-y-10', 'opacity-0');

            // Shrink circle slightly after items
            setTimeout(() => {
                bgCircle.style.transform = 'scale(0)';
            }, 200);

            // Hide menu container entirely & restore scrolling
            setTimeout(() => {
                menu.classList.remove('opacity-100', 'pointer-events-auto');
                menu.classList.add('pointer-events-none', 'opacity-0');

                // Restore body scroll and remove compensation padding
                document.body.style.overflow = '';
                document.body.style.paddingRight = '';
                trigger.style.right = '';
            }, 800);
        }
    });

    // Close menu when clicking outside (on the dark background itself)
    menu.addEventListener('click', (e) => {
        if (e.target === menu || e.target.tagName.toLowerCase() === 'nav') {
            trigger.click();
        }
    });
});
