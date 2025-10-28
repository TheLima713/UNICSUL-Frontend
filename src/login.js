// login.js - Script específico para a página de login
document.addEventListener('DOMContentLoaded', function() {
    initializeLoginPage();
    initializeLoginForm();
    initializePasswordRecovery();
    initializeSocialLogin();
    initializeUserTypeSelector();
});

// Inicialização da página de login
function initializeLoginPage() {
    // Adiciona animação ao card de login
    const loginCard = document.querySelector('.login-card');
    if (loginCard) {
        loginCard.setAttribute('data-animate', 'true');
        loginCard.style.animationDelay = '0.2s';
    }
    
    // Verifica se há credenciais salvas
    checkSavedCredentials();
    
    // Inicializa o seletor de tipo de usuário
    initializeUserTypeSelector();
    
    // Inicializa o formulário de login
    initializeLoginForm();
    
    // Inicializa a recuperação de senha
    initializePasswordRecovery();
    
    // Inicializa login social
    initializeSocialLogin();
}

// Seletor de tipo de usuário
function initializeUserTypeSelector() {
    const userTypeButtons = document.querySelectorAll('.user-type-btn');
    
    userTypeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove classe active de todos os botões
            userTypeButtons.forEach(btn => btn.classList.remove('active'));
            
            // Adiciona classe active ao botão clicado
            this.classList.add('active');
            
            // Atualiza o formulário baseado no tipo de usuário
            updateLoginForm(this.dataset.type);
        });
    });
}

function updateLoginForm(userType) {
    const formTitle = document.querySelector('.login-header h1');
    const emailInput = document.getElementById('email');
    
    switch (userType) {
        case 'volunteer':
            formTitle.textContent = 'Acesso do Voluntário';
            emailInput.placeholder = 'voluntario@email.com';
            break;
        case 'donor':
            formTitle.textContent = 'Acesso do Doador';
            emailInput.placeholder = 'doador@email.com';
            break;
        case 'organization':
            formTitle.textContent = 'Acesso da Organização';
            emailInput.placeholder = 'organizacao@email.com';
            break;
    }
    
    // Salva preferência do usuário
    localStorage.setItem('preferredUserType', userType);
}

// Formulário de login
function initializeLoginForm() {
    const loginForm = document.getElementById('login-form');
    const passwordToggle = document.getElementById('password-toggle');
    const rememberMe = document.getElementById('remember-me');
    
    if (!loginForm) return;
    
    // Toggle de visibilidade da senha
    if (passwordToggle) {
        passwordToggle.addEventListener('click', function() {
            const passwordInput = document.getElementById('password');
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Altera o ícone
            this.textContent = type === 'password' ? '👁️' : '🔒';
        });
    }
    
    // Validação em tempo real
    const inputs = loginForm.querySelectorAll('input[required]');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            utils.validateField(this);
        });
        
        input.addEventListener('input', function() {
            // Limpa erro enquanto usuário digita
            if (this.classList.contains('invalid')) {
                this.classList.remove('invalid');
                const errorElement = this.parentNode.querySelector('.error-message');
                if (errorElement) {
                    errorElement.style.display = 'none';
                }
            }
        });
        
        // Enter para submeter
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                loginForm.dispatchEvent(new Event('submit'));
            }
        });
    });
    
    // Submissão do formulário
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Limpa erros anteriores
        utils.clearFormErrors(loginForm);
        
        if (validateLoginForm()) {
            processLogin();
        } else {
            // Encontra o primeiro campo com erro e foca nele
            const firstError = loginForm.querySelector('.form-control.invalid');
            if (firstError) {
                firstError.focus();
            }
        }
    });
    
    // Carrega credenciais salvas se "Lembrar-me" estava marcado
    loadSavedCredentials();
}

function validateLoginForm() {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    let isValid = true;
    
    // Valida e-mail
    if (!utils.validateField(emailInput)) {
        isValid = false;
    }
    
    // Valida senha
    if (!utils.validateField(passwordInput)) {
        isValid = false;
    }
    
    return isValid;
}

