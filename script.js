// Navigation visibility - show only when scrolling to projects section
function checkNavigationVisibility() {
    const navbar = document.querySelector('.navbar');
    const projectsSection = document.querySelector('#projects');
    
    if (projectsSection && navbar) {
        const projectsTop = projectsSection.offsetTop;
        const scrollPosition = window.pageYOffset + window.innerHeight / 2;
        
        // Show navigation when we reach projects section
        if (scrollPosition >= projectsTop) {
            navbar.classList.add('visible');
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('visible');
            navbar.classList.remove('scrolled');
        }
    }
}

// Check on scroll
window.addEventListener('scroll', checkNavigationVisibility);

// Check on page load
window.addEventListener('load', checkNavigationVisibility);

// Check on resize
window.addEventListener('resize', checkNavigationVisibility);

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Project tabs functionality
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetTab = button.getAttribute('data-tab');
        
        // Remove active class from all buttons and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked button and corresponding content
        button.classList.add('active');
        document.getElementById(targetTab).classList.add('active');
        
        // Reset carousel when switching tabs
        resetAllCarousels();
    });
});

// Video Carousel Functionality
function initCarousel(container) {
    const track = container.querySelector('.videos-track');
    const cards = container.querySelectorAll('.video-card');
    const prevBtn = container.querySelector('.carousel-prev');
    const nextBtn = container.querySelector('.carousel-next');
    const dotsContainer = container.querySelector('.carousel-dots');
    
    if (!track || cards.length === 0) return;
    
    let currentIndex = 0;
    const totalCards = cards.length;
    
    // Calculate how many cards to show based on screen size
    function getCardsPerView() {
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 968) return 2;
        return 2;
    }
    
    let cardsPerView = getCardsPerView();
    const totalSlides = Math.ceil(totalCards / cardsPerView);
    
    // Create dots
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot';
        if (i === 0) dot.classList.add('active');
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }
    
    function updateCarousel() {
        if (cards.length === 0) return;
        
        const cardWidth = cards[0].offsetWidth + 32; // 32px for gap
        const translateX = -currentIndex * cardWidth * cardsPerView;
        track.style.transform = `translateX(${translateX}px)`;
        
        // Update dots
        const dots = dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
        
        // Update button states
        if (prevBtn) {
            prevBtn.classList.toggle('disabled', currentIndex === 0);
        }
        if (nextBtn) {
            nextBtn.classList.toggle('disabled', currentIndex >= totalSlides - 1);
        }
        
        // Hide navigation if all cards fit in one view
        if (totalSlides <= 1) {
            if (prevBtn) prevBtn.style.display = 'none';
            if (nextBtn) nextBtn.style.display = 'none';
            if (dotsContainer) dotsContainer.style.display = 'none';
        } else {
            if (prevBtn) prevBtn.style.display = 'flex';
            if (nextBtn) nextBtn.style.display = 'flex';
            if (dotsContainer) dotsContainer.style.display = 'flex';
        }
    }
    
    function goToSlide(index) {
        currentIndex = Math.max(0, Math.min(index, totalSlides - 1));
        updateCarousel();
    }
    
    function nextSlide() {
        if (currentIndex < totalSlides - 1) {
            currentIndex++;
            updateCarousel();
        }
    }
    
    function prevSlide() {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    }
    
    // Event listeners
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const newCardsPerView = getCardsPerView();
            if (newCardsPerView !== cardsPerView) {
                cardsPerView = newCardsPerView;
                const newTotalSlides = Math.ceil(totalCards / cardsPerView);
                currentIndex = Math.min(currentIndex, newTotalSlides - 1);
                
                // Recreate dots
                dotsContainer.innerHTML = '';
                for (let i = 0; i < newTotalSlides; i++) {
                    const dot = document.createElement('button');
                    dot.className = 'carousel-dot';
                    if (i === currentIndex) dot.classList.add('active');
                    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
                    dot.addEventListener('click', () => goToSlide(i));
                    dotsContainer.appendChild(dot);
                }
                
                updateCarousel();
            }
        }, 250);
    });
    
    // Initialize
    updateCarousel();
    
    // Touch/swipe support for mobile
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    
    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
    });
    
    track.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        currentX = e.touches[0].clientX;
    });
    
    track.addEventListener('touchend', () => {
        if (!isDragging) return;
        isDragging = false;
        
        const diffX = startX - currentX;
        if (Math.abs(diffX) > 50) {
            if (diffX > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    });
}

// Initialize all carousels
function initAllCarousels() {
    const carouselContainers = document.querySelectorAll('.video-carousel-container');
    carouselContainers.forEach(container => {
        initCarousel(container);
    });
}

// Reset all carousels to first slide
function resetAllCarousels() {
    const carouselContainers = document.querySelectorAll('.video-carousel-container');
    carouselContainers.forEach(container => {
        const track = container.querySelector('.videos-track');
        if (track) {
            track.style.transform = 'translateX(0)';
        }
        const dots = container.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === 0);
        });
        const prevBtn = container.querySelector('.carousel-prev');
        const nextBtn = container.querySelector('.carousel-next');
        if (prevBtn) prevBtn.classList.add('disabled');
        if (nextBtn) nextBtn.classList.remove('disabled');
    });
}

