document.addEventListener('DOMContentLoaded', function() {

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('header nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = document.querySelector('header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Update current year in footer
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Horizontal scroll with mouse wheel for designated sections
    const horizontalScrollSections = document.querySelectorAll('.horizontal-scroll-content');
    horizontalScrollSections.forEach(section => {
        section.addEventListener('wheel', function(event) {
            if (event.deltaY !== 0) { // Check if vertical scroll is intended
                // Prevent default vertical scroll only if horizontal scroll is possible
                if (this.scrollWidth > this.clientWidth) {
                    event.preventDefault();
                    this.scrollLeft += event.deltaY * 0.5 + event.deltaX * 0.5; // Adjust multiplier for sensitivity
                }
            }
        });
    });

    // Simple fade-in animation for floating boxes on scroll
    const floatingBoxes = document.querySelectorAll('.floating-box, .scroll-item');

    const observerOptions = {
        root: null, // relative to document viewport
        rootMargin: '0px',
        threshold: 0.1 // 10% of item is visible
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                // observer.unobserve(entry.target); // Optional: stop observing once animated
            } else {
                // Optional: Re-apply initial styles if element scrolls out of view and you want animation to repeat
                // entry.target.style.opacity = '0';
                // entry.target.style.transform = 'translateY(20px)';
            }
        });
    };

    const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);

    floatingBoxes.forEach(box => {
        // Set initial styles for animation
        box.style.opacity = '0';
        box.style.transform = 'translateY(20px)';
        box.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        scrollObserver.observe(box);
    });

    // Parallax effect for hero background (subtle)
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        window.addEventListener('scroll', function() {
            const scrollPosition = window.pageYOffset;
            // Apply parallax to the background image if it's set via CSS background-image
            // If using an <img> tag for hero, target that instead.
            // This example assumes CSS background.
            if (heroSection.style.backgroundImage) {
                 heroSection.style.backgroundPositionY = scrollPosition * 0.3 + 'px';
            } else {
                // Fallback or alternative for elements like .hero-background-blur if needed
                const heroBgBlur = document.querySelector('.hero-background-blur');
                if (heroBgBlur) {
                    // heroBgBlur.style.transform = `translateY(${scrollPosition * 0.2}px)`;
                    // Be careful with transform on pseudo-elements or elements with backdrop-filter,
                    // as it can create new stacking contexts affecting blur.
                    // For now, the CSS blur on overlay should suffice.
                }
            }
        });
    }

});
