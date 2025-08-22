// Global Variables
let currentStep = 1;
const totalSteps = 3;

// Navigation Functions
function navigateTo(page) {
    window.location.href = page;
}

function selectRole(role) {
    // Store role in localStorage for future use
    localStorage.setItem('selectedRole', role);
    
    // Add selection animation
    const selectedCard = event.currentTarget;
    selectedCard.style.transform = 'scale(1.05)';
    selectedCard.style.borderColor = '#2563eb';
    
    // Navigate to dashboard after short delay
    setTimeout(() => {
        if (role === 'student') {
            navigateTo('dashboard.html');
        } else {
            // For now, all roles go to dashboard
            // In a real app, you'd have different dashboards
            navigateTo('dashboard.html');
        }
    }, 300);
}

// Dashboard Navigation
function switchSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.dashboard-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    const activeLink = document.querySelector(`[data-section="${sectionName}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// Multi-step Form Functions
function nextStep() {
    if (validateCurrentStep()) {
        if (currentStep < totalSteps) {
            // Hide current step
            document.querySelector(`[data-step="${currentStep}"]`).classList.remove('active');
            document.querySelector(`.progress-step[data-step="${currentStep}"]`).classList.remove('active');
            
            // Show next step
            currentStep++;
            document.querySelector(`[data-step="${currentStep}"]`).classList.add('active');
            document.querySelector(`.progress-step[data-step="${currentStep}"]`).classList.add('active');
            
            // Update navigation buttons
            updateFormNavigation();
        }
    }
}

function previousStep() {
    if (currentStep > 1) {
        // Hide current step
        document.querySelector(`[data-step="${currentStep}"]`).classList.remove('active');
        document.querySelector(`.progress-step[data-step="${currentStep}"]`).classList.remove('active');
        
        // Show previous step
        currentStep--;
        document.querySelector(`[data-step="${currentStep}"]`).classList.add('active');
        document.querySelector(`.progress-step[data-step="${currentStep}"]`).classList.add('active');
        
        // Update navigation buttons
        updateFormNavigation();
    }
}

function validateCurrentStep() {
    const currentStepElement = document.querySelector(`[data-step="${currentStep}"]`);
    const requiredFields = currentStepElement.querySelectorAll('[required]');
    
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = '#ef4444';
            field.addEventListener('input', () => {
                field.style.borderColor = '#d1d5db';
            });
            isValid = false;
        }
    });
    
    if (!isValid) {
        showNotification('Please fill in all required fields', 'error');
    }
    
    return isValid;
}

function updateFormNavigation() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    if (currentStep === 1) {
        prevBtn.style.display = 'none';
    } else {
        prevBtn.style.display = 'inline-block';
    }
    
    if (currentStep === totalSteps) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'inline-block';
    } else {
        nextBtn.style.display = 'inline-block';
        submitBtn.style.display = 'none';
    }
}

// Modal Functions
function openAskQuestion() {
    const modal = document.getElementById('askQuestionModal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeAskQuestion() {
    const modal = document.getElementById('askQuestionModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Notification System
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" style="background: none; border: none; color: inherit; font-size: 18px; cursor: pointer; margin-left: 10px;">&times;</button>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 2000;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;
    
    // Set background color based on type
    switch (type) {
        case 'success':
            notification.style.backgroundColor = '#10b981';
            break;
        case 'error':
            notification.style.backgroundColor = '#ef4444';
            break;
        case 'warning':
            notification.style.backgroundColor = '#f59e0b';
            break;
        default:
            notification.style.backgroundColor = '#2563eb';
    }
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Search and Filter Functions
function filterExperiences() {
    const searchTerm = document.querySelector('.search-input').value.toLowerCase();
    const jobTypeFilter = document.querySelector('.filter-select').value;
    const yearFilter = document.querySelectorAll('.filter-select')[1].value;
    
    const experienceCards = document.querySelectorAll('.experience-card');
    
    experienceCards.forEach(card => {
        const company = card.querySelector('h3').textContent.toLowerCase();
        const role = card.querySelector('.role').textContent.toLowerCase();
        const details = card.querySelector('.details').textContent;
        
        let shouldShow = true;
        
        // Search filter
        if (searchTerm && !company.includes(searchTerm) && !role.includes(searchTerm)) {
            shouldShow = false;
        }
        
        // Job type filter
        if (jobTypeFilter && jobTypeFilter !== 'All Job Types' && !details.includes(jobTypeFilter)) {
            shouldShow = false;
        }
        
        // Year filter
        if (yearFilter && yearFilter !== 'All Years' && !details.includes(yearFilter)) {
            shouldShow = false;
        }
        
        card.style.display = shouldShow ? 'block' : 'none';
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initialize form navigation
    if (document.getElementById('experienceForm')) {
        updateFormNavigation();
    }
    
    // Dashboard navigation
    const navLinks = document.querySelectorAll('.nav-link[data-section]');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.getAttribute('data-section');
            switchSection(section);
        });
    });
    
    // Form submission
    const experienceForm = document.getElementById('experienceForm');
    if (experienceForm) {
        experienceForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Simulate form submission
            showNotification('Experience shared successfully! You earned 100 points.', 'success');
            
            setTimeout(() => {
                navigateTo('dashboard.html');
            }, 2000);
        });
    }
    
    // Q&A form submission
    const questionForm = document.querySelector('.question-form');
    if (questionForm) {
        questionForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showNotification('Question posted successfully!', 'success');
            closeAskQuestion();
        });
    }
    
    // Search and filter listeners
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', filterExperiences);
    }
    
    const filterSelects = document.querySelectorAll('.filter-select');
    filterSelects.forEach(select => {
        select.addEventListener('change', filterExperiences);
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('askQuestionModal');
        if (modal && e.target === modal) {
            closeAskQuestion();
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add hover effects to cards
    const cards = document.querySelectorAll('.feature-card, .role-card, .dashboard-card, .experience-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Lazy loading for better performance
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observe all cards for animation
    document.querySelectorAll('.feature-card, .role-card, .dashboard-card').forEach(card => {
        observer.observe(card);
    });
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    .fade-in {
        animation: fadeInUp 0.6s ease forwards;
    }
`;
document.head.appendChild(style);

// Performance optimizations
// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to search
if (document.querySelector('.search-input')) {
    const searchInput = document.querySelector('.search-input');
    const debouncedFilter = debounce(filterExperiences, 300);
    searchInput.addEventListener('input', debouncedFilter);
}