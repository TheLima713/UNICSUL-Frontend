
// cadastro.js - Script específico para a página de cadastro (CORRIGIDO)
document.addEventListener('DOMContentLoaded', function() {
    initializeRegistrationPage();
    initializeFormValidation();
    initializeMasks();
    initializeDynamicFields();
    initializePasswordStrength();
    initializeFormNavigation();
});

// Navegação entre seções do formulário
function initializeFormNavigation() {
    const nextButtons = document.querySelectorAll('.next-section');
    const prevButtons = document.querySelectorAll('.prev-section');
    const progressSteps = document.querySelectorAll('.progress-step');
    
    // Botões "Próximo"
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentSection = document.querySelector('.form-section.active');
            const nextSectionNum = this.dataset.next;
            const nextSection = document.querySelector(`.form-section[data-section="${nextSectionNum}"]`);
            
            // Valida seção atual antes de avançar
            if (validateSection(currentSection.dataset.section)) {
                // Atualiza seções
                currentSection.classList.remove('active');
                nextSection.classList.add('active');
                
                // Atualiza progresso
                updateProgress(nextSectionNum);
                
                // Scroll para o topo da nova seção
                nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
    
    // Botões "Anterior"
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentSection = document.querySelector('.form-section.active');
            const prevSectionNum = this.dataset.prev;
            const prevSection = document.querySelector(`.form-section[data-section="${prevSectionNum}"]`);
            
            // Atualiza seções
            currentSection.classList.remove('active');
            prevSection.classList.add('active');
            
            // Atualiza progresso
            updateProgress(prevSectionNum);
            
            // Scroll para o topo da seção anterior
            prevSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
    
    function updateProgress(currentStep) {
        progressSteps.forEach(step => {
            const stepNum = step.dataset.step;
            step.classList.remove('active', 'completed');
            
            if (stepNum < currentStep) {
                step.classList.add('completed');
            } else if (stepNum == currentStep) {
                step.classList.add('active');
            }
        });
    }
}
// cadastro.js - CORREÇÃO DO BOTÃO PRÓXIMO

// ... (código anterior mantido)

// Validação de seção específica - CORREÇÃO
function validateSection(sectionNum) {
    const section = document.querySelector(`.form-section[data-section="${sectionNum}"]`);
    const inputs = section.querySelectorAll('[required]');
    let isValid = true;
    let firstErrorField = null;

    // Limpa erros da seção
    utils.clearFormErrors(section);

    // Valida cada campo obrigatório
    inputs.forEach(input => {
        if (!utils.validateField(input)) {
            isValid = false;
            
            // Guarda o primeiro campo com erro
            if (!firstErrorField) {
                firstErrorField = input;
            }
        }
    });

    // Validações específicas por seção
    if (sectionNum === '1') {
        // Validação de senha e confirmação
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirm-password');
        
        if (password.value && confirmPassword.value && password.value !== confirmPassword.value) {
            utils.showFieldError(confirmPassword, 'As senhas não coincidem');
            isValid = false;
            if (!firstErrorField) {
                firstErrorField = confirmPassword;
            }
        }

        // Valida força da senha (pelo menos 6 caracteres)
        if (password.value && password.value.length < 6) {
            utils.showFieldError(password, 'A senha deve ter pelo menos 6 caracteres');
            isValid = false;
            if (!firstErrorField) {
                firstErrorField = password;
            }
        }
    }

    // Se houver erro, foca no primeiro campo com problema
    if (!isValid && firstErrorField) {
        firstErrorField.focus();
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    return isValid;
}

// Navegação entre seções do formulário - CORREÇÃO
function initializeFormNavigation() {
    const nextButtons = document.querySelectorAll('.next-section');
    const prevButtons = document.querySelectorAll('.prev-section');
    const progressSteps = document.querySelectorAll('.progress-step');
    
    // Botões "Próximo" - CORREÇÃO
    nextButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const currentSection = document.querySelector('.form-section.active');
            const nextSectionNum = this.dataset.next;
            const nextSection = document.querySelector(`.form-section[data-section="${nextSectionNum}"]`);
            
            console.log('Botão próximo clicado:', {
                currentSection: currentSection?.dataset.section,
                nextSectionNum: nextSectionNum,
                nextSection: !!nextSection
            });
            
            // Valida seção atual antes de avançar
            if (validateSection(currentSection.dataset.section)) {
                console.log('Seção válida, avançando...');
                
                // Atualiza seções
                currentSection.classList.remove('active');
                nextSection.classList.add('active');
                
                // Atualiza progresso
                updateProgress(nextSectionNum);
                
                // Scroll para o topo da nova seção
                setTimeout(() => {
                    nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            } else {
                console.log('Seção inválida, não avançando');
            }
        });
    });
    
    // Botões "Anterior" - CORREÇÃO
    prevButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const currentSection = document.querySelector('.form-section.active');
            const prevSectionNum = this.dataset.prev;
            const prevSection = document.querySelector(`.form-section[data-section="${prevSectionNum}"]`);
            
            console.log('Botão anterior clicado:', {
                currentSection: currentSection?.dataset.section,
                prevSectionNum: prevSectionNum,
                prevSection: !!prevSection
            });
            
            // Atualiza seções
            currentSection.classList.remove('active');
            prevSection.classList.add('active');
            
            // Atualiza progresso
            updateProgress(prevSectionNum);
            
            // Scroll para o topo da seção anterior
            setTimeout(() => {
                prevSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        });
    });
    
    function updateProgress(currentStep) {
        console.log('Atualizando progresso para etapa:', currentStep);
        
        progressSteps.forEach(step => {
            const stepNum = step.dataset.step;
            step.classList.remove('active', 'completed');
            
            if (stepNum < currentStep) {
                step.classList.add('completed');
            } else if (stepNum == currentStep) {
                step.classList.add('active');
            }
        });
    }
}

