// Blog Platform JavaScript
class BlogPlatform {
    constructor() {
        this.blogData = null;
        this.comments = [];
        this.isLoading = false;        
        this.init();
    }

    async init() {
        this.setupEventListeners();
        this.setupTheme();
        this.loadBlogContent();
        this.setupScrollAnimations();
        this.setupIntersectionObserver();
    }

    setupEventListeners() {

        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // Copy code blocks
        this.setupCodeCopyButtons();
    }

    async loadBlogContent() {
        try {
            this.isLoading = true;
            this.showLoadingSpinner();
            
            // Simulate API call
            const response = await fetch('blog-data.json');
            if (!response.ok) throw new Error('Failed to load blog data');
            
            this.blogData = await response.json();
            this.renderBlogContent();
            this.hideLoadingSpinner();
        } catch (error) {
            console.error('Error loading blog content:', error);
            this.renderFallbackContent();
            this.hideLoadingSpinner();
        }
    }

    renderBlogContent() {
        const contentContainer = document.getElementById('blogContent');
        if (!contentContainer || !this.blogData) return;

        let htmlContent = '';
        
        this.blogData.sections.forEach(section => {
            switch (section.type) {
                case 'heading':
                    htmlContent += `<h${section.level}>${section.content}</h${section.level}>`;
                    break;
                case 'paragraph':
                    htmlContent += `<p>${section.content}</p>`;
                    break;
                case 'list':
                    const listTag = section.ordered ? 'ol' : 'ul';
                    htmlContent += `<${listTag}>`;
                    section.items.forEach(item => {
                        htmlContent += `<li>${item}</li>`;
                    });
                    htmlContent += `</${listTag}>`;
                    break;
                case 'code':
                    htmlContent += `
                        <div class="code-block">
                            <div class="code-header">
                                <span class="code-language">${section.language || 'text'}</span>
                                <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                            </div>
                            <pre><code>${this.escapeHtml(section.content)}</code></pre>
                        </div>
                    `;
                    break;
                case 'quote':
                    htmlContent += `<blockquote>${section.content}</blockquote>`;
                    break;
                case 'info-box':
                    htmlContent += `
                        <div class="info-box">
                            <h4>💡 ${section.title}</h4>
                            <p>${section.content}</p>
                        </div>
                    `;
                    break;
                case 'example':
                    htmlContent += `
                        <div class="example-box">
                            <h4>🎯 ${section.title}</h4>
                            <p>${section.content}</p>
                        </div>
                    `;
                    break;
            }
        });

        contentContainer.innerHTML = htmlContent;
        this.addFadeInAnimation();
    }

