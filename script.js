/**
 * RICHARD RODRIGUEZ PORTFOLIO JAVASCRIPT
 * Interactive functionality following modern ES6+ practices
 * Handles navigation, animations, and user interactions
 */

// ==============================================
// DOCUMENT READY & INITIALIZATION
// ==============================================
document.addEventListener('DOMContentLoaded', function() {
    initializePortfolio();
});

/**
 * Main initialization function
 */
function initializePortfolio() {
    initializeNavigation();
    initializeScrollAnimations();
    initializeSmoothScrolling();
    initializeSkillBars();
    initializeBackToTop();
    initializeObservers();
    
    console.log('✅ Richard Rodriguez Portfolio initialized successfully');
}

// ==============================================
// NAVIGATION FUNCTIONALITY
// ==============================================
class NavigationManager {
    constructor() {
        this.hamburgerBtn = document.getElementById('hamburger');
        this.mobileMenu = document.getElementById('mobile-menu');
        this.navLinks = document.querySelectorAll('.nav__link');
        this.isMenuOpen = false;
        
        this.bindEvents();
    }
    
    bindEvents() {
        // Hamburger menu toggle
        if (this.hamburgerBtn && this.mobileMenu) {
            this.hamburgerBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMobileMenu();
            });
        }
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen && !this.mobileMenu.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
        
        // Close menu when pressing Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMobileMenu();
            }
        });
        
        // Handle nav link clicks
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                this.handleNavClick(e, link);
            });
        });
        
        // Header scroll effect
        this.initializeHeaderScroll();
    }
    
    toggleMobileMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        
        if (this.isMenuOpen) {
            this.openMobileMenu();
        } else {
            this.closeMobileMenu();
        }
    }
    
    openMobileMenu() {
        this.hamburgerBtn.classList.add('active');
        this.mobileMenu.classList.add('active');
        this.hamburgerBtn.setAttribute('aria-expanded', 'true');
        
        // Prevent background scroll
        document.body.style.overflow = 'hidden';
        
        console.log('📱 Mobile menu opened');
    }
    
    closeMobileMenu() {
        this.isMenuOpen = false;
        this.hamburgerBtn.classList.remove('active');
        this.mobileMenu.classList.remove('active');
        this.hamburgerBtn.setAttribute('aria-expanded', 'false');
        
        // Restore background scroll
        document.body.style.overflow = '';
        
        console.log('📱 Mobile menu closed');
    }
    
    handleNavClick(e, link) {
        const href = link.getAttribute('href');
        
        // Handle internal links (anchor links)
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                this.scrollToElement(targetElement);
                
                // Close mobile menu if open
                if (this.isMenuOpen) {
                    this.closeMobileMenu();
                }
                
                // Update active link
                this.updateActiveNavLink(link);
            }
        }
    }
    
    scrollToElement(element) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
    
    updateActiveNavLink(activeLink) {
        // Remove active class from all links
        this.navLinks.forEach(link => {
            link.classList.remove('nav__link--active');
        });
        
        // Add active class to clicked link
        activeLink.classList.add('nav__link--active');
    }
    
    initializeHeaderScroll() {
        const header = document.querySelector('.header');
        let lastScrollY = window.scrollY;
        let ticking = false;
        
        const updateHeader = () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
                header.style.backdropFilter = 'blur(15px)';
                header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
                header.style.boxShadow = 'none';
            }
            
            lastScrollY = currentScrollY;
            ticking = false;
        };
        
        const requestHeaderUpdate = () => {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', requestHeaderUpdate);
        
        // Initial call
        updateHeader();
    }
}

function initializeNavigation() {
    window.navigationManager = new NavigationManager();
}

// ==============================================
// SCROLL ANIMATIONS
// ==============================================
class ScrollAnimationManager {
    constructor() {
        this.animatedElements = [];
        this.observers = [];
        this.setupIntersectionObserver();
    }
    
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Trigger skill bar animations
                    if (entry.target.classList.contains('skills')) {
                        this.animateSkillBars();
                    }
                    
                    // Stop observing once animated
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe sections for fade-in animations
        const sectionsToAnimate = [
            '.hero',
            '.about',
            '.skills',
            '.projects',
            '.experience',
            '.footer'
        ];
        
        sectionsToAnimate.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.classList.add('fade-in-on-scroll');
                observer.observe(element);
            });
        });
        
        this.observers.push(observer);
    }
    
    animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-bar__fill');
        
        skillBars.forEach((bar, index) => {
            setTimeout(() => {
                const level = bar.getAttribute('data-level');
                if (level) {
                    bar.style.width = level + '%';
                }
            }, index * 200);
        });
        
        console.log('📊 Skill bars animated');
    }
}

function initializeScrollAnimations() {
    window.scrollAnimationManager = new ScrollAnimationManager();
}

