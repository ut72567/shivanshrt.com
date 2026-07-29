document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Loading Screen ---
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => loader.style.display = 'none', 500);
    }, 1200);

    // --- 2. Custom Cursor ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    // Disable custom cursor on touch devices
    if(window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;
            
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;
            
            // Slight delay for the outline outline
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 150, fill: "forwards" });
        });

        // Cursor hover effect on interactive elements
        const interactives = document.querySelectorAll('a, button, input, textarea, .tilt-card');
        interactives.forEach(el => {
            el.addEventListener('mouseenter', () => cursorOutline.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => cursorOutline.classList.remove('cursor-hover'));
        });
    }

    // --- 3. Scroll Functionality (Nav, Progress, Reveal, Top Btn) ---
    const navbar = document.getElementById('navbar');
    const scrollProgress = document.getElementById('scroll-progress');
    const backToTop = document.getElementById('back-to-top');
    const sections = document.querySelectorAll('.section-reveal');

    window.addEventListener('scroll', () => {
        // Sticky Nav
        if (window.scrollY > 50) navbar.classList.add('sticky');
        else navbar.classList.remove('sticky');

        // Scroll Progress
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = (scrollTop / scrollHeight) * 100;
        scrollProgress.style.width = progress + "%";

        // Back to top button
        if (scrollTop > 500) backToTop.classList.add('visible');
        else backToTop.classList.remove('visible');

        // Section Reveal
        sections.forEach(sec => {
            const secTop = sec.getBoundingClientRect().top;
            if (secTop < window.innerHeight - 100) {
                sec.classList.add('visible');
            }
        });
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // --- 4. Dark/Light Mode Theme Toggle ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const themeIcon = themeToggleBtn.querySelector('i');
    
    // Default to dark as requested by standard aesthetics
    let isDark = true; 
    
    themeToggleBtn.addEventListener('click', () => {
        isDark = !isDark;
        if (isDark) {
            htmlElement.setAttribute('data-theme', 'dark');
            themeIcon.className = 'fas fa-moon';
        } else {
            htmlElement.setAttribute('data-theme', 'light');
            themeIcon.className = 'fas fa-sun';
        }
    });

    // --- 5. Mobile Menu Toggle ---
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    mobileBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // --- 6. Notification System ---
    function showNotification(message) {
        const container = document.getElementById('notification-container');
        const notif = document.createElement('div');
        notif.className = 'notification';
        notif.innerHTML = `<i class="fas fa-bell"></i> &nbsp; ${message}`;
        container.appendChild(notif);
        
        setTimeout(() => {
            notif.style.opacity = '0';
            setTimeout(() => notif.remove(), 300);
        }, 4000);
    }

    // --- 7. SRT Easter Egg (Click Logo 5 Times) ---
    const logo = document.getElementById('brand-logo');
    let logoClickCount = 0;
    
    logo.addEventListener('click', () => {
        logoClickCount++;
        if (logoClickCount === 5) {
            showNotification("Don't Underestimate The Power Of SRT 🚀");
            logoClickCount = 0; // Reset
        }
    });

    // --- 8. Animated Counters (Intersection Observer) ---
    const counters = document.querySelectorAll('.counter');
    const statSection = document.querySelector('.stats-grid');
    let started = false;

    const counterObserver = new IntersectionObserver((entries) => {
        if(entries[0].isIntersecting && !started) {
            counters.forEach(counter => {
                const target = +counter.getAttribute('data-target');
                const increment = target / 50; 
                let current = 0;
                
                const updateCounter = () => {
                    current += increment;
                    if(current < target) {
                        counter.innerText = Math.ceil(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.innerText = target + (target > 90 ? '%' : '+');
                    }
                };
                updateCounter();
            });
            started = true;
        }
    }, { threshold: 0.5 });
    if(statSection) counterObserver.observe(statSection);

    // --- 9. Skills Progress Bar Reveal ---
    const skillBars = document.querySelectorAll('.progress');
    const skillsSection = document.querySelector('.skills-container');
    
    const skillObserver = new IntersectionObserver((entries) => {
        if(entries[0].isIntersecting) {
            skillBars.forEach(bar => {
                bar.style.width = bar.getAttribute('data-width');
            });
        }
    }, { threshold: 0.5 });
    if(skillsSection) skillObserver.observe(skillsSection);

    // --- 10. 3D Tilt Effect on Tech Cards (Vanilla JS Math) ---
    const tiltCards = document.querySelectorAll('.3d-effect');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10; 
            const rotateY = ((x - centerX) / centerX) * 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            card.style.transition = "transform 0.5s ease";
        });
        
        card.addEventListener('mouseenter', () => {
            card.style.transition = "none";
        });
    });

    // --- 11. Portfolio Filtering ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const searchInput = document.getElementById('portfolio-search');

    function filterPortfolio(filterValue, searchValue = "") {
        portfolioItems.forEach(item => {
            const category = item.getAttribute('data-category');
            const title = item.querySelector('h3').innerText.toLowerCase();
            const matchFilter = (filterValue === 'all' || filterValue === category);
            const matchSearch = title.includes(searchValue.toLowerCase());
            
            if (matchFilter && matchSearch) {
                item.style.display = 'block';
                setTimeout(() => item.style.opacity = '1', 50);
            } else {
                item.style.opacity = '0';
                setTimeout(() => item.style.display = 'none', 300);
            }
        });
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterPortfolio(btn.getAttribute('data-filter'), searchInput.value);
        });
    });

    searchInput.addEventListener('input', (e) => {
        const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
        filterPortfolio(activeFilter, e.target.value);
    });

    // --- 12. Form Validation Simulation ---
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button');
        const originalText = btn.innerText;
        
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        
        // Simulate network request
        setTimeout(() => {
            showNotification("Message sent successfully to XNEON HQ!");
            contactForm.reset();
            btn.innerText = originalText;
        }, 1500);
    });
});