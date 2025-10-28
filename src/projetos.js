// projetos.js - Script específico para a página de projetos
document.addEventListener('DOMContentLoaded', function() {
    initializeProjectsPage();
    initializeProjectFilter();
    initializeDonationSystem();
    initializeFAQAccordion();
});

// Inicialização da página de projetos
function initializeProjectsPage() {
    // Adiciona animação aos cards de projeto
    const projectCards = document.querySelectorAll('.card');
    projectCards.forEach((card, index) => {
        card.setAttribute('data-animate', 'true');
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Inicializa sistema de filtros
    initializeProjectFilter();
    
    // Inicializa sistema de doações
    initializeDonationSystem();
    
    // Inicializa accordion do FAQ
    initializeFAQAccordion();
}

// Sistema de filtros para projetos
function initializeProjectFilter() {
    const filterContainer = document.createElement('div');
    filterContainer.className = 'project-filters';
    filterContainer.style.cssText = `
        display: flex;
        justify-content: center;
        gap: 15px;
        margin-bottom: 30px;
        flex-wrap: wrap;
    `;
    
    const filters = [
        { id: 'all', text: 'Todos os Projetos' },
        { id: 'education', text: 'Educação' },
        { id: 'health', text: 'Saúde' }
        /*{ id: 'environment', text: 'Meio Ambiente' },
        { id: 'social', text: 'Assistência Social' }*/
    ];
    
    filters.forEach(filter => {
        const button = document.createElement('button');
        button.className = `btn btn-outline filter-btn ${filter.id === 'all' ? 'active' : ''}`;
        button.textContent = filter.text;
        button.dataset.filter = filter.id;
        
        button.addEventListener('click', function() {
            // Atualiza botão ativo
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            
            // Filtra projetos
            filterProjects(this.dataset.filter);
        });
        
        filterContainer.appendChild(button);
    });
    
    const projectsSection = document.querySelector('.card-grid').parentNode;
    projectsSection.insertBefore(filterContainer, document.querySelector('.card-grid'));
}

function filterProjects(filter) {
    const projects = document.querySelectorAll('.card');
    
    projects.forEach(project => {
        console.log(project.dataset)
        if (filter === 'all' || project.dataset.category === filter) {
            project.style.display = 'block';
            setTimeout(() => {
                project.style.opacity = '1';
                project.style.transform = 'translateY(0)';
            }, 50);
        } else {
            project.style.opacity = '0';
            project.style.transform = 'translateY(20px)';
            setTimeout(() => {
                project.style.display = 'none';
            }, 300);
        }
    });
}

// Sistema de doações
function initializeDonationSystem() {
    const donationButtons = document.querySelectorAll('.btn-secondary');
    
    donationButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            showDonationModal(this.closest('.card'));
        });
    });
}

function showDonationModal(projectCard) {
    const projectTitle = projectCard.querySelector('h3').textContent;
    
    const modal = document.createElement('div');
    modal.className = 'donation-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;
    
    modal.innerHTML = `
        <div class="modal-content" style="
            background: white;
            padding: 30px;
            border-radius: var(--border-radius);
            max-width: 500px;
            width: 90%;
        ">
            <h3>Doar para: ${projectTitle}</h3>
            <form id="donation-form">
                <div class="form-group">
                    <label for="donation-amount">Valor da Doação (R$)</label>
                    <input type="number" id="donation-amount" class="form-control" min="10" value="50" required>
                </div>
                <div class="form-group">
                    <label for="donor-name">Seu Nome</label>
                    <input type="text" id="donor-name" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="donor-email">Seu E-mail</label>
                    <input type="email" id="donor-email" class="form-control" required>
                </div>
                <div class="form-row">
                    <button type="button" class="btn btn-outline" id="cancel-donation">Cancelar</button>
                    <button type="submit" class="btn btn-primary">Confirmar Doação</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Event listeners do modal
    modal.querySelector('#cancel-donation').addEventListener('click', () => {
        modal.remove();
    });
    
    modal.querySelector('#donation-form').addEventListener('submit', function(e) {
        e.preventDefault();
        processDonation(this, projectTitle);
    });
    
    // Fechar modal ao clicar fora
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function processDonation(form, projectTitle) {
    const formData = new FormData(form);
    const amount = formData.get('donation-amount');
    const name = formData.get('donor-name');
    const email = formData.get('donor-email');
    
    const button = form.querySelector('button[type="submit"]');
    const originalText = utils.showLoading(button);
    
    // Simulação de processamento
    setTimeout(() => {
        utils.hideLoading(button, originalText);
        showAlert(`Obrigado, ${name}! Sua doação de R$ ${amount} para "${projectTitle}" foi processada.`, 'success');
        document.querySelector('.donation-modal').remove();
    }, 2000);
}

// Accordion para FAQ
function initializeFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('h3');
        const answer = item.querySelector('p');
        
        // Esconde resposta inicialmente
        answer.style.display = 'none';
        
        question.style.cssText = `
            cursor: pointer;
            position: relative;
            padding-right: 30px;
        `;
        
        // Adiciona ícone
        question.innerHTML += '<span style="position: absolute; right: 0; top: 0;">+</span>';
        
        question.addEventListener('click', function() {
            const isOpen = answer.style.display === 'block';
            const icon = this.querySelector('span');
            
            // Fecha todos os outros
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.querySelector('p').style.display = 'none';
                    otherItem.querySelector('span').textContent = '+';
                }
            });
            
            // Alterna atual
            answer.style.display = isOpen ? 'none' : 'block';
            icon.textContent = isOpen ? '+' : '−';
        });
    });
}

// Compartilhamento em redes sociais
function initializeSocialShare() {
    const shareButtons = document.querySelectorAll('.btn-outline');
    
    shareButtons.forEach(button => {
        if (button.textContent.includes('Compartilhar')) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                shareProject(this.closest('.card'));
            });
        }
    });
}

function shareProject(projectCard) {
    const projectTitle = projectCard.querySelector('h3').textContent;
    const projectDescription = projectCard.querySelector('p').textContent;
    const shareUrl = window.location.href;
    
    const shareText = `Conheça o projeto "${projectTitle}" - ${projectDescription}. Participe você também! ${shareUrl}`;
    
    if (navigator.share) {
        navigator.share({
            title: projectTitle,
            text: shareText,
            url: shareUrl
        });
    } else {
        // Fallback para copiar para área de transferência
        navigator.clipboard.writeText(shareText).then(() => {
            showAlert('Link copiado para a área de transferência!', 'success');
        });
    }
}

// Inicializa compartilhamento quando disponível
if (document.querySelector('.btn-outline')) {
    initializeSocialShare();
}