// Validação do formulário - CORREÇÃO ADICIONAL
function initializeFormValidation() {
    const form = document.getElementById('registration-form');
    if (!form) {
        console.error('Formulário de cadastro não encontrado!');
        return;
    }

    console.log('Formulário de cadastro inicializado');

    // Validação em tempo real para todos os campos
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            console.log('Validando campo:', this.id, 'valor:', this.value);
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
    });
    
    // Validação específica para confirmação de senha
    const confirmPassword = document.getElementById('confirm-password');
    if (confirmPassword) {
        confirmPassword.addEventListener('blur', function() {
            const password = document.getElementById('password');
            if (password.value && this.value && password.value !== this.value) {
                utils.showFieldError(this, 'As senhas não coincidem');
            } else if (this.value) {
                utils.showFieldSuccess(this);
            }
        });
    }
    
    // Submissão do formulário
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Formulário submetido');
        
        // Limpa todos os erros
        utils.clearFormErrors(form);
        
        if (validateCompleteForm()) {
            submitForm();
        } else {
            // Encontra o primeiro campo com erro e foca nele
            const firstError = form.querySelector('.form-control.invalid');
            if (firstError) {
                firstError.focus();
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
}

// Adicione esta função de debug para verificar se os elementos estão sendo encontrados
function debugFormElements() {
    console.log('=== DEBUG FORM ELEMENTS ===');
    console.log('Form:', document.getElementById('registration-form'));
    console.log('Seções:', document.querySelectorAll('.form-section').length);
    console.log('Botões próximo:', document.querySelectorAll('.next-section').length);
    console.log('Botões anterior:', document.querySelectorAll('.prev-section').length);
    console.log('Passos do progresso:', document.querySelectorAll('.progress-step').length);
    console.log('==========================');
}

// Modifique a inicialização para incluir o debug
function initializeRegistrationPage() {
    console.log('Inicializando página de cadastro...');
    
    // Debug inicial
    debugFormElements();
    
    // Adiciona animação ao formulário
    const formContainer = document.querySelector('.form-container');
    if (formContainer) {
        formContainer.setAttribute('data-animate', 'true');
    }
    
    // Inicializa navegação entre seções (PRIMEIRO!)
    initializeFormNavigation();
    
    // Inicializa validação do formulário
    initializeFormValidation();
    
    // Inicializa máscaras dos campos
    initializeMasks();
    
    // Inicializa campos dinâmicos
    initializeDynamicFields();
    
    // Inicializa força da senha
    initializePasswordStrength();
    
    // Inicializa busca de CEP
    initializeCEPSearch();
    
    console.log('Página de cadastro inicializada com sucesso');
}

// Sistema de máscaras para campos
function initializeMasks() {
    // Máscara para CPF
    const cpfInput = document.getElementById('cpf');
    if (cpfInput) {
        cpfInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.substring(0, 11);
            
            if (value.length <= 11) {
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            }
            
            e.target.value = value;
            
            // Valida em tempo real se tiver valor completo
            if (value.replace(/\D/g, '').length === 11) {
                utils.validateField(e.target);
            }
        });
    }
    
    // Máscara para telefone
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 11) value = value.substring(0, 11);
            
            if (value.length === 11) {
                value = value.replace(/(\d{2})(\d)/, '($1) $2');
                value = value.replace(/(\d{5})(\d)/, '$1-$2');
            } else if (value.length === 10) {
                value = value.replace(/(\d{2})(\d)/, '($1) $2');
                value = value.replace(/(\d{4})(\d)/, '$1-$2');
            }
            
            e.target.value = value;
            
            // Valida em tempo real se tiver valor completo
            if (value.replace(/\D/g, '').length >= 10) {
                utils.validateField(e.target);
            }
        });
    }
    
    // Máscara para CEP
    const cepInput = document.getElementById('cep');
    if (cepInput) {
        cepInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 8) value = value.substring(0, 8);
            
            if (value.length === 8) {
                value = value.replace(/(\d{5})(\d)/, '$1-$2');
            }
            
            e.target.value = value;
            
            // Valida em tempo real se tiver valor completo
            if (value.replace(/\D/g, '').length === 8) {
                utils.validateField(e.target);
            }
        });
    }
    
    // Máscara para CNPJ
    const cnpjInput = document.getElementById('organization-cnpj');
    if (cnpjInput) {
        cnpjInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 14) value = value.substring(0, 14);
            
            if (value.length === 14) {
                value = value.replace(/(\d{2})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d)/, '$1/$2');
                value = value.replace(/(\d{4})(\d)/, '$1-$2');
            }
            
            e.target.value = value;
            
            // Valida em tempo real se tiver valor completo
            if (value.replace(/\D/g, '').length === 14) {
                utils.validateField(e.target);
            }
        });
    }
    
    // Toggle de visibilidade para senhas
    const passwordToggles = document.querySelectorAll('.password-toggle');
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const targetId = this.dataset.target;
            const targetInput = document.getElementById(targetId);
            const type = targetInput.getAttribute('type') === 'password' ? 'text' : 'password';
            targetInput.setAttribute('type', type);
            
            // Altera o ícone
            this.textContent = type === 'password' ? '👁️' : '🔒';
        });
    });
}