    addFadeInAnimation() {
        const elements = document.querySelectorAll('.article-content h2, .article-content h3, .article-content p, .article-content ul, .article-content .info-box, .article-content .example-box');
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
            element.style.transitionDelay = `${index * 0.1}s`;
            
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 200);
        });
        
        // Add enhanced hover effects to interactive elements
        this.setupEnhancedInteractions();
    }
    
    setupEnhancedInteractions() {
        // Enhanced card hover effects
        const cards = document.querySelectorAll('.author-card, .next-blog-card, .newsletter-card, .info-box, .example-box');
        cards.forEach(card => {
            card.classList.add('interactive-card');
            
            card.addEventListener('mouseenter', (e) => {
                e.target.style.transform = 'translateY(-6px) scale(1.02)';
                e.target.style.boxShadow = 'var(--shadow-glow)';
            });
            
            card.addEventListener('mouseleave', (e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = 'var(--shadow-medium)';
            });
        });
        
        // Enhanced button interactions
        const buttons = document.querySelectorAll('.share-btn, .cta-button, .submit-btn, .newsletter-form button');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', (e) => {
                e.target.style.transform = 'translateY(-3px) scale(1.05)';
            });
            
            button.addEventListener('mouseleave', (e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
            });
            
            button.addEventListener('mousedown', (e) => {
                e.target.style.transform = 'translateY(-1px) scale(1.02)';
            });
            
            button.addEventListener('mouseup', (e) => {
                e.target.style.transform = 'translateY(-3px) scale(1.05)';
            });
        });
        
        // Enhanced form interactions
        const inputs = document.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', (e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
            });
            
            input.addEventListener('blur', (e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
            });
        });
    }

    setupCodeCopyButtons() {
        // Add copy functionality to code blocks
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('copy-btn')) {
                this.copyCode(e.target);
            }
        });
        
        // Enhanced code block styling
        this.enhanceCodeBlocks();
    }
    
    enhanceCodeBlocks() {
        const codeBlocks = document.querySelectorAll('pre code');
        codeBlocks.forEach(block => {
            const pre = block.parentElement;
            const wrapper = document.createElement('div');
            wrapper.className = 'code-block';
            
            const header = document.createElement('div');
            header.className = 'code-header';
            header.innerHTML = `
                <span class="code-language">Code</span>
                <button class="copy-btn">📋 Copy</button>
            `;
            
            pre.parentNode.insertBefore(wrapper, pre);
            wrapper.appendChild(header);
            wrapper.appendChild(pre);
        });
    }

    copyCode(button) {
        const codeBlock = button.closest('.code-block');
        const code = codeBlock.querySelector('code');
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(code.textContent)
                .then(() => {
                    const originalText = button.innerHTML;
                    button.innerHTML = '✅ Copied!';
                    button.style.background = 'rgba(16, 185, 129, 0.3)';
                    setTimeout(() => {
                        button.innerHTML = originalText;
                        button.style.background = 'rgba(255, 255, 255, 0.2)';
                    }, 2500);
                })
                .catch(() => {
                    this.fallbackCopyText(code.textContent);
                });
        } else {
            this.fallbackCopyText(code.textContent);
        }
    }

    fallbackCopyText(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        this.showToast('Code copied to clipboard!', 'success');
    }

    setupScrollAnimations() {
        // Enhanced scroll-based animations with Intersection Observer
        const animateElements = document.querySelectorAll('.author-card, .next-blog-card, .newsletter-card, .article, .info-box, .example-box');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('scroll-reveal');
                    entry.target.classList.add('revealed');
                    
                    // Add staggered animation for child elements
                    const children = entry.target.querySelectorAll('h2, h3, p, ul, .info-box, .example-box');
                    children.forEach((child, index) => {
                        child.style.setProperty('--stagger-index', index);
                        child.classList.add('stagger-animation');
                        child.style.animationDelay = `${index * 0.1}s`;
                        child.style.animation = 'fadeInUp 0.6s ease-out forwards';
                    });
                }
            });
        }, { 
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animateElements.forEach(element => {
            element.classList.add('scroll-reveal');
            observer.observe(element);
        });
        
        // Enhanced parallax effect for background
        this.setupParallaxEffect();
    }
    
    setupParallaxEffect() {
        let ticking = false;
        
        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.hero-image img');
            
            parallaxElements.forEach(element => {
                const speed = 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
            
            ticking = false;
        };
        
        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', requestTick);
    }

    setupIntersectionObserver() {
        // Enhanced reading progress indicator
        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress';
        document.body.appendChild(progressBar);

        // Throttled scroll handler for better performance
        let ticking = false;
        
        const updateProgress = () => {
            const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            progressBar.style.width = Math.min(Math.max(scrolled, 0), 100) + '%';
            
            // Add glow effect when near completion
            if (scrolled > 90) {
                progressBar.style.boxShadow = '0 0 20px var(--primary-color)';
            } else {
                progressBar.style.boxShadow = '0 0 10px rgba(59, 130, 246, 0.5)';
            }
            
            ticking = false;
        };
        
        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateProgress);
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', requestTick);
        
        // Enhanced section highlighting in navigation
        this.setupSectionHighlighting();
    }
    
    setupSectionHighlighting() {
        const sections = document.querySelectorAll('h2[id], h3[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '-20% 0px -70% 0px'
        });
        
        sections.forEach(section => {
            sectionObserver.observe(section);
        });
    }

    showLoadingSpinner() {
        const contentContainer = document.getElementById('blogContent');
        if (contentContainer) {
            contentContainer.innerHTML = `
                <div class="loading-container">
                    <div class="loading-spinner"></div>
                    <p class="loading-text">Loading article...</p>
                </div>
            `;
        }
    }

    hideLoadingSpinner() {
        const loadingContainer = document.querySelector('.loading-container');
        if (loadingContainer) {
            loadingContainer.remove();
        }
    }

    showToast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const messageSpan = document.createElement('span');
        messageSpan.textContent = message;
        toast.appendChild(messageSpan);
        
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, duration);
        
        // Add click to dismiss
        toast.addEventListener('click', () => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        });
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
    
    // Enhanced utility methods
    debounce(func, wait) {
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
    
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    // Enhanced accessibility features
    // setupAccessibility() {
    //     // Skip link
    //     const skipLink = document.createElement('a');
    //     skipLink.href = '#main-content';
    //     skipLink.className = 'skip-link';
    //     skipLink.textContent = 'Skip to main content';
    //     document.body.insertBefore(skipLink, document.body.firstChild);
        
    //     // Focus management
    //     this.setupFocusManagement();
        
    //     // Keyboard navigation
    //     this.setupKeyboardNavigation();
    // }
    
    setupFocusManagement() {
        // Trap focus in modals
        const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                const modal = document.querySelector('.modal.active');
                if (modal) {
                    const focusable = modal.querySelectorAll(focusableElements);
                    const firstFocusable = focusable[0];
                    const lastFocusable = focusable[focusable.length - 1];
                    
                    if (e.shiftKey) {
                        if (document.activeElement === firstFocusable) {
                            lastFocusable.focus();
                            e.preventDefault();
                        }
                    } else {
                        if (document.activeElement === lastFocusable) {
                            firstFocusable.focus();
                            e.preventDefault();
                        }
                    }
                }
            }
        });
    }
    
    setupKeyboardNavigation() {
        // Enhanced keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Alt + T for theme toggle
            if (e.altKey && e.key === 't') {
                e.preventDefault();
                this.toggleTheme();
            }
            
            // Alt + C for comments section
            if (e.altKey && e.key === 'c') {
                e.preventDefault();
                document.querySelector('.comments-section')?.scrollIntoView({ behavior: 'smooth' });
            }
            
            // Alt + S for social sharing
            if (e.altKey && e.key === 's') {
                e.preventDefault();
                document.querySelector('.social-sharing')?.scrollIntoView({ behavior: 'smooth' });
            }
            
            // Escape to close any open elements
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal, .dropdown, .tooltip').forEach(element => {
                    element.classList.remove('active', 'show');
                });
            }
        });
    }
    
    // Enhanced performance monitoring
    setupPerformanceMonitoring() {
        // Monitor Core Web Vitals
        if ('web-vital' in window) {
            import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
                getCLS(console.log);
                getFID(console.log);
                getFCP(console.log);
                getLCP(console.log);
                getTTFB(console.log);
            });
        }
        
        // Monitor long tasks
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.duration > 50) {
                        console.warn('Long task detected:', entry);
                    }
                }
            });
            observer.observe({ entryTypes: ['longtask'] });
        }
    }
    
    // Enhanced error handling
    setupErrorHandling() {
        window.addEventListener('error', (e) => {
            console.error('Global error:', e.error);
            this.showToast('An error occurred. Please refresh the page.', 'error', 5000);
        });
        
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e.reason);
            this.showToast('A network error occurred. Please check your connection.', 'error', 5000);
        });
    }
    
    // Enhanced service worker integration
    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('SW registered: ', registration);
                        
                        // Check for updates
                        registration.addEventListener('updatefound', () => {
                            const newWorker = registration.installing;
                            newWorker.addEventListener('statechange', () => {
                                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                    this.showToast('New content available! Refresh to update.', 'info', 10000);
                                }
                            });
                        });
                    })
                    .catch(registrationError => {
                        console.log('SW registration failed: ', registrationError);
                    });
            });
        }
    }
}

