document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.main-nav .nav-link');
    const header = document.getElementById('main-header');
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    const sections = document.querySelectorAll('main section[id]');
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const body = document.body;
    const heroSection = document.getElementById('home'); // Get the hero section

    // Adjust hero section padding top based on header height
    function adjustHeroPadding() {
        if (header && heroSection) {
            const headerHeight = header.offsetHeight;
            // Set padding for hero section (home)
            heroSection.style.paddingTop = `${headerHeight}px`;

            // If other sections directly follow and need offset, handle here or via CSS margin
            // For now, assuming only hero needs this dynamic padding.
            // Other sections will flow naturally after hero.
        }
    }
    
    adjustHeroPadding(); // Initial adjustment
    window.addEventListener('resize', adjustHeroPadding); // Adjust on window resize


    // Mobile menu toggle
    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', () => {
            const isExpanded = mainNav.classList.toggle('active');
            mobileMenuToggle.classList.toggle('open');
            mobileMenuToggle.setAttribute('aria-expanded', isExpanded);
            // Toggle body scroll
            if (isExpanded) {
                body.style.overflow = 'hidden'; // Prevent scrolling when mobile menu is open
            } else {
                body.style.overflow = '';
            }
        });
    }

    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                mobileMenuToggle.classList.remove('open');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                body.style.overflow = ''; // Restore scroll
            }
        });
    });
    
    // Header style change on scroll
    window.addEventListener('scroll', () => {
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

        if (header) { // Ensure header exists
            if (scrollPosition > 50) { // Threshold to change header style
                header.classList.add('scrolled');
                header.classList.remove('top-of-page');
            } else {
                header.classList.remove('scrolled');
                header.classList.add('top-of-page');
            }
            // Adjust hero padding on scroll IF header height changes significantly
            // This is important if the CSS transitions header height
            adjustHeroPadding();

            // Switch logo image based on scroll position
            const logoImg = header.querySelector('.logo-img');
            if (logoImg) {
                if (scrollPosition > 50) {
                    logoImg.src = 'aboh-logo-inverted.png';
                } else {
                    logoImg.src = 'aboh-logo.png';
                }
            }
        }


        // Active nav link highlighting on scroll
        let currentSection = '';
        const headerCurrentHeight = header ? header.offsetHeight : 0; // Use dynamic offsetHeight
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerCurrentHeight - 50; // Adjust offset as needed
            if (scrollPosition >= sectionTop) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === currentSection) {
                link.classList.add('active');
            }
        });
        
        // Scroll to top button visibility
        if (scrollTopBtn) {
            if (scrollPosition > 100) {
                scrollTopBtn.style.display = "block";
            } else {
                scrollTopBtn.style.display = "none";
            }
        }
    });

    // Scroll to top button functionality
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Contact Form Submission (Placeholder)
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            formStatus.textContent = 'Sending message...';
            // Simulate form submission
            setTimeout(() => {
                formStatus.textContent = 'Message sent successfully! We will get back to you soon.';
                formStatus.style.color = 'green';
                contactForm.reset();
                setTimeout(() => {
                    formStatus.textContent = '';
                }, 5000);
            }, 1500);
        });
    }
    
    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            // Ensure target element exists and it's not just "#"
            if (href.length > 1 && document.querySelector(href)) { 
                e.preventDefault();
                const targetElement = document.querySelector(href);
                // Recalculate header offset dynamically for smooth scroll
                const headerCurrentOffset = document.getElementById('main-header') ? document.getElementById('main-header').offsetHeight : 0;
                
                let elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                
                // Special handling for #home, scroll to very top
                if (href === '#home') {
                    elementPosition = 0;
                }

                const offsetPosition = elementPosition - headerCurrentOffset;
    
                window.scrollTo({
                    top: (href === '#home' ? 0 : offsetPosition), // Go to 0 for #home, else calculated offset
                    behavior: "smooth"
                });

                // Close mobile menu if open and link is in nav
                if (mainNav.classList.contains('active') && this.closest('.main-nav')) {
                    mainNav.classList.remove('active');
                    mobileMenuToggle.classList.remove('open');
                    mobileMenuToggle.setAttribute('aria-expanded', 'false');
                    body.style.overflow = ''; // Restore scroll
                }
            }
        });
    });

    // Intersection Observer for scroll animations
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries, observerInstance) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observerInstance.unobserve(entry.target); // Stop observing after animation
                }
            });
        }, {
            threshold: 0.1 // Trigger when 10% of the element is visible
            // rootMargin: "-50px 0px -50px 0px" // Example: Adjust trigger area
        });

        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }

});