// Campos dinâmicos baseados no tipo de cadastro
function initializeDynamicFields() {
    const userTypeSelect = document.getElementById('user-type');
    if (!userTypeSelect) return;
    
    userTypeSelect.addEventListener('change', function() {
        const userType = this.value;
        toggleDynamicFields(userType);
    });
    
    // Inicializa campos baseados no valor padrão
    toggleDynamicFields(userTypeSelect.value);
}

function toggleDynamicFields(userType) {
    const volunteerFields = document.getElementById('volunteer-fields');
    const donorFields = document.getElementById('donor-fields');
    const organizationFields = document.getElementById('organization-fields');
    
    // Esconde todos os grupos primeiro
    if (volunteerFields) volunteerFields.style.display = 'none';
    if (donorFields) donorFields.style.display = 'none';
    if (organizationFields) organizationFields.style.display = 'none';
    
    // Remove required dos campos específicos
    const specificFields = document.querySelectorAll('#volunteer-fields [required], #donor-fields [required], #organization-fields [required]');
    specificFields.forEach(field => field.removeAttribute('required'));
    
    // Mostra grupos baseados no tipo de usuário
    switch (userType) {
        case 'volunteer':
            if (volunteerFields) {
                volunteerFields.style.display = 'block';
                // Adiciona required aos campos de voluntário
                const volunteerRequired = volunteerFields.querySelectorAll('[required]');
                volunteerRequired.forEach(field => field.setAttribute('required', 'true'));
            }
            break;
        case 'organization':
            if (organizationFields) {
                organizationFields.style.display = 'block';
                // Adiciona required aos campos de organização
                const orgRequired = organizationFields.querySelectorAll('[required]');
                orgRequired.forEach(field => field.setAttribute('required', 'true'));
            }
            break;
        case 'donor':
            if (donorFields) donorFields.style.display = 'block';
            break;
    }
}