// Processamento do login
function processLogin() {
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const rememberMe = document.getElementById('remember-me');
    const userType = document.querySelector('.user-type-btn.active').dataset.type;
    const submitButton = loginForm.querySelector('button[type="submit"]');
    
    // Verifica tentativas de login
    if (!checkLoginAttempts()) {
        return;
    }
    
    const originalText = utils.showLoading(submitButton);
    
    // Simulação de autenticação
    setTimeout(() => {
        const loginSuccess = simulateAuthentication(
            emailInput.value, 
            passwordInput.value, 
            userType
        );
        
        if (loginSuccess) {
            resetLoginAttempts();
            
            // Salva credenciais se "Lembrar-me" estiver marcado
            if (rememberMe.checked) {
                saveCredentials(emailInput.value, userType);
            } else {
                clearSavedCredentials();
            }
            
            // Redireciona para dashboard
            redirectToDashboard(userType);
        } else {
            utils.hideLoading(submitButton, originalText);
            recordLoginAttempt();
            showLoginError('E-mail ou senha incorretos. Por favor, tente novamente.');
        }
    }, 1500);
}

function simulateAuthentication(email, password, userType) {
    // Buscar usuários do localStorage
    const existingUsers = JSON.parse(localStorage.getItem('ongConnectUsers') || '[]');
    
    // Encontrar usuário com email, password e userType correspondentes
    const user = existingUsers.find(user => 
        user.email === email && 
        user.password === password && // Em produção, usar hash
        user.userType === userType
    );
    
    return !!user; // Retorna true se usuário for encontrado
}

function redirectToDashboard(userType) {
    // Simula redirecionamento para dashboard
    showLoginSuccess(`Login bem-sucedido! Redirecionando para o dashboard ${userType}...`);
    
    setTimeout(() => {
        // Em um sistema real, isso redirecionaria para a página de dashboard apropriada
        // Por enquanto, redireciona para a página inicial
        window.location.href = 'index.html';
    }, 2000);
}

// Sistema de recuperação de senha
function initializePasswordRecovery() {
    const forgotPasswordLink = document.getElementById('forgot-password');
    const passwordModal = document.getElementById('password-modal');
    const modalClose = document.getElementById('modal-close');
    const recoveryForm = document.getElementById('password-recovery-form');
    
    if (!forgotPasswordLink || !passwordModal) return;
    
    // Abre modal de recuperação
    forgotPasswordLink.addEventListener('click', function(e) {
        e.preventDefault();
        passwordModal.classList.add('active');
        document.getElementById('recovery-email').focus();
    });
    
    // Fecha modal
    modalClose.addEventListener('click', function() {
        passwordModal.classList.remove('active');
    });
    
    // Fecha modal ao clicar fora
    passwordModal.addEventListener('click', function(e) {
        if (e.target === passwordModal) {
            passwordModal.classList.remove('active');
        }
    });
    
    // Fecha modal com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && passwordModal.classList.contains('active')) {
            passwordModal.classList.remove('active');
        }
    });
    
    // Formulário de recuperação
    if (recoveryForm) {
        recoveryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            processPasswordRecovery();
        });
        
        // Validação em tempo real
        const recoveryEmail = document.getElementById('recovery-email');
        if (recoveryEmail) {
            recoveryEmail.addEventListener('blur', function() {
                utils.validateField(this);
            });
        }
    }
}

function processPasswordRecovery() {
    const recoveryForm = document.getElementById('password-recovery-form');
    const emailInput = document.getElementById('recovery-email');
    const submitButton = recoveryForm.querySelector('button[type="submit"]');
    
    // Limpa erros anteriores
    utils.clearFormErrors(recoveryForm);
    
    // Valida e-mail
    if (!utils.validateField(emailInput)) {
        emailInput.focus();
        return;
    }
    
    const originalText = utils.showLoading(submitButton);
    
    // Simulação de envio de e-mail
    setTimeout(() => {
        utils.hideLoading(submitButton, originalText);
        
        // Fecha modal
        document.getElementById('password-modal').classList.remove('active');
        
        // Mostra mensagem de sucesso
        showLoginSuccess(`Enviamos um link de recuperação para ${emailInput.value}. Verifique sua caixa de entrada.`);
        
        // Limpa formulário
        recoveryForm.reset();
    }, 1500);
}