// Initialize carousels when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initAllCarousels();
});

// Intersection Observer for fade-in animations - optimized
const observerOptions = {
    threshold: 0.05,
    rootMargin: '50px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Use requestAnimationFrame for smoother animation
            requestAnimationFrame(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            });
            // Stop observing once animated for better performance
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation - optimized to only animate off-screen elements
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.video-card, .certificate-card, .exp-item, .timeline-item, .contact-item');
    const viewportHeight = window.innerHeight;
    
    animateElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        // Only animate elements that are not immediately visible
        if (rect.top > viewportHeight) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            observer.observe(el);
        } else {
            // Elements already visible should be shown immediately
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }
    });
});

// Timeline click navigation to experience details - optimized for performance
document.addEventListener('DOMContentLoaded', () => {
    const timelineItems = document.querySelectorAll('.exp-timeline-item');
    
    if (timelineItems.length === 0) return;
    
    // Pre-cache experience elements for faster access
    const experienceCache = new Map();
    timelineItems.forEach(timelineItem => {
        const expId = timelineItem.getAttribute('data-exp-id');
        if (expId) {
            const targetExp = document.getElementById(expId);
            if (targetExp) {
                experienceCache.set(expId, targetExp);
            } else {
                console.warn(`Experience detail not found for ID: ${expId}`);
            }
        }
    });
    
    // Optimized click handler with improved scrolling
    const handleTimelineClick = (expId, event) => {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        
        const targetExp = experienceCache.get(expId);
        if (!targetExp) {
            console.warn(`Experience detail not found in cache for ID: ${expId}`);
            return;
        }
        
        // Calculate offset to account for fixed navbar
        const navbar = document.querySelector('.navbar');
        const navbarHeight = navbar ? navbar.offsetHeight : 80;
        const offsetTop = targetExp.offsetTop - navbarHeight - 20; // Extra 20px padding
        
        // Smooth scroll to the experience detail
        window.scrollTo({
            top: Math.max(0, offsetTop),
            behavior: 'smooth'
        });
        
        // Small delay to ensure scroll starts, then highlight
        setTimeout(() => {
            // Highlight the target experience card
            targetExp.classList.add('highlight');
            
            // Focus the element for accessibility
            targetExp.setAttribute('tabindex', '-1');
            targetExp.focus();
            
            // Remove highlight after animation
            setTimeout(() => {
                targetExp.classList.remove('highlight');
                targetExp.removeAttribute('tabindex');
            }, 1500);
        }, 100);
    };
    
    // Add event listeners efficiently
    timelineItems.forEach(timelineItem => {
        const expId = timelineItem.getAttribute('data-exp-id');
        if (!expId) return;
        
        // Make the entire timeline item clickable
        timelineItem.style.cursor = 'pointer';
        
        // Click event - use capture phase for better reliability
        timelineItem.addEventListener('click', (e) => {
            handleTimelineClick(expId, e);
        }, { passive: false });
        
        // Also make the content clickable
        const content = timelineItem.querySelector('.exp-timeline-content');
        if (content) {
            content.addEventListener('click', (e) => {
                e.stopPropagation();
                handleTimelineClick(expId, e);
            }, { passive: false });
        }
        
        // Keyboard support (Enter and Space)
        timelineItem.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                handleTimelineClick(expId, e);
            }
        });
    });
    
    // Optional: Lightweight scroll animation for timeline items
    if (window.IntersectionObserver) {
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    timelineObserver.unobserve(entry.target); // Stop observing once animated
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });
        
        // Only observe items that aren't immediately visible
        timelineItems.forEach(item => {
            const rect = item.getBoundingClientRect();
            if (rect.top > window.innerHeight) {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                timelineObserver.observe(item);
            }
        });
    }
});

// Email button functionality
document.querySelectorAll('.email-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const email = 'your.email@example.com'; // Replace with your email
        window.location.href = `mailto:${email}?subject=Portfolio Contact`;
    });
});

// Remove parallax effect to prevent overlay issues
// Parallax effect removed to fix overlay problem

// Skill tags animation on hover
document.querySelectorAll('.skill-tag').forEach(tag => {
    tag.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px) scale(1.05)';
    });
    
    tag.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Video card hover effect enhancement
document.querySelectorAll('.video-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Add loading animation for images
document.querySelectorAll('img').forEach(img => {
    // If image is already loaded (from cache)
    if (img.complete) {
        img.style.opacity = '1';
    } else {
        img.style.opacity = '0';
        img.addEventListener('load', () => {
            img.style.opacity = '1';
        });
    }

    img.style.transition = 'opacity 0.5s ease';
});
// Active section highlighting in navigation
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// Add ripple effect to buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add CSS for ripple effect dynamically
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .nav-link.active {
        color: var(--primary-color);
    }
    
    .nav-link.active::after {
        width: 100%;
    }
`;
document.head.appendChild(style);
