/**
 * Vanilla Smooth Scroll (Lenis-style Inertial Scroll)
 * Created for Noor Ramadhan
 */

class InertialScroll {
    constructor(options = {}) {
        this.container = options.container || document.querySelector('[data-scroll-container]');
        this.content = options.content || document.querySelector('[data-scroll-content]');
        
        if (!this.container || !this.content) return;

        this.data = {
            current: 0,
            target: 0,
            ease: options.ease || 0.1, // Increased from 0.075 for snappier feel
            last: 0,
            height: 0
        };

        this.isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        this.init();
    }

    init() {
        this.setHeight();
        this.bindEvents();
        this.render();
    }

    setHeight() {
        this.data.height = this.content.offsetHeight;
        document.body.style.height = `${this.data.height}px`;
    }

    bindEvents() {
        window.addEventListener('scroll', () => {
            // Clamp target to prevent overscroll past document bounds (mass space bug)
            const maxScroll = Math.max(0, this.data.height - window.innerHeight);
            this.data.target = Math.max(0, Math.min(window.scrollY, maxScroll));
            
            if (!this.isRendering) {
                this.isRendering = true;
                requestAnimationFrame(() => this.render());
            }
        }, { passive: true });

        // Efficient height tracking
        if (window.ResizeObserver) {
            this.resizeObserver = new ResizeObserver(() => this.setHeight());
            this.resizeObserver.observe(this.content);
        } else {
            window.addEventListener('resize', () => this.setHeight());
        }

        // Ensure images are loaded
        window.addEventListener('load', () => this.setHeight());

        // Intercept anchor links to prevent native jump conflicts
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const targetId = anchor.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    // Calculate exact position including current scroll offset
                    const targetPosition = targetElement.getBoundingClientRect().top + this.data.current;
                    
                    // Trigger the native scroll instantly; our 'scroll' listener will catch it
                    // and smoothly interpolate 'current' to the new 'target'
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'auto'
                    });
                }
            });
        });
    }

    lerp(start, end, amt) {
        return (1 - amt) * start + amt * end;
    }

    render() {
        const diff = this.data.target - this.data.current;
        const delta = Math.abs(diff);

        if (delta > 0.01) {
            this.data.current = this.lerp(this.data.current, this.data.target, this.data.ease);
            this.content.style.transform = `translate3d(0, -${this.data.current.toFixed(2)}px, 0)`;
            this.isRendering = true;
            requestAnimationFrame(() => this.render());
        } else {
            this.data.current = this.data.target;
            this.content.style.transform = `translate3d(0, -${this.data.target}px, 0)`;
            this.isRendering = false;
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Check if we already have the structure, if not, we'll manually wrap or expect it from HTML
    const container = document.querySelector('[data-scroll-container]');
    if (container) {
        new InertialScroll();
    }
});
