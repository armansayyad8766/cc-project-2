// DOM Elements
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const storyForm = document.querySelector('.story-form');
const successMessage = document.querySelector('.success-message');
const storiesSlider = document.querySelector('.stories-slider');
const prevButton = document.querySelector('.slider-button.prev');
const nextButton = document.querySelector('.slider-button.next');
const storiesGrid = document.querySelector('.stories-grid');
const copyButton = document.querySelector('.copy-button');
const shareInput = document.querySelector('.share-link input');

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            if (mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
            }
        }
    });
});

// Mobile menu toggle
mobileMenuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
});

// Form submission handling
if (storyForm) {
    storyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(storyForm);
        const data = Object.fromEntries(formData);
        
        // Validate form
        if (validateForm(data)) {
            // Show loading state
            const submitButton = storyForm.querySelector('.submit-button');
            submitButton.disabled = true;
            submitButton.textContent = 'Submitting...';
            
            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                // Hide form and show success message
                storyForm.style.display = 'none';
                successMessage.style.display = 'block';
                
                // Reset form
                storyForm.reset();
                submitButton.disabled = false;
                submitButton.textContent = 'Share Your Story';
            }, 1500);
        }
    });
}

// Form validation
function validateForm(data) {
    let isValid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Validate name
    if (!data.name || data.name.trim().length < 2) {
        showError('name', 'Please enter a valid name');
        isValid = false;
    }
    
    // Validate email
    if (!data.email || !emailRegex.test(data.email)) {
        showError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate story type
    if (!data['story-type']) {
        showError('story-type', 'Please select a story type');
        isValid = false;
    }
    
    // Validate message
    if (!data.message || data.message.trim().length < 10) {
        showError('message', 'Please enter a message (minimum 10 characters)');
        isValid = false;
    }
    
    return isValid;
}

// Show error message
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const formGroup = field.closest('.form-group');
    
    // Remove existing error message
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error message
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.textContent = message;
    formGroup.appendChild(errorMessage);
    
    // Add error class to input
    field.classList.add('error');
    
    // Remove error class after input
    field.addEventListener('input', () => {
        field.classList.remove('error');
        errorMessage.remove();
    });
}

// Copy link functionality
if (copyButton && shareInput) {
    copyButton.addEventListener('click', () => {
        shareInput.select();
        document.execCommand('copy');
        
        // Show copied feedback
        const originalText = copyButton.innerHTML;
        copyButton.innerHTML = '<i class="fas fa-check"></i> Copied!';
        
        setTimeout(() => {
            copyButton.innerHTML = originalText;
        }, 2000);
    });
}

// Stories slider functionality
if (storiesSlider) {
    let currentSlide = 0;
    const slides = document.querySelectorAll('.story-card');
    const slideWidth = slides[0].offsetWidth;
    
    // Update slider position
    function updateSlider() {
        storiesGrid.style.transform = translateX(-${currentSlide * slideWidth}px);
    }
    
    // Next button click
    nextButton.addEventListener('click', () => {
        if (currentSlide < slides.length - 1) {
            currentSlide++;
            updateSlider();
        }
    });
    
    // Previous button click
    prevButton.addEventListener('click', () => {
        if (currentSlide > 0) {
            currentSlide--;
            updateSlider();
        }
    });
    
    // Touch swipe functionality
    let touchStartX = 0;
    let touchEndX = 0;
    
    storiesGrid.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    storiesGrid.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeDistance = touchEndX - touchStartX;
        if (swipeDistance > 50 && currentSlide > 0) {
            currentSlide--;
            updateSlider();
        } else if (swipeDistance < -50 && currentSlide < slides.length - 1) {
            currentSlide++;
            updateSlider();
        }
    }
}

// Intersection Observer for fade-in animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements with fade-in class
document.querySelectorAll('.fade-in-element').forEach(element => {
    observer.observe(element);
});

// Hero video autoplay
const heroVideo = document.querySelector('.hero-video video');
if (heroVideo) {
    heroVideo.play().catch(error => {
        console.log('Autoplay prevented:', error);
    });
}

// Stat cards counter animation
const statNumbers = document.querySelectorAll('.stat-number');
if (statNumbers.length > 0) {
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const number = entry.target;
                const value = parseInt(number.textContent);
                animateValue(number, 0, value, 2000);
                statObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(number => {
        statObserver.observe(number);
    });
}

// Animate value function
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.textContent = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Card hover effects
const cards = document.querySelectorAll('.story-card, .resource-card, .action-card');
cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-5px)';
        card.style.boxShadow = 'var(--shadow-lg)';
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = 'var(--shadow-md)';
    });
});