// Social sharing functions
function shareOnTwitter() {
    const url = window.location.href;
    const text = "Check out this article on prompt engineering: Unlocking the Power of AI — A Beginner’s Guide to Prompt Engineering That Actually Works #AI #PromptEngineering #TechTips";
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    window.open(twitterUrl, '_blank', 'width=550,height=420');
}

function shareOnLinkedIn() {
    const url = window.location.href;
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(linkedInUrl, '_blank', 'width=520,height=570');
}

function shareOnWhatsApp() {
    const url = window.location.href;
    const text = "Check out this article on prompt engineering: Unlocking the Power of AI — A Beginner’s Guide to Prompt Engineering That Actually Works #AI #PromptEngineering #TechTips";
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
    window.open(whatsappUrl, '_blank');
}

// Form handling functions
function handleNewsletterSignup(event) {
    event.preventDefault();
    const email = event.target.querySelector('input[type="email"]').value;
    
    // Enhanced form validation
    if (!email || !email.includes('@')) {
        blogPlatform.showToast('Please enter a valid email address.', 'error');
        return;
    }
    
    // Show loading state
    const button = event.target.querySelector('button');
    const originalText = button.textContent;
    button.textContent = 'Subscribing...';
    button.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        blogPlatform.showToast('Thank you for subscribing! You\'ll receive updates about new blog posts.', 'success', 5000);
        event.target.reset();
        button.textContent = originalText;
        button.disabled = false;
    }, 1500);
}

function handleCommentSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    // Enhanced form validation
    const name = formData.get('name');
    const email = formData.get('email');
    const content = formData.get('comment');
    
    if (!name || !email || !content) {
        blogPlatform.showToast('Please fill in all fields.', 'error');
        return;
    }
    
    if (!email.includes('@')) {
        blogPlatform.showToast('Please enter a valid email address.', 'error');
        return;
    }
    
    if (content.length < 10) {
        blogPlatform.showToast('Comment must be at least 10 characters long.', 'error');
        return;
    }
    
    const comment = {
        name,
        email,
        content,
        timestamp: new Date().toISOString()
    };
    
    // Show loading state
    const button = event.target.querySelector('button');
    const originalText = button.textContent;
    button.textContent = 'Posting...';
    button.disabled = true;
    
    // Add comment to list
    setTimeout(() => {
        blogPlatform.addComment(comment);
        event.target.reset();
        button.textContent = originalText;
        button.disabled = false;
        blogPlatform.showToast('Comment submitted successfully!', 'success', 4000);
    }, 1000);
}

// Comment management
BlogPlatform.prototype.addComment = function(comment) {
    this.comments.push(comment);
    this.renderComments();
};

BlogPlatform.prototype.renderComments = function() {
    const commentsList = document.getElementById('commentsList');
    if (!commentsList) return;

    if (this.comments.length === 0) {
        commentsList.innerHTML = `
            <div style="text-align: center; padding: var(--space-4xl); background: var(--glass-bg); border-radius: var(--radius-lg); backdrop-filter: blur(20px); border: 1px solid var(--glass-border);">
                <p style="color: var(--text-secondary); font-size: var(--font-size-lg); margin-bottom: var(--space-md);">💬 No comments yet</p>
                <p style="color: var(--text-tertiary); font-size: var(--font-size-base);">Be the first to share your thoughts!</p>
            </div>
        `;
        return;
    }

    const commentsHTML = this.comments.map((comment, index) => `
        <div class="comment-item">
            <div class="comment-header">
                <div class="comment-avatar">
                    ${comment.name.charAt(0).toUpperCase()}
                </div>
                <div class="comment-meta">
                    <div class="comment-name">${comment.name}</div>
                    <div class="comment-date">${this.formatDate(comment.timestamp)}</div>
                </div>
            </div>
            <div class="comment-content">${this.escapeHtml(comment.content)}</div>
        </div>
    `).join('');

    commentsList.innerHTML = commentsHTML;
    
    // Add animation to new comments
    const commentItems = commentsList.querySelectorAll('.comment-item');
    commentItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        item.style.transitionDelay = `${index * 0.1}s`;
        
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, 100);
    });
};

BlogPlatform.prototype.formatDate = function(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
        return 'Yesterday';
    } else if (diffDays < 7) {
        return `${diffDays} days ago`;
    } else {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
};

// Enhanced utility functions
BlogPlatform.prototype.formatRelativeTime = function(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffMinutes < 1) {
        return 'Just now';
    } else if (diffMinutes < 60) {
        return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
        return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
};

BlogPlatform.prototype.validateEmail = function(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

BlogPlatform.prototype.sanitizeInput = function(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
};

BlogPlatform.prototype.generateId = function() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Enhanced localStorage management
BlogPlatform.prototype.saveToStorage = function(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.warn('Failed to save to localStorage:', e);
    }
};

