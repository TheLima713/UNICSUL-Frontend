// home.js - Script específico para a página inicial
document.addEventListener('DOMContentLoaded', function() {
    initializeHomePage();
    initializeCounters();
    initializeTestimonials();
});

// Inicialização da página inicial
function initializeHomePage() {
    // Adiciona animação aos cards
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.setAttribute('data-animate', 'true');
    });
    
    // Inicializa contadores animados
    initializeCounters();
    
    // Inicializa carrossel de depoimentos
    initializeTestimonials();
    
    // Efeito de parallax no hero
    initializeParallax();
}

// Contadores animados
function initializeCounters() {
    const counters = document.querySelectorAll('.card.text-center h3');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    });
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

function animateCounter(element) {
    const target = parseInt(element.textContent.replace(/\D/g, ''));
    const suffix = element.textContent.replace(/[0-9]/g, '');
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = utils.formatNumber(Math.floor(current)) + suffix;
    }, 16);
}

// Carrossel de depoimentos
function initializeTestimonials() {
    const testimonialContainer = document.querySelector('.card-grid');
    if (!testimonialContainer) return;
    
    let currentIndex = 0;
    const cards = Array.from(testimonialContainer.children);
    
    // Adiciona navegação do carrossel
    const carouselNav = document.createElement('div');
    carouselNav.className = 'carousel-nav';
    carouselNav.style.cssText = `
        display: flex;
        justify-content: center;
        gap: 10px;
        margin-top: 20px;
    `;
    
    cards.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot';
        dot.innerHTML = '●';
        dot.style.cssText = `
            background: none;
            border: none;
            font-size: 20px;
            color: ${index === 0 ? 'var(--primary)' : 'var(--light-gray)'};
            cursor: pointer;
            transition: color 0.3s;
        `;
        
        dot.addEventListener('click', () => {
            showTestimonial(index);
        });
        
        carouselNav.appendChild(dot);
    });
    
    testimonialContainer.parentNode.appendChild(carouselNav);
    
    function showTestimonial(index) {
        cards.forEach((card, i) => {
            card.style.display = i === index ? 'block' : 'none';
        });
        
        // Atualiza dots de navegação
        document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
            dot.style.color = i === index ? 'var(--primary)' : 'var(--light-gray)';
        });
        
        currentIndex = index;
    }
    
    // Auto-rotate a cada 5 segundos
    setInterval(() => {
        currentIndex = (currentIndex + 1) % cards.length;
        showTestimonial(currentIndex);
    }, 5000);
    
    // Mostra apenas o primeiro depoimento inicialmente
    showTestimonial(0);
}

// Efeito parallax no hero
function initializeParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    window.addEventListener('scroll', utils.debounce(() => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }, 10));
}

// Interatividade adicional para a página inicial
const homeInteractions = {
    // Smooth scroll para seções
    initSmoothScroll: function() {
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', function(e) {
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
    },
    
    // Newsletter signup
    initNewsletter: function() {
        const newsletterForm = document.querySelector('#newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const email = this.querySelector('input[type="email"]').value;
                
                if (utils.isValidEmail(email)) {
                    const button = this.querySelector('button');
                    const originalText = utils.showLoading(button);
                    
                    // Simulação de envio
                    setTimeout(() => {
                        utils.hideLoading(button, originalText);
                        showAlert('Obrigado por se inscrever em nossa newsletter!', 'success');
                        this.reset();
                    }, 1500);
                } else {
                    showAlert('Por favor, insira um e-mail válido.', 'error');
                }
            });
        }
    }
};

// Função para mostrar alertas
function showAlert(message, type) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    alert.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        max-width: 300px;
    `;
    
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

// Inicializa interações da página inicial quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    homeInteractions.initSmoothScroll();
    homeInteractions.initNewsletter();
});