// Sistema de força da senha
function initializePasswordStrength() {
    const passwordInput = document.getElementById('password');
    if (!passwordInput) return;
    
    passwordInput.addEventListener('input', function() {
        updatePasswordStrength(this.value);
    });
}

function updatePasswordStrength(password) {
    const strengthBar = document.querySelector('.password-strength-bar');
    const strengthContainer = document.querySelector('.password-strength');
    const requirements = {
        length: document.querySelector('[data-requirement="length"]'),
        uppercase: document.querySelector('[data-requirement="uppercase"]'),
        number: document.querySelector('[data-requirement="number"]')
    };
    
    let strength = 0;
    let totalRequirements = 3;
    let metRequirements = 0;
    
    // Verifica requisitos
    if (password.length >= 6) {
        requirements.length.classList.add('met');
        requirements.length.classList.remove('unmet');
        metRequirements++;
    } else {
        requirements.length.classList.add('unmet');
        requirements.length.classList.remove('met');
    }
    
    if (/[A-Z]/.test(password)) {
        requirements.uppercase.classList.add('met');
        requirements.uppercase.classList.remove('unmet');
        metRequirements++;
    } else {
        requirements.uppercase.classList.add('unmet');
        requirements.uppercase.classList.remove('met');
    }
    
    if (/[0-9]/.test(password)) {
        requirements.number.classList.add('met');
        requirements.number.classList.remove('unmet');
        metRequirements++;
    } else {
        requirements.number.classList.add('unmet');
        requirements.number.classList.remove('met');
    }
    
    // Calcula força
    strength = (metRequirements / totalRequirements) * 100;
    
    // Atualiza visual
    strengthBar.style.width = strength + '%';
    strengthContainer.className = 'password-strength';
    
    if (metRequirements === 0) {
        strengthContainer.classList.add('weak');
    } else if (metRequirements <= 2) {
        strengthContainer.classList.add('medium');
    } else {
        strengthContainer.classList.add('strong');
    }
}

// Busca automática de endereço por CEP
function initializeCEPSearch() {
    const cepInput = document.getElementById('cep');
    if (!cepInput) return;
    
    cepInput.addEventListener('blur', function() {
        const cep = this.value.replace(/\D/g, '');
        
        if (cep.length === 8) {
            searchCEP(cep);
        }
    });
}

function searchCEP(cep) {
    const button = document.querySelector('button[type="submit"]');
    const originalText = utils.showLoading(button);
    
    // Simulação de busca de CEP (em produção, usar API como ViaCEP)
    setTimeout(() => {
        utils.hideLoading(button, originalText);
        
        // Dados mockados para exemplo
        const mockAddress = {
            logradouro: 'Rua das Flores',
            bairro: 'Jardim Primavera',
            localidade: 'São Paulo',
            uf: 'SP'
        };
        
        // Preenche automaticamente os campos
        const addressInput = document.getElementById('address');
        const cityInput = document.getElementById('city');
        const stateSelect = document.getElementById('state');
        
        if (addressInput) addressInput.value = mockAddress.logradouro;
        if (cityInput) cityInput.value = mockAddress.localidade;
        if (stateSelect) stateSelect.value = mockAddress.uf;
        
        // Valida os campos preenchidos
        if (addressInput) utils.validateField(addressInput);
        if (cityInput) utils.validateField(cityInput);
        if (stateSelect) utils.validateField(stateSelect);
        
        showAlert('Endereço preenchido automaticamente! Verifique os dados.', 'success');
    }, 1000);
}