BlogPlatform.prototype.loadFromStorage = function(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        console.warn('Failed to load from localStorage:', e);
        return null;
    }
};

// Enhanced analytics tracking
BlogPlatform.prototype.trackEvent = function(eventName, properties = {}) {
    // Placeholder for analytics tracking
    console.log('Event tracked:', eventName, properties);
    
    // Example integration with Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, properties);
    }
    
    // Example integration with other analytics services
    if (typeof analytics !== 'undefined') {
        analytics.track(eventName, properties);
    }
};

// Enhanced SEO and meta management
BlogPlatform.prototype.updateMetaTags = function(title, description, image) {
    document.title = title;
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        metaDescription.setAttribute('content', description);
    }
    
    // Update Open Graph tags
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
        ogTitle.setAttribute('content', title);
    }
    
    let ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
        ogDescription.setAttribute('content', description);
    }
    
    if (image) {
        let ogImage = document.querySelector('meta[property="og:image"]');
        if (ogImage) {
            ogImage.setAttribute('content', image);
        }
    }
    
    // Update Twitter Card tags
    let twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) {
        twitterTitle.setAttribute('content', title);
    }
    
    let twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) {
        twitterDescription.setAttribute('content', description);
    }
};

// Enhanced responsive image loading
BlogPlatform.prototype.setupLazyLoading = function() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
};

// Enhanced PWA features
BlogPlatform.prototype.setupPWA = function() {
    // Add to home screen prompt
    let deferredPrompt;
    
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        
        // Show install button
        const installButton = document.createElement('button');
        installButton.textContent = '📱 Install App';
        installButton.className = 'btn btn-primary install-btn';
        installButton.style.position = 'fixed';
        installButton.style.bottom = '20px';
        installButton.style.right = '20px';
        installButton.style.zIndex = '1000';
        
        installButton.addEventListener('click', () => {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                }
                deferredPrompt = null;
                installButton.remove();
            });
        });
        
        document.body.appendChild(installButton);
        
        // Auto-hide after 10 seconds
        setTimeout(() => {
            if (installButton.parentNode) {
                installButton.remove();
            }
        }, 10000);
    });
    
    // Handle app installed
    window.addEventListener('appinstalled', (evt) => {
        console.log('App was installed');
        this.trackEvent('app_installed');
    });
};

// Enhanced offline support
BlogPlatform.prototype.setupOfflineSupport = function() {
    window.addEventListener('online', () => {
        this.showToast('You\'re back online!', 'success');
        document.body.classList.remove('offline');
    });
    
    window.addEventListener('offline', () => {
        this.showToast('You\'re offline. Some features may not work.', 'info', 5000);
        document.body.classList.add('offline');
    });
    
    // Check initial connection status
    if (!navigator.onLine) {
        document.body.classList.add('offline');
    }
};

// Enhanced search functionality
BlogPlatform.prototype.setupSearch = function() {
    const searchInput = document.createElement('input');
    searchInput.type = 'search';
    searchInput.placeholder = 'Search article...';
    searchInput.className = 'search-input';
    searchInput.style.cssText = `
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
        position: fixed;
        top: 80px;
        right: 20px;
        padding: 10px;
        border: 1px solid var(--glass-border);
        border-radius: var(--radius-lg);
        background: var(--glass-bg);
        backdrop-filter: blur(20px);
        color: var(--text-primary);
        z-index: 999;
        width: 250px;
        opacity: 0;
        transform: translateY(-10px);
        transition: all 0.3s ease;
        pointer-events: none;
    `;
    
    document.body.appendChild(searchInput);
    
    // Toggle search with Ctrl+K or Cmd+K
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            if (searchInput.style.opacity === '0') {
                searchInput.style.opacity = '1';
                searchInput.style.transform = 'translateY(0)';
                searchInput.style.pointerEvents = 'auto';
                searchInput.focus();
            } else {
                searchInput.style.opacity = '0';
                searchInput.style.transform = 'translateY(-10px)';
                searchInput.style.pointerEvents = 'none';
                searchInput.blur();
            }
        }
        
        if (e.key === 'Escape' && searchInput.style.opacity === '1') {
            searchInput.style.opacity = '0';
            searchInput.style.transform = 'translateY(-10px)';
            searchInput.style.pointerEvents = 'none';
        }
    });
    
    // Search functionality
    searchInput.addEventListener('input', this.debounce((e) => {
        const query = e.target.value.toLowerCase();
        const content = document.querySelector('.article-content');
        
        if (query.length > 2) {
            this.highlightSearchResults(content, query);
        } else {
            this.clearSearchHighlights(content);
        }
    }, 300));
};

