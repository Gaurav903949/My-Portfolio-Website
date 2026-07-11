// Wait for DOM content to load
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initMobileMenu();
    initScrollEffects();
    initContactForm();
});

/* =========================================================================
   1. Interactive Particle Network (Canvas)
   ========================================================================= */
function initParticles() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particle settings
    const particleCount = Math.min(60, Math.floor((width * height) / 25000));
    const connectionDistance = 120;
    const particles = [];
    const mouse = { x: null, y: null, radius: 180 };

    // Track mouse movement
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Handle resize
    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    // Particle Blueprint
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            // Slow, organic movement speeds
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.baseSize = Math.random() * 2.5 + 1.5;
            this.size = this.baseSize;
            // Mix of data-blue and biotech-green
            this.color = Math.random() > 0.5 ? 'rgba(14, 165, 233, 0.45)' : 'rgba(16, 185, 129, 0.45)';
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off screen boundaries
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            // Interact with cursor (hover effect)
            if (mouse.x !== null && mouse.y !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < mouse.radius) {
                    // Attract nodes slightly towards cursor
                    const force = (mouse.radius - dist) / mouse.radius;
                    this.x += (dx / dist) * force * 0.8;
                    this.y += (dy / dist) * force * 0.8;
                    this.size = this.baseSize * (1 + force * 0.6);
                } else {
                    this.size = this.baseSize;
                }
            } else {
                this.size = this.baseSize;
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    // Populate particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Animation Loop
    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            const p1 = particles[i];
            p1.update();
            p1.draw();

            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectionDistance) {
                    const alpha = (connectionDistance - dist) / connectionDistance * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    // Connection line color gradient
                    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }

            // Draw line to mouse
            if (mouse.x !== null && mouse.y !== null) {
                const dx = p1.x - mouse.x;
                const dy = p1.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    const alpha = (mouse.radius - dist) / mouse.radius * 0.1;
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `rgba(14, 165, 233, ${alpha})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    animate();
}

/* =========================================================================
   2. Mobile Menu Logic
   ========================================================================= */
function initMobileMenu() {
    const toggle = document.getElementById('mobile-toggle');
    const menu = document.querySelector('.nav-menu');
    const links = document.querySelectorAll('.nav-link');

    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
        menu.classList.toggle('open');
        toggle.classList.toggle('active');
        // Toggle hamburger icon animation states
        const spans = toggle.querySelectorAll('span');
        if (toggle.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Close menu when links are clicked
    links.forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('open');
            toggle.classList.remove('active');
            const spans = toggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });
}

/* =========================================================================
   3. Scroll Spy, Back-to-Top and Header Blur
   ========================================================================= */
function initScrollEffects() {
    const header = document.querySelector('.glass-header');
    const backToTop = document.getElementById('back-to-top');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY;

        // 1. Blur header on scroll
        if (scrollPos > 30) {
            header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5)';
            header.style.backgroundColor = 'rgba(10, 15, 29, 0.85)';
        } else {
            header.style.boxShadow = 'none';
            header.style.backgroundColor = 'rgba(10, 15, 29, 0.7)';
        }

        // 2. Show/Hide back to top button
        if (scrollPos > 500) {
            backToTop.style.opacity = '1';
            backToTop.style.pointerEvents = 'auto';
            backToTop.style.transform = 'translateY(0)';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.pointerEvents = 'none';
            backToTop.style.transform = 'translateY(15px)';
        }

        // 3. Scroll Spy (Highlight active nav link)
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 90;
            const sectionHeight = section.offsetHeight;
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (currentSectionId) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });

    // Scroll smoothly to top
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Scroll reveal animation for components
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                observer.unobserve(entry.target); // Reveal once
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Add class for selection and observe
    const elementsToReveal = document.querySelectorAll('.glass-card, .timeline-item, .section-header');
    elementsToReveal.forEach(el => {
        el.classList.add('reveal-item');
        revealObserver.observe(el);
    });
}

/* =========================================================================
   4. Contact Form Handler (Mock Submission)
   ========================================================================= */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const feedback = document.getElementById('form-feedback');

    if (!form || !feedback) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Retrieve field values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;

        // Basic verification
        if (!name || !email || !subject || !message) {
            showFeedback('Please fill out all fields.', 'error');
            return;
        }

        // Mock loader state
        const submitBtn = form.querySelector('.form-submit');
        const originalBtnHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = `<span>Sending...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;
        submitBtn.disabled = true;

        setTimeout(() => {
            // Restore button and notify success
            submitBtn.innerHTML = originalBtnHTML;
            submitBtn.disabled = false;
            
            showFeedback(`Thank you, ${name}! Your message has been sent successfully.`, 'success');
            form.reset();
        }, 1500);
    });

    function showFeedback(msg, type) {
        feedback.textContent = msg;
        feedback.className = `form-feedback ${type}`;
        
        // Auto dismiss errors after 5 seconds, leave success messages visible
        if (type === 'error') {
            setTimeout(() => {
                feedback.classList.remove('error');
                feedback.style.display = 'none';
            }, 5000);
        }
    }
}