// Validação do formulário
function initializeFormValidation() {
    const form = document.getElementById('registration-form');
    if (!form) return;
    
    // Validação em tempo real para todos os campos
    const inputs = form.querySelectorAll('input, select, textarea');
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
    });
    
    // Validação específica para confirmação de senha
    const confirmPassword = document.getElementById('confirm-password');
    if (confirmPassword) {
        confirmPassword.addEventListener('blur', function() {
            const password = document.getElementById('password');
            if (password.value && this.value && password.value !== this.value) {
                utils.showFieldError(this, 'As senhas não coincidem');
            } else {
                utils.showFieldSuccess(this);
            }
        });
    }
    
    // Submissão do formulário
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Limpa todos os erros
        utils.clearFormErrors(form);
        
        if (validateCompleteForm()) {
            submitForm();
        } else {
            // Encontra o primeiro campo com erro e foca nele
            const firstError = form.querySelector('.form-control.invalid');
            if (firstError) {
                firstError.focus();
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
}

function validateCompleteForm() {
    const form = document.getElementById('registration-form');
    const inputs = form.querySelectorAll('[required]');
    let isValid = true;
    
    // Valida todos os campos obrigatórios
    inputs.forEach(input => {
        if (!utils.validateField(input)) {
            isValid = false;
        }
    });
    
    // Validações específicas
    const userType = document.getElementById('user-type').value;
    
    if (userType === 'volunteer') {
        const interests = document.getElementById('interests');
        if (interests && interests.selectedOptions.length === 0) {
            utils.showFieldError(interests, 'Selecione pelo menos uma área de interesse');
            isValid = false;
        }
    }
    
    // Validação de termos
    const terms = document.getElementById('terms');
    if (terms && !terms.checked) {
        utils.showFieldError(terms, 'Você deve aceitar os termos para continuar');
        isValid = false;
    }
    
    return isValid;
}

function registerUserInLocalStorage(formData) {
    // Coletar dados do formulário
    const userData = {
        id: generateUserId(),
        fullName: document.getElementById('full-name').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value, // Em produção, isso deveria ser hash
        userType: document.getElementById('user-type').value,
        cpf: document.getElementById('cpf').value,
        phone: document.getElementById('phone').value,
        birthDate: document.getElementById('birth-date').value,
        address: document.getElementById('address').value,
        cep: document.getElementById('cep').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        registrationDate: new Date().toISOString(),
        status: 'active'
    };
    
    // Adicionar campos específicos por tipo de usuário
    const userType = userData.userType;
    
    if (userType === 'volunteer') {
        userData.interests = Array.from(document.getElementById('interests').selectedOptions).map(option => option.value);
        userData.availability = document.getElementById('availability').value;
        userData.skills = document.getElementById('skills').value;
    } else if (userType === 'organization') {
        userData.organizationName = document.getElementById('organization-name').value;
        userData.organizationCNPJ = document.getElementById('organization-cnpj').value;
        userData.organizationMission = document.getElementById('organization-mission').value;
        userData.organizationWebsite = document.getElementById('organization-website').value;
    } else if (userType === 'donor') {
        userData.donationPreference = document.getElementById('donation-preference').value;
        userData.donationFrequency = document.getElementById('donation-frequency').value;
    }
    
    // Obter usuários existentes ou criar array vazio
    const existingUsers = JSON.parse(localStorage.getItem('ongConnectUsers') || '[]');
    
    // Verificar se email já existe
    const emailExists = existingUsers.some(user => user.email === userData.email);
    if (emailExists) {
        showAlert('Este e-mail já está cadastrado!', 'error');
        return false;
    }
    
    // Adicionar novo usuário
    existingUsers.push(userData);
    
    // Salvar no localStorage
    localStorage.setItem('ongConnectUsers', JSON.stringify(existingUsers));
    
    console.log('Usuário registrado com sucesso:', userData);
    return true;
}

// NOVA FUNÇÃO: Gerar ID único para o usuário
function generateUserId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Envio do formulário
function submitForm() {
    const form = document.getElementById('registration-form');
    const formData = new FormData(form);
    const button = form.querySelector('button[type="submit"]');
    const userType = document.getElementById('user-type');
    const typeText = userType.options[userType.selectedIndex].text;
    
    const originalText = utils.showLoading(button);
    
    // Simulação de envio
    setTimeout(() => {
        utils.hideLoading(button, originalText);
        
        // TENTAR REGISTRAR USUÁRIO - AGORA COM VALIDAÇÃO
        const registrationSuccess = registerUserInLocalStorage(formData);
        
        if (registrationSuccess) {
            // Mostra mensagem de sucesso
            showRegistrationSuccess(formData, typeText);
            
            // Limpa formulário
            form.reset();
            
            // Reseta progresso
            resetFormProgress();
            
            // Limpa rascunho
            localStorage.removeItem('registrationDraft');
        } else {
            // Se falhou (email duplicado), mantém o formulário
            showAlert('Não foi possível completar o cadastro. Tente novamente.', 'error');
        }
    }, 2000);
}

function showRegistrationSuccess(formData, userType) {
    const successMessage = `
        <div class="alert alert-success" style="margin: 20px 0; text-align: center;">
            <h3 style="color: var(--success); margin-bottom: 15px;">🎉 Cadastro realizado com sucesso!</h3>
            <p style="margin-bottom: 10px;"><strong>Obrigado por se cadastrar como ${userType.toLowerCase()}!</strong></p>
            <p style="margin-bottom: 15px;">Em breve nossa equipe entrará em contato com você.</p>
            <div style="margin-top: 20px;">
                <a href="login.html" class="btn btn-primary" style="margin-right: 10px;">Fazer Login</a>
                <a href="index.html" class="btn btn-outline">Voltar ao Início</a>
            </div>
        </div>
    `;
    
    const formContainer = document.querySelector('.form-container');
    formContainer.innerHTML = successMessage;
}

function resetFormProgress() {
    // Reseta seções
    const sections = document.querySelectorAll('.form-section');
    sections.forEach((section, index) => {
        section.classList.remove('active');
        if (index === 0) {
            section.classList.add('active');
        }
    });
    
    // Reseta progresso
    const progressSteps = document.querySelectorAll('.progress-step');
    progressSteps.forEach((step, index) => {
        step.classList.remove('active', 'completed');
        if (index === 0) {
            step.classList.add('active');
        }
    });
}

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

// Salvar rascunho automaticamente
function initializeAutoSave() {
    const form = document.getElementById('registration-form');
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('input', utils.debounce(() => {
            saveDraft();
        }, 1000));
    });
}