BlogPlatform.prototype.highlightSearchResults = function(container, query) {
    this.clearSearchHighlights(container);
    
    const walker = document.createTreeWalker(
        container,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );
    
    const textNodes = [];
    let node;
    
    while (node = walker.nextNode()) {
        textNodes.push(node);
    }
    
    textNodes.forEach(textNode => {
        const text = textNode.textContent;
        const regex = new RegExp(`(${query})`, 'gi');
        
        if (regex.test(text)) {
            const highlightedText = text.replace(regex, '<mark class="search-highlight">$1</mark>');
            const wrapper = document.createElement('span');
            wrapper.innerHTML = highlightedText;
            textNode.parentNode.replaceChild(wrapper, textNode);
        }
    });
};

BlogPlatform.prototype.clearSearchHighlights = function(container) {
    const highlights = container.querySelectorAll('.search-highlight');
    highlights.forEach(highlight => {
        const parent = highlight.parentNode;
        parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
        parent.normalize();
    });
};

// Copy code function (global)
function copyCode(button) {
    blogPlatform.copyCode(button);
}

// Initialize the blog platform
let blogPlatform;

document.addEventListener('DOMContentLoaded', () => {
    blogPlatform = new BlogPlatform();
    
    // Initialize enhanced features
    blogPlatform.setupAccessibility();
    blogPlatform.setupPerformanceMonitoring();
    blogPlatform.setupErrorHandling();
    blogPlatform.setupServiceWorker();
    blogPlatform.setupLazyLoading();
    blogPlatform.setupPWA();
    blogPlatform.setupOfflineSupport();
    blogPlatform.setupSearch();
    
    // Add some sample comments
    setTimeout(() => {
        blogPlatform.addComment({
            name: 'Sarah Johnson',
            email: 'sarah@example.com',
            content: 'Great article! I\'ve been struggling with getting good results from ChatGPT, and the CLEAR framework really helps. Looking forward to the next post in the series!',
            timestamp: new Date(Date.now() - 86400000).toISOString()
        });
        
        blogPlatform.addComment({
            name: 'Mike Chen',
            email: 'mike@example.com',
            content: 'The examples really made this click for me. I tried the smart prompt approach for a work project and got much better results. Thanks for sharing!',
            timestamp: new Date(Date.now() - 43200000).toISOString()
        });
        
        blogPlatform.addComment({
            name: 'Alex Rivera',
            email: 'alex@example.com',
            content: 'This is exactly what I needed! I\'ve been using AI tools but never thought about prompt engineering as a skill. The CLEAR framework is brilliant.',
            timestamp: new Date(Date.now() - 7200000).toISOString()
        });
    }, 2500);
});

// Enhanced mobile menu toggle
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const hamburger = document.querySelector('.hamburger');
    
    if (navMenu) {
        navMenu.classList.toggle('active');
        hamburger?.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
}

// Enhanced keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close any open elements
        document.querySelectorAll('.modal, .dropdown, .tooltip, .nav-menu').forEach(element => {
            element.classList.remove('active', 'show');
        });
        
        // Reset body scroll
        document.body.style.overflow = '';
    }
    
    // Quick navigation shortcuts
    if (e.altKey) {
        switch(e.key) {
            case 'h':
                e.preventDefault();
                document.querySelector('.hero')?.scrollIntoView({ behavior: 'smooth' });
                break;
            case 'a':
                e.preventDefault();
                document.querySelector('.article')?.scrollIntoView({ behavior: 'smooth' });
                break;
            case 'c':
                e.preventDefault();
                document.querySelector('.comments-section')?.scrollIntoView({ behavior: 'smooth' });
                break;
            case 'f':
                e.preventDefault();
                document.querySelector('.footer')?.scrollIntoView({ behavior: 'smooth' });
                break;
        }
    }
});

