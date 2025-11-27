document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation Toggle
    const navToggle = document.getElementById('nav-toggle');
    const nav = document.getElementById('nav');
    
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            // Logic to show mobile menu would go here (requires CSS update for .active state)
        });
    }

    // ============================================
    // DARK MODE TOGGLE
    // ============================================

    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;

    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);

    // Update icon based on current theme
    if (themeIcon) {
        themeIcon.className = currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    // Toggle theme on button click
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';

            // Update theme
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);

            // Update icon with animation
            if (themeIcon) {
                themeIcon.style.transform = 'rotate(360deg)';
                setTimeout(() => {
                    themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
                    themeIcon.style.transform = 'rotate(0deg)';
                }, 300);
            }

            // Add a brief flash effect
            document.body.style.transition = 'background-color 0.5s ease';
        });
    }

    // Sticky Header Effect
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            header.style.background = 'rgba(255, 255, 255, 0.95)';
        } else {
            header.style.boxShadow = 'none';
            header.style.background = 'rgba(255, 255, 255, 0.8)';
        }
    });

    // Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // SCROLL REVEAL ANIMATIONS
    // ============================================

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add stagger delay for multiple elements
                setTimeout(() => {
                    entry.target.classList.add('active');
                }, index * 100);
                scrollObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe scroll-reveal elements
    const revealElements = document.querySelectorAll(
        '.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale, ' +
        '.feature-card, .service-card, .resource-card, .improve-card, ' +
        '.team-card, .stat-box, .info-card'
    );

    revealElements.forEach(el => {
        el.classList.add('scroll-reveal');
        scrollObserver.observe(el);
    });

    // ============================================
    // COUNTER ANIMATION FOR STATS
    // ============================================

    const animateCounter = (element, target, duration = 2000) => {
        let start = 0;
        const increment = target / (duration / 16);

        const updateCounter = () => {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start) + '+';
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target + '+';
            }
        };

        updateCounter();
    };

    // Observe stat counters
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumber = entry.target.querySelector('.stat-number');
                if (statNumber && !statNumber.classList.contains('counted')) {
                    const target = parseInt(statNumber.textContent);
                    statNumber.classList.add('counted');
                    animateCounter(statNumber, target);
                }
                statObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-box').forEach(box => {
        statObserver.observe(box);
    });

    // ============================================
    // PARALLAX EFFECT FOR HERO SECTION
    // ============================================

    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroContent = document.querySelector('.hero-content');
            const heroImage = document.querySelector('.hero-image');

            if (heroContent && scrolled < 600) {
                heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
                heroContent.style.opacity = 1 - (scrolled * 0.002);
            }

            if (heroImage && scrolled < 600) {
                heroImage.style.transform = `translateY(${scrolled * 0.2}px)`;
            }
        });
    }

    // ============================================
    // FLOATING ANIMATION FOR ILLUSTRATIONS
    // ============================================

    const floatingElements = document.querySelectorAll('.hero-illustration, .about-img img');
    floatingElements.forEach(el => {
        el.classList.add('floating');
    });

    // ============================================
    // FORM INPUT ANIMATIONS
    // ============================================

    const formInputs = document.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
        // Add focus animation
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('input-focused');
        });

        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('input-focused');
        });

        // Add filled class if input has value
        input.addEventListener('input', function() {
            if (this.value.length > 0) {
                this.classList.add('has-content');
            } else {
                this.classList.remove('has-content');
            }
        });
    });

    // ============================================
    // BUTTON RIPPLE EFFECT
    // ============================================

    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.7);
                transform: translate(-50%, -50%) scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
                left: ${x}px;
                top: ${y}px;
            `;

            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add ripple animation CSS
    const rippleStyle = document.createElement('style');
    rippleStyle.innerHTML = `
        @keyframes ripple {
            to {
                transform: translate(-50%, -50%) scale(20);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);

    // ============================================
    // NAVBAR ACTIVE STATE
    // ============================================

    const navLinks = document.querySelectorAll('.nav-link');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    // ============================================
    // LOADING ANIMATION
    // ============================================

    window.addEventListener('load', () => {
        document.body.classList.add('loaded');

        // Trigger animations on page load
        setTimeout(() => {
            const heroElements = document.querySelectorAll('.hero-content, .hero-image');
            heroElements.forEach((el, index) => {
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, index * 200);
            });
        }, 100);
    });
});
