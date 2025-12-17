// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// Smooth reveal animation
const observerOptions = { threshold: 0.1 };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
        }
    });
}, observerOptions);

document.querySelectorAll('.skill-card, .research-card, .pub-item, .project-card, .contact-item').forEach(el => {
    el.classList.add('reveal-element');
    observer.observe(el);
});

// --- 1. Typing Effect ---
const typingText = document.querySelector('.typing-text');
const words = ["Computer Vision", "Construction Robotics", "Digital Twins", "Deep Learning"];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 100;

function typeEffect() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
        typingText.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 50;
    } else {
        typingText.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 100;
    }

    if (!isDeleting && charIndex === currentWord.length) {
        isDeleting = true;
        typeSpeed = 2000; // Pause at end
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 500; // Pause before new word
    }

    setTimeout(typeEffect, typeSpeed);
}
if (typingText) typeEffect();


// --- 2. 3D Tilt Effect for Cards ---
document.querySelectorAll('.research-card, .project-card, .skill-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -5; // Max 5deg tilt
        const rotateY = ((x - centerX) / centerX) * 5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        card.style.borderColor = 'var(--primary)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        card.style.borderColor = 'transparent';
    });
});


// --- 3. Constellation Canvas Background ---
const canvas = document.getElementById('hero-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    // Resize canvas
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    // Particle class
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off edges
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(99, 102, 241, 0.5)'; // Primary color with opacity
            ctx.fill();
        }
    }

    // Init particles
    for (let i = 0; i < 80; i++) {
        particles.push(new Particle());
    }

    // Mouse interaction
    let mouse = { x: null, y: null };
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    // Animation Loop
    function animate() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach((p, index) => {
            p.update();
            p.draw();

            // Connect nearby particles
            for (let j = index; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(99, 102, 241, ${1 - distance / 150})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }

            // Connect to mouse
            if (mouse.x != null) {
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 200) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(16, 185, 129, ${1 - distance / 200})`; // Accent color
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }
        });

        requestAnimationFrame(animate);
    }
    animate();
}

// --- 4. Lightbox Gallery ---
const modal = document.getElementById('image-modal');
const modalImg = document.getElementById('modal-img');
const closeBtn = document.querySelector('.modal-close');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const dotsContainer = document.querySelector('.modal-dots');
let currentImages = [];
let currentImageIndex = 0;

function openModal(images, index = 0) {
    if (!images || images.length === 0) return;

    currentImages = images;
    currentImageIndex = index;
    modal.classList.add('show');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
    updateModalImage();
    updateDots();
}

function updateModalImage() {
    modalImg.src = `assets/publications/${currentImages[currentImageIndex]}`;
    // Show/Hide buttons based on index
    prevBtn.style.display = currentImages.length > 1 ? 'flex' : 'none';
    nextBtn.style.display = currentImages.length > 1 ? 'flex' : 'none';
}

function updateDots() {
    dotsContainer.innerHTML = '';
    if (currentImages.length <= 1) return;

    currentImages.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === currentImageIndex) dot.classList.add('active');
        dot.addEventListener('click', (e) => {
            e.stopPropagation();
            currentImageIndex = index;
            updateModalImage();
            updateDots();
        });
        dotsContainer.appendChild(dot);
    });
}

// Event Listeners for Cards
document.querySelectorAll('.pub-card').forEach(card => {
    const imagesAttr = card.getAttribute('data-images');
    if (imagesAttr) {
        const images = imagesAttr.split(',');

        // Add click listener to the visual part
        const visual = card.querySelector('.pub-visual');
        if (visual) {
            visual.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent card interactions
                // Determine which image to show? Default to 0
                openModal(images, 0);
            });
            visual.style.cursor = 'pointer';
        }
    }
});

// Modal Controls
if (modal) {
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    });

    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentImageIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length;
        updateModalImage();
        updateDots();
    });

    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentImageIndex = (currentImageIndex + 1) % currentImages.length;
        updateModalImage();
        updateDots();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('show')) return;

        if (e.key === 'Escape') {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        } else if (e.key === 'ArrowLeft') {
            currentImageIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length;
            updateModalImage();
            updateDots();
        } else if (e.key === 'ArrowRight') {
            currentImageIndex = (currentImageIndex + 1) % currentImages.length;
            updateModalImage();
            updateDots();
        }
    });
}

// --- 5. Profile Image Hover Effect ---
const profileImg = document.querySelector('.profile-img');
if (profileImg) {
    profileImg.addEventListener('mouseenter', () => {
        profileImg.style.opacity = '0';
        setTimeout(() => {
            profileImg.src = 'assets/profile/profile_informal.jpg';
            profileImg.style.opacity = '1';
        }, 300);
    });

    profileImg.addEventListener('mouseleave', () => {
        profileImg.style.opacity = '0';
        setTimeout(() => {
            profileImg.src = 'assets/profile/profile_formal_nobg.png';
            profileImg.style.opacity = '1';
        }, 300);
    });
}