// Enhanced touch gestures for mobile
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchend', (e) => {
    if (!touchStartX || !touchStartY) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;
    
    // Minimum swipe distance
    const minSwipeDistance = 50;
    
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > minSwipeDistance) {
        if (diffX > 0) {
            // Swipe left - could trigger next section
            console.log('Swipe left detected');
        } else {
            // Swipe right - could trigger previous section
            console.log('Swipe right detected');
        }
    }
    
    touchStartX = 0;
    touchStartY = 0;
}, { passive: true });

// Enhanced viewport detection
function getViewportSize() {
    return {
        width: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
        height: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
    };
}

// Enhanced device detection
function getDeviceInfo() {
    const ua = navigator.userAgent;
    return {
        isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua),
        isTablet: /iPad|Android(?!.*Mobile)/i.test(ua),
        isDesktop: !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua),
        browser: getBrowserInfo(),
        os: getOSInfo()
    };
}

function getBrowserInfo() {
    const ua = navigator.userAgent;
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Edge')) return 'Edge';
    return 'Unknown';
}

function getOSInfo() {
    const ua = navigator.userAgent;
    if (ua.includes('Windows')) return 'Windows';
    if (ua.includes('Mac')) return 'macOS';
    if (ua.includes('Linux')) return 'Linux';
    if (ua.includes('Android')) return 'Android';
    if (ua.includes('iOS')) return 'iOS';
    return 'Unknown';
}

// Enhanced performance utilities
function measurePerformance(name, fn) {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    console.log(`${name} took ${end - start} milliseconds`);
    return result;
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Enhanced animation utilities
function animateValue(obj, start, end, duration, callback) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        obj.innerHTML = value;
        if (callback) callback(value, progress);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Enhanced color utilities
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function interpolateColor(color1, color2, factor) {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
    
    if (!rgb1 || !rgb2) return color1;
    
    const r = Math.round(rgb1.r + factor * (rgb2.r - rgb1.r));
    const g = Math.round(rgb1.g + factor * (rgb2.g - rgb1.g));
    const b = Math.round(rgb1.b + factor * (rgb2.b - rgb1.b));
    
    return rgbToHex(r, g, b);
}

// Enhanced localStorage with expiration
const storage = {
    set(key, value, expiration = null) {
        const item = {
            value,
            expiration: expiration ? Date.now() + expiration : null
        };
        try {
            localStorage.setItem(key, JSON.stringify(item));
        } catch (e) {
            console.warn('Failed to save to localStorage:', e);
        }
    },
    
    get(key) {
        try {
            const item = JSON.parse(localStorage.getItem(key));
            if (!item) return null;
            
            if (item.expiration && Date.now() > item.expiration) {
                localStorage.removeItem(key);
                return null;
            }
            
            return item.value;
        } catch (e) {
            console.warn('Failed to load from localStorage:', e);
            return null;
        }
    },
    
    remove(key) {
        localStorage.removeItem(key);
    },
    
    clear() {
        localStorage.clear();
    }
};

// Enhanced cookie utilities
const cookies = {
    set(name, value, days = 7) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    },
    
    get(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    },
    
    remove(name) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
};

// Enhanced URL utilities
const urlUtils = {
    getParams() {
        return new URLSearchParams(window.location.search);
    },
    
    getParam(name) {
        return this.getParams().get(name);
    },
    
    setParam(name, value) {
        const url = new URL(window.location);
        url.searchParams.set(name, value);
        window.history.pushState({}, '', url);
    },
    
    removeParam(name) {
        const url = new URL(window.location);
        url.searchParams.delete(name);
        window.history.pushState({}, '', url);
    },
    
    getHash() {
        return window.location.hash.substring(1);
    },
    
    setHash(hash) {
        window.location.hash = hash;
    }
};

// Initialize device-specific optimizations
document.addEventListener('DOMContentLoaded', () => {
    const deviceInfo = getDeviceInfo();
    document.body.classList.add(`device-${deviceInfo.isMobile ? 'mobile' : deviceInfo.isTablet ? 'tablet' : 'desktop'}`);
    document.body.classList.add(`browser-${deviceInfo.browser.toLowerCase()}`);
    document.body.classList.add(`os-${deviceInfo.os.toLowerCase()}`);
    
    // Add viewport meta tag if missing
    if (!document.querySelector('meta[name="viewport"]')) {
        const viewport = document.createElement('meta');
        viewport.name = 'viewport';
        viewport.content = 'width=device-width, initial-scale=1.0';
        document.head.appendChild(viewport);
    }
});

// Enhanced console styling for development
if (process.env.NODE_ENV === 'development') {
    console.log('%c🧠 Prompt Engineering Blog Platform', 'color: #3B82F6; font-size: 20px; font-weight: bold;');
    console.log('%cBuilt with modern web technologies', 'color: #8B5CF6; font-size: 14px;');
    console.log('%cFeatures: Glass morphism, responsive design, accessibility, PWA support', 'color: #10B981; font-size: 12px;');
}

// Function to create a new particle (bubble)
function createParticle() {
  const particle = document.createElement('div');
  particle.className = 'particle';

  // Random position
  const top = Math.random() * 100;
  const left = Math.random() * 100;

  particle.style.top = `${top}%`;
  particle.style.left = `${left}%`;

  // Random animation delay for floating
  particle.style.animationDelay = `${-Math.random() * 20}s`;

  // Add hover effect (explosion)
  particle.addEventListener('mouseenter', () => {
    // Add explosion animation
    particle.style.transform = 'scale(1.5)';
    particle.style.opacity = '0';

    // Remove particle after animation
    setTimeout(() => {
      background.removeChild(particle);

      // Create new particle
      setTimeout(() => {
        background.appendChild(createParticle());
      }, 100);
    }, 300);
  });

  return particle;
}

// Initialize particles
const particleCount = 12;
for (let i = 0; i < particleCount; i++) {
  background.appendChild(createParticle());
}

// Particle movement
document.addEventListener('mousemove', (e) => {
  const mouseX = e.clientX;
  const mouseY = e.clientY;

  const particles = document.querySelectorAll('.particle');
  particles.forEach((particle, index) => {
    const speed = (index + 1) * 0.5;
    const x = (mouseX - window.innerWidth / 2) / speed / 10;
    const y = (mouseY - window.innerHeight / 2) / speed / 10;

    if (!particle.style.transform.includes('scale')) {
      particle.style.transform = `translate(${x}px, ${y}px) scale(${1 + index * 0.1})`;
    }
  });
});

// Blog platform class
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY || window.pageYOffset;
  // Adjust these values for more/less movement
  const beforeOffset = scrollY * 0.08;
  const afterOffset = scrollY * 0.12;

  document.body.style.setProperty('--bubbles-before-y', `${beforeOffset}px`);
  document.body.style.setProperty('--bubbles-after-y', `${afterOffset}px`);
});

// Regenerate bubble positions on scroll for a "reappear" effect
function randomPercent(min, max) {
    return `${Math.floor(Math.random() * (max - min + 1)) + min}%`;
}

function regenerateBubbles() {
    document.body.style.setProperty('--bubble1-x', randomPercent(5, 25));
    document.body.style.setProperty('--bubble1-y', randomPercent(70, 90));
    document.body.style.setProperty('--bubble2-x', randomPercent(70, 90));
    document.body.style.setProperty('--bubble2-y', randomPercent(10, 40));
    document.body.style.setProperty('--bubble3-x', randomPercent(20, 50));
    document.body.style.setProperty('--bubble3-y', randomPercent(20, 60));
    document.body.style.setProperty('--bubble4-x', randomPercent(50, 80));
    document.body.style.setProperty('--bubble4-y', randomPercent(50, 80));
    document.body.style.setProperty('--bubble5-x', randomPercent(80, 100));
    document.body.style.setProperty('--bubble5-y', randomPercent(80, 100));
    document.body.style.setProperty('--bubble6-x', randomPercent(0, 20));
    document.body.style.setProperty('--bubble6-y', randomPercent(0, 20));
}

// Throttle scroll event for performance
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const now = Date.now();
    if (now - lastScroll > 200) { // Only every 200ms
        regenerateBubbles();
        lastScroll = now;
    }
});

// Initial call
regenerateBubbles();