// Login social
function initializeSocialLogin() {
    const googleBtn = document.querySelector('.social-btn.google');
    const facebookBtn = document.querySelector('.social-btn.facebook');
    
    if (googleBtn) {
        googleBtn.addEventListener('click', function() {
            initiateSocialLogin('google');
        });
    }
    
    if (facebookBtn) {
        facebookBtn.addEventListener('click', function() {
            initiateSocialLogin('facebook');
        });
    }
}

function initiateSocialLogin(provider) {
    const userType = document.querySelector('.user-type-btn.active').dataset.type;
    
    showLoginSuccess(`Iniciando login com ${provider}...`);
    
    // Em um sistema real, aqui seria redirecionado para OAuth do provider
    setTimeout(() => {
        showLoginSuccess(`Login com ${provider} realizado com sucesso!`);
        
        // Simula redirecionamento
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }, 2000);
}

// Gerenciamento de credenciais salvas
function saveCredentials(email, userType) {
    const credentials = {
        email: email,
        userType: userType,
        timestamp: new Date().getTime()
    };
    
    localStorage.setItem('ongConnectCredentials', JSON.stringify(credentials));
}

function loadSavedCredentials() {
    const saved = localStorage.getItem('ongConnectCredentials');
    const rememberMe = document.getElementById('remember-me');
    
    if (saved) {
        const credentials = JSON.parse(saved);
        const emailInput = document.getElementById('email');
        
        // Preenche e-mail
        if (emailInput) {
            emailInput.value = credentials.email;
        }
        
        // Seleciona tipo de usuário
        const userTypeBtn = document.querySelector(`.user-type-btn[data-type="${credentials.userType}"]`);
        if (userTypeBtn) {
            userTypeBtn.click();
        }
        
        // Marca "Lembrar-me"
        if (rememberMe) {
            rememberMe.checked = true;
        }
    }
}

function clearSavedCredentials() {
    localStorage.removeItem('ongConnectCredentials');
}

function checkSavedCredentials() {
    const saved = localStorage.getItem('ongConnectCredentials');
    if (saved) {
        const credentials = JSON.parse(saved);
        const oneWeek = 7 * 24 * 60 * 60 * 1000; // 1 semana em milissegundos
        
        // Remove credenciais salvas há mais de 1 semana
        if (new Date().getTime() - credentials.timestamp > oneWeek) {
            clearSavedCredentials();
        }
    }
}

// Prevenção de ataques de força bruta
function checkLoginAttempts() {
    const maxAttempts = 5;
    const lockoutTime = 1 * 60 * 1000; // 15 minutos
    const lastAttempt = localStorage.getItem('lastLoginAttempt');
    const attempts = parseInt(localStorage.getItem('loginAttempts') || '0');
    
    if (attempts >= maxAttempts && lastAttempt) {
        const timeSinceLastAttempt = new Date().getTime() - parseInt(lastAttempt);
        
        if (timeSinceLastAttempt < lockoutTime) {
            const remainingTime = Math.ceil((lockoutTime - timeSinceLastAttempt) / 60000);
            showLoginError(`Muitas tentativas de login. Tente novamente em ${remainingTime} minutos.`);
            return false;
        } else {
            // Reset attempts após período de lockout
            localStorage.removeItem('loginAttempts');
            localStorage.removeItem('lastLoginAttempt');
        }
    }
    
    return true;
}

function recordLoginAttempt() {
    let attempts = parseInt(localStorage.getItem('loginAttempts') || '0');
    attempts++;
    localStorage.setItem('loginAttempts', attempts.toString());
    localStorage.setItem('lastLoginAttempt', new Date().getTime().toString());
}

function resetLoginAttempts() {
    localStorage.removeItem('loginAttempts');
    localStorage.removeItem('lastLoginAttempt');
}

// Mensagens de feedback
function showLoginSuccess(message) {
    const alert = document.createElement('div');
    alert.className = 'alert alert-success';
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

function showLoginError(message) {
    const alert = document.createElement('div');
    alert.className = 'alert alert-error';
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