function saveDraft() {
    const form = document.getElementById('registration-form');
    const formData = new FormData(form);
    const draft = {};
    
    for (let [key, value] of formData.entries()) {
        draft[key] = value;
    }
    
    // Salva seção atual
    const currentSection = document.querySelector('.form-section.active');
    draft.currentSection = currentSection.dataset.section;
    
    localStorage.setItem('registrationDraft', JSON.stringify(draft));
}

function loadDraft() {
    const draft = localStorage.getItem('registrationDraft');
    if (draft) {
        const formData = JSON.parse(draft);
        const form = document.getElementById('registration-form');
        
        for (let key in formData) {
            if (key !== 'currentSection') {
                const field = form.querySelector(`[name="${key}"]`);
                if (field) {
                    field.value = formData[key];
                    
                    // Dispara eventos para campos que precisam de processamento
                    if (field.type === 'email' || field.id === 'password') {
                        field.dispatchEvent(new Event('input'));
                    }
                }
            }
        }
        
        // Restaura seção
        if (formData.currentSection) {
            const currentSection = document.querySelector('.form-section.active');
            const targetSection = document.querySelector(`.form-section[data-section="${formData.currentSection}"]`);
            
            if (currentSection && targetSection && currentSection !== targetSection) {
                currentSection.classList.remove('active');
                targetSection.classList.add('active');
                updateProgress(formData.currentSection);
            }
        }
        
        // Dispara change event para campos dependentes
        const userType = document.getElementById('user-type');
        if (userType) {
            userType.dispatchEvent(new Event('change'));
        }
        
        showAlert('Rascunho recuperado com sucesso!', 'success');
    }
}

// Carrega rascunho se existir
document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('registrationDraft')) {
        const loadDraftBtn = document.createElement('button');
        loadDraftBtn.type = 'button';
        loadDraftBtn.className = 'btn btn-outline';
        loadDraftBtn.textContent = 'Carregar Rascunho Salvo';
        loadDraftBtn.style.marginBottom = '20px';
        
        loadDraftBtn.addEventListener('click', function() {
            loadDraft();
            this.remove();
        });
        
        const formContainer = document.querySelector('.form-container');
        formContainer.parentNode.insertBefore(loadDraftBtn, formContainer);
    }
    
    // Inicializa auto-save
    initializeAutoSave();
});