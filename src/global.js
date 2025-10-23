// script.js - Script comum para todas as páginas

// Navegação responsiva
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeAnimations();
    initializeAccessibility();
});

// Inicialização da navegação
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
            
            // Animar ícone hamburger
            const spans = hamburger.querySelectorAll('span');
            if (navMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
        
        // Fechar menu ao clicar em um link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                const spans = hamburger.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }
}

// Animações de entrada
function initializeAnimations() {
    // Adiciona classe de animação para elementos com data-animate
    const animatedElements = document.querySelectorAll('[data-animate]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Melhorias de acessibilidade
function initializeAccessibility() {
    // Adiciona skip link para acessibilidade
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Ir para o conteúdo principal';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--primary);
        color: white;
        padding: 8px;
        z-index: 10000;
        text-decoration: none;
        border-radius: 0 0 4px 4px;
        transition: top 0.3s;
    `;
    
    document.body.prepend(skipLink);
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '0';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    // Fechar menu ao pressionar Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const navMenu = document.querySelector('.nav-menu');
            const hamburger = document.querySelector('.hamburger');
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        }
    });
}

// script.js - CORREÇÕES NAS FUNÇÕES DE VALIDAÇÃO

// Utilitários comuns - CORREÇÃO
const utils = {
    // Formata número com separadores
    formatNumber: (number) => {
        return new Intl.NumberFormat('pt-BR').format(number);
    },
    
    // Valida e-mail - CORREÇÃO
    isValidEmail: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    
    // Valida CPF - CORREÇÃO
    isValidCPF: (cpf) => {
        cpf = cpf.replace(/\D/g, '');
        if (cpf.length !== 11) return false;
        
        // Elimina CPFs inválidos conhecidos
        if (/^(\d)\1{10}$/.test(cpf)) return false;
        
        // Valida 1º dígito
        let sum = 0;
        for (let i = 0; i < 9; i++) {
            sum += parseInt(cpf.charAt(i)) * (10 - i);
        }
        let remainder = 11 - (sum % 11);
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cpf.charAt(9))) return false;
        
        // Valida 2º dígito
        sum = 0;
        for (let i = 0; i < 10; i++) {
            sum += parseInt(cpf.charAt(i)) * (11 - i);
        }
        remainder = 11 - (sum % 11);
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cpf.charAt(10))) return false;
        
        return true;
    },
    
    // Valida telefone - CORREÇÃO
    isValidPhone: (phone) => {
        const phoneRegex = /^\(?\d{2}\)?[\s-]?\d{4,5}-?\d{4}$/;
        return phoneRegex.test(phone);
    },
    
    // Valida CEP - CORREÇÃO
    isValidCEP: (cep) => {
        const cepRegex = /^\d{5}-?\d{3}$/;
        return cepRegex.test(cep);
    },
    
    // Debounce para otimização de performance
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Mostrar loading - CORREÇÃO
    showLoading: (button) => {
        const originalText = button.textContent;
        button.innerHTML = '<span class="spinner"></span> Carregando...';
        button.disabled = true;
        button.classList.add('loading');
        return originalText;
    },
    
    // Esconder loading - CORREÇÃO
    hideLoading: (button, originalText) => {
        button.textContent = originalText;
        button.disabled = false;
        button.classList.remove('loading');
    },
    
    // Limpar erros do formulário - NOVA FUNÇÃO
    clearFormErrors: (form) => {
        const errorElements = form.querySelectorAll('.error-message');
        const invalidFields = form.querySelectorAll('.form-control.invalid');
        
        errorElements.forEach(error => {
            error.style.display = 'none';
        });
        
        invalidFields.forEach(field => {
            field.classList.remove('invalid');
            field.classList.remove('valid');
        });
    },
    
    // Mostrar erro em campo específico - NOVA FUNÇÃO
    showFieldError: (field, message) => {
        // Remove estados anteriores
        field.classList.remove('valid');
        field.classList.add('invalid');
        
        // Encontra ou cria elemento de erro
        let errorElement = field.parentNode.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            field.parentNode.appendChild(errorElement);
        }
        
        // Atualiza mensagem e exibe
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        
        // Scroll para o campo com erro se estiver fora da viewport
        const rect = field.getBoundingClientRect();
        if (rect.top < 0 || rect.bottom > window.innerHeight) {
            field.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    },
    
    // Mostrar sucesso em campo - NOVA FUNÇÃO
    showFieldSuccess: (field) => {
        field.classList.remove('invalid');
        field.classList.add('valid');
        
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    },
    
    // Validar campo individual - NOVA FUNÇÃO
    validateField: (field) => {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // Validação de campo obrigatório
        if (field.hasAttribute('required') && !value) {
            errorMessage = field.getAttribute('data-error-required') || 'Este campo é obrigatório';
            isValid = false;
        }
        
        // Validações específicas por tipo de campo
        if (isValid && value) {
            switch (field.type) {
                case 'email':
                    if (!utils.isValidEmail(value)) {
                        errorMessage = 'Por favor, insira um e-mail válido';
                        isValid = false;
                    }
                    break;
                    
                case 'tel':
                    if (!utils.isValidPhone(value)) {
                        errorMessage = 'Por favor, insira um telefone válido';
                        isValid = false;
                    }
                    break;
            }
            
            // Validações por ID/name
            switch (field.id || field.name) {
                case 'cpf':
                    if (!utils.isValidCPF(value)) {
                        errorMessage = 'CPF inválido';
                        isValid = false;
                    }
                    break;
                    
                case 'cep':
                    if (!utils.isValidCEP(value)) {
                        errorMessage = 'CEP inválido';
                        isValid = false;
                    }
                    break;
                    
                case 'password':
                    if (value.length < 6) {
                        errorMessage = 'A senha deve ter pelo menos 6 caracteres';
                        isValid = false;
                    }
                    break;
            }
        }
        
        // Aplica o resultado
        if (!isValid) {
            utils.showFieldError(field, errorMessage);
        } else {
            utils.showFieldSuccess(field);
        }
        
        return isValid;
    }
};