// ==============================================
// SMOOTH SCROLLING FOR ALL INTERNAL LINKS
// ==============================================
function initializeSmoothScrolling() {
    // Handle all anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement && targetId !== '') {
                e.preventDefault();
                
                const headerHeight = document.querySelector('.header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ==============================================
// SKILL BAR ANIMATIONS
// ==============================================
function initializeSkillBars() {
    const skillSection = document.querySelector('.skills');
    let skillsAnimated = false;
    
    const animateSkillsOnScroll = () => {
        if (skillsAnimated) return;
        
        const sectionTop = skillSection.getBoundingClientRect().top;
        const sectionHeight = skillSection.offsetHeight;
        const windowHeight = window.innerHeight;
        
        if (sectionTop < windowHeight && sectionTop + sectionHeight > 0) {
            skillsAnimated = true;
            
            const skillBars = document.querySelectorAll('.skill-bar__fill');
            skillBars.forEach((bar, index) => {
                setTimeout(() => {
                    const level = bar.getAttribute('data-level');
                    if (level) {
                        bar.style.width = level + '%';
                    }
                }, index * 200);
            });
            
            window.removeEventListener('scroll', animateSkillsOnScroll);
        }
    };
    
    window.addEventListener('scroll', animateSkillsOnScroll);
}

// ==============================================
// BACK TO TOP FUNCTIONALITY
// ==============================================
class BackToTopManager {
    constructor() {
        this.backToTopBtn = document.getElementById('back-to-top');
        this.isVisible = false;
        
        if (this.backToTopBtn) {
            this.bindEvents();
            this.handleScroll();
        }
    }
    
    bindEvents() {
        this.backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.scrollToTop();
        });
        
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', handleScroll);
    }
    
    handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const shouldShow = scrollTop > 500;
        
        if (shouldShow && !this.isVisible) {
            this.showButton();
        } else if (!shouldShow && this.isVisible) {
            this.hideButton();
        }
    }
    
    showButton() {
        this.isVisible = true;
        this.backToTopBtn.style.opacity = '1';
        this.backToTopBtn.style.transform = 'translateY(0)';
        this.backToTopBtn.style.pointerEvents = 'auto';
    }
    
    hideButton() {
        this.isVisible = false;
        this.backToTopBtn.style.opacity = '0';
        this.backToTopBtn.style.transform = 'translateY(20px)';
        this.backToTopBtn.style.pointerEvents = 'none';
    }
    
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

function initializeBackToTop() {
    // Initially hide back to top button
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        backToTopBtn.style.opacity = '0';
        backToTopBtn.style.transform = 'translateY(20px)';
        backToTopBtn.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        backToTopBtn.style.pointerEvents = 'none';
    }
    
    window.backToTopManager = new BackToTopManager();
}

// ==============================================
// INTERSECTION OBSERVERS FOR ADVANCED ANIMATIONS
// ==============================================
function initializeObservers() {
    // Stats counter animation
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStatCounters();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const statsSection = document.querySelector('.about__stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
    
    // Project cards stagger animation
    const projectsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const cards = entry.target.querySelectorAll('.project-card');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 200);
                });
                projectsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    const projectsGrid = document.querySelector('.projects__grid');
    if (projectsGrid) {
        // Initially hide project cards
        const cards = projectsGrid.querySelectorAll('.project-card');
        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });
        
        projectsObserver.observe(projectsGrid);
    }
}

// ==============================================
// COUNTER ANIMATIONS
// ==============================================
function animateStatCounters() {
    const statNumbers = document.querySelectorAll('.stat__number');
    
    statNumbers.forEach(stat => {
        const text = stat.textContent;
        const number = parseInt(text.replace(/[^0-9]/g, ''));
        const suffix = text.replace(/[0-9]/g, '');
        
        if (!isNaN(number)) {
            animateCounter(stat, 0, number, suffix, 1000);
        }
    });
}

function animateCounter(element, start, end, suffix, duration) {
    const startTime = performance.now();
    const startValue = start;
    const endValue = end;
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        
        const currentValue = Math.round(startValue + (endValue - startValue) * easeProgress);
        element.textContent = currentValue + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// ==============================================
// UTILITY FUNCTIONS
// ==============================================
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

function throttle(func, delay) {
    let timeoutId;
    let lastExecTime = 0;
    return function (...args) {
        const currentTime = Date.now();
        
        if (currentTime - lastExecTime > delay) {
            func.apply(this, args);
            lastExecTime = currentTime;
        } else {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
                lastExecTime = Date.now();
            }, delay - (currentTime - lastExecTime));
        }
    };
}

// ==============================================
// PERFORMANCE OPTIMIZATIONS
// ==============================================
// Lazy load images when they're implemented
function initializeLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// ==============================================
// ACCESSIBILITY ENHANCEMENTS
// ==============================================
function initializeAccessibility() {
    // Keyboard navigation for custom elements
    const focusableElements = document.querySelectorAll('button, a, input, textarea, select, details, [tabindex]:not([tabindex="-1"])');
    
    // Add focus indicators for keyboard navigation
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.setAttribute('data-keyboard-focus', 'true');
        });
        
        element.addEventListener('blur', function() {
            this.removeAttribute('data-keyboard-focus');
        });
    });
    
    // Announce page changes for screen readers
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.style.position = 'absolute';
    announcer.style.left = '-9999px';
    announcer.style.width = '1px';
    announcer.style.height = '1px';
    announcer.style.overflow = 'hidden';
    document.body.appendChild(announcer);
    
    window.announceToScreenReader = function(message) {
        announcer.textContent = message;
        setTimeout(() => {
            announcer.textContent = '';
        }, 1000);
    };
}

// ==============================================
// ERROR HANDLING
// ==============================================
window.addEventListener('error', function(e) {
    console.error('Portfolio Error:', e.error);
    
    // Graceful degradation - ensure basic functionality still works
    if (typeof window.navigationManager === 'undefined') {
        console.warn('Navigation manager failed to initialize, setting up basic functionality');
        initializeBasicNavigation();
    }
});

function initializeBasicNavigation() {
    // Fallback navigation for when main navigation fails
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
}

// ==============================================
// CONSOLE WELCOME MESSAGE
// ==============================================
console.log(`
🎨 Welcome to Richard Rodriguez's Portfolio!
📧 Built with modern web technologies
⚡ Optimized for performance and accessibility
🔧 Developed with BEM methodology

Portfolio Features:
✅ Responsive Design
✅ Smooth Animations  
✅ Accessible Navigation
✅ Performance Optimized
✅ SEO Friendly

Contact: richard@example.com
`);