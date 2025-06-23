document.addEventListener('DOMContentLoaded', function() {

    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    // Header Animation
    const header = document.querySelector('header');
    gsap.fromTo(header,
        { yPercent: -100, opacity: 0, rotationX: -90 },
        {
            yPercent: 0,
            opacity: 1,
            rotationX: 0,
            duration: 1,
            ease: 'power2.out',
            delay: 0.5,
            scrollTrigger: {
                trigger: document.body,
                start: "top top",
                end: "+=200", // Animate based on initial scroll
                onEnter: () => gsap.to(header, { yPercent: 0, opacity: 1, rotationX: 0, duration: 0.5, ease: 'power1.out' }),
                onLeaveBack: () => gsap.to(header, { yPercent: -100, opacity: 0, rotationX: -90, duration: 0.5, ease: 'power1.in' }), // Hides when scrolling back to very top quickly
                onUpdate: self => {
                    // A more typical hide/show on scroll
                    if (self.direction === -1 && self.progress > 0) { // Scrolling up
                        gsap.to(header, { yPercent: 0, opacity: 1, rotationX: 0, duration: 0.4, ease: 'power1.out' });
                    } else if (self.direction === 1 && self.progress < 1 && self.scrollY > 100) { // Scrolling down past a certain point
                        gsap.to(header, { yPercent: -110, opacity: 0, rotationX: 30, duration: 0.4, ease: 'power1.in' });
                    }
                }
            }
        }
    );

    // Hero Section Animations
    const heroSection = document.querySelector('.hero-section');
    const heroContentH2 = document.querySelector('.hero-content h2');
    const heroContentP = document.querySelector('.hero-content p');
    const heroBgBlur = document.querySelector('.hero-background-blur');

    // Initial animation for hero content
    gsap.from(heroContentH2, {
        duration: 1.5,
        y: 50,
        opacity: 0,
        rotationX: -45,
        ease: 'expo.out',
        delay: 1 // Delay after header animation
    });
    gsap.from(heroContentP, {
        duration: 1.5,
        y: 30,
        opacity: 0,
        ease: 'expo.out',
        delay: 1.3 // Slightly later
    });

    // Parallax for hero elements on scroll
    gsap.to(heroContentH2, {
        yPercent: -50, // Moves up faster
        ease: "none",
        scrollTrigger: {
            trigger: heroSection,
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });
    gsap.to(heroContentP, {
        yPercent: -30,
        ease: "none",
        scrollTrigger: {
            trigger: heroSection,
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });
    gsap.to(heroBgBlur, { // The overlay, making it move slower than text creates depth
        yPercent: 20,
        scale: 1.1, // Slightly scale up the blur overlay for more depth
        opacity: 0.7, // Fade it a bit more as it moves
        ease: "none",
        scrollTrigger: {
            trigger: heroSection,
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });

    // Optional: Mouse move parallax for hero content (subtle)
    heroSection.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const x = (clientX / window.innerWidth - 0.5) * 2; // -1 to 1
        const y = (clientY / window.innerHeight - 0.5) * 2; // -1 to 1

        gsap.to(heroContentH2, {
            x: x * 20, // Max 20px displacement
            y: y * 15,
            rotationY: x * 2, // Max 2 deg rotation
            rotationX: -y * 2,
            duration: 0.5,
            ease: 'power1.out'
        });
        gsap.to(heroContentP, {
            x: x * 10,
            y: y * 8,
            duration: 0.6,
            ease: 'power1.out'
        });
    });

    // Section Transitions
    const sections = document.querySelectorAll('main > section:not(#hero)'); // Exclude hero, already animated

    sections.forEach((section, index) => {
        const sectionTitle = section.querySelector('h2');
        // Select general floating boxes OR items directly within horizontal scroll content
        const generalContent = section.querySelectorAll('.floating-box:not(.scroll-item)');
        const horizontalScrollItems = section.querySelectorAll('.horizontal-scroll-content > .scroll-item');

        // Initial states for section title
        if (sectionTitle) {
            gsap.set(sectionTitle, { opacity: 0, y: 50, rotationX: -30 });
        }
        // Initial states for general floating boxes
        gsap.set(generalContent, { opacity: 0, y: 40, rotationX: -20, scale: 0.95 });

        // Initial states for horizontal scroll items (will be animated differently)
        // These are handled by their own ScrollTrigger below if the section is horizontal

        ScrollTrigger.create({
            trigger: section,
            start: "top 70%", // When 70% of the section is visible from top
            end: "bottom 30%", // When 30% of the section is still visible from bottom
            // markers: true, // For debugging
            onEnter: () => {
                gsap.to(section, { autoAlpha: 1, duration: 0.3 }); // Make section visible
                if (sectionTitle) {
                    gsap.to(sectionTitle, {
                        opacity: 1,
                        y: 0,
                        rotationX: 0,
                        duration: 0.8,
                        ease: 'power3.out',
                        delay: 0.2
                    });
                }
                // Animate general floating boxes (non-scroll-items)
                gsap.to(generalContent, {
                    opacity: 1,
                    y: 0,
                    rotationX: 0,
                    scale: 1,
                    duration: 0.7,
                    ease: 'power3.out',
                    stagger: 0.15,
                    delay: sectionTitle ? 0.4 : 0.2
                });

                // If it's a horizontal scroll section, animate its items with a horizontal ScrollTrigger
                if (section.classList.contains('horizontal-scroll-section')) {
                    const scroller = section.querySelector('.horizontal-scroll-content');
                    // Set initial state for items within this specific horizontal scroll
                    gsap.set(horizontalScrollItems, { opacity: 0, rotationY: 50, xPercent: 25, scale: 0.9 });

                    horizontalScrollItems.forEach(item => {
                        gsap.to(item, {
                            opacity: 1,
                            rotationY: 0,
                            xPercent: 0,
                            scale: 1,
                            ease: 'power3.out',
                            duration: 0.8,
                            scrollTrigger: {
                                trigger: item,
                                scroller: scroller, // The scroller for these items is their parent
                                horizontal: true,
                                start: "left 85%", // When left of item hits 85% of scroller width
                                end: "right 15%",  // When right of item hits 15% of scroller width
                                // markers: {startColor: "purple", endColor: "purple"}, // for debugging item's ST
                                toggleActions: "play resume resume reverse", // Play on enter, reverse on leave
                                // scrub: 1 // Alternative: scrubby animation
                            }
                        });
                    });
                }
            },
            onLeave: () => { // Optional: Animate out when section fully leaves viewport
                // gsap.to(section, { autoAlpha: 0, yPercent: -10, duration: 0.4 });
            },
            onEnterBack: () => { // Optional: Animate back in when scrolling up
                 gsap.to(section, { autoAlpha: 1, duration: 0.3 });
                if (sectionTitle) {
                    gsap.to(sectionTitle, { opacity: 1, y: 0, rotationX: 0, duration: 0.8, ease: 'power3.out', delay: 0.2 });
                }
                // Also re-animate generalContent onEnterBack
                gsap.to(generalContent, { opacity: 1, y: 0, rotationX: 0, scale: 1, duration: 0.7, ease: 'power3.out', stagger: 0.15, delay: sectionTitle ? 0.4 : 0.2 });

                // Horizontal scroll items are mostly handled by their own toggleActions, but ensure visibility if section re-enters
                if (section.classList.contains('horizontal-scroll-section')) {
                    // Items' individual ScrollTriggers will handle their animation based on their position
                    // We just need to ensure they are not stuck in an initial hidden state if the section itself reappears.
                    // The `gsap.set` for horizontalScrollItems is inside the onEnter, so they'd re-initialize
                    // if the main section ST re-triggers onEnter.
                    // For onEnterBack, we might need to explicitly play them if they were reversed.
                    // However, `toggleActions` on items should handle this.
                }
            },
            onLeaveBack: () => { // Optional: Animate out when section leaves viewport scrolling up
                 // gsap.to(section, { autoAlpha: 0, yPercent: 10, duration: 0.4 });
            },
            toggleClass: {targets: section, className: "is-active"} // For potential CSS targeting
        });

        // Initially hide sections that will be animated by ScrollTrigger
        // Hero is already handled.
        if (section.id !== 'hero') {
             gsap.set(section, { autoAlpha: 0 }); // autoAlpha handles visibility and opacity
        }
    });

    // Smooth scrolling for navigation links (can be enhanced or replaced by GSAP ScrollToPlugin if complex scenarios arise)
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
    // const floatingBoxes = document.querySelectorAll('.floating-box, .scroll-item'); // Now handled by GSAP section transitions

    // const observerOptions = {
    //     root: null, // relative to document viewport
    //     rootMargin: '0px',
    //     threshold: 0.1 // 10% of item is visible
    // };

    // const observerCallback = (entries, observer) => {
    //     entries.forEach(entry => {
    //         if (entry.isIntersecting) {
    //             entry.target.style.opacity = '1';
    //             entry.target.style.transform = 'translateY(0)';
    //             // observer.unobserve(entry.target); // Optional: stop observing once animated
    //         } else {
    //             // Optional: Re-apply initial styles if element scrolls out of view and you want animation to repeat
    //             // entry.target.style.opacity = '0';
    //             // entry.target.style.transform = 'translateY(20px)';
    //         }
    //     });
    // };

    // const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);

    // floatingBoxes.forEach(box => {
        // Set initial styles for animation
        // box.style.opacity = '0';
        // box.style.transform = 'translateY(20px)';
        // box.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    //     scrollObserver.observe(box);
    // });

    // Parallax effect for hero background (subtle)
    // const heroSection = document.querySelector('.hero-section'); // Already defined above
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

    // Micro-animations and 3D Accents

    // CTA Button Hover Effect
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
        const originalBg = gsap.getProperty(button, "backgroundColor"); // Store original, though CSS hover also handles this
        const originalColor = gsap.getProperty(button, "color");

        button.addEventListener('mouseenter', () => {
            gsap.to(button, {
                duration: 0.3,
                scale: 1.05,
                z: 10, // Move slightly forward in 3D space
                rotationX: -5, // Tilt slightly
                rotationY: 2,
                ease: 'power1.out'
            });
        });
        button.addEventListener('mouseleave', () => {
            gsap.to(button, {
                duration: 0.3,
                scale: 1,
                z: 0,
                rotationX: 0,
                rotationY: 0,
                ease: 'power1.out'
            });
        });
    });

    // General Link Hover Effect (subtle)
    const generalLinks = document.querySelectorAll('a:not(.cta-button):not(header nav a)'); // Exclude CTAs and nav links for now
    generalLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            gsap.to(link, {
                duration: 0.2,
                y: -2,
                // color: "#B9A44C", // Muted Gold - or let CSS handle color
                textShadow: "0px 1px 3px rgba(185, 164, 76, 0.3)",
                ease: 'power1.out'
            });
        });
        link.addEventListener('mouseleave', () => {
            gsap.to(link, {
                duration: 0.2,
                y: 0,
                // color: "#6B8E8E", // Soft Teal - or let CSS handle color
                textShadow: "none",
                ease: 'power1.out'
            });
        });
    });

    // Scroll item hover effect (already has a CSS hover for box-shadow and transformY)
    // We can enhance it with GSAP for more 3D feel
    const scrollItems = document.querySelectorAll('.scroll-item');
    scrollItems.forEach(item => {
        // Clear existing CSS transition that might conflict with GSAP
        item.style.transition = 'none';

        const tl = gsap.timeline({ paused: true });
        tl.to(item, {
            duration: 0.4,
            z: 30,
            rotationY: -3,
            scale: 1.03,
            boxShadow: "0 20px 50px rgba(0,0,0,0.2)", // Enhance shadow
            ease: 'power2.out'
        });

        item.addEventListener('mouseenter', () => tl.play());
        item.addEventListener('mouseleave', () => tl.reverse());
    });


});
