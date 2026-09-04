// Scroll Progress Bar
const scrollProgress = document.getElementById('scroll-progress');
if (scrollProgress) {
  window.addEventListener('scroll', () => {
    const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (totalScroll > 0) {
      const progress = window.scrollY / totalScroll;
      scrollProgress.style.transform = `scaleX(${progress})`;
    }
  });
}

// Mobile Menu Toggle
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const iconMenu = document.getElementById('icon-menu');
const iconClose = document.getElementById('icon-close');

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener('click', () => {
    const isOpen = !mobileMenu.classList.contains('hidden');
    if (isOpen) {
      mobileMenu.classList.add('hidden');
      if (iconMenu) iconMenu.classList.remove('hidden');
      if (iconClose) iconClose.classList.add('hidden');
    } else {
      mobileMenu.classList.remove('hidden');
      if (iconMenu) iconMenu.classList.add('hidden');
      if (iconClose) iconClose.classList.remove('hidden');
    }
  });

  // Close mobile menu on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      if (iconMenu) iconMenu.classList.remove('hidden');
      if (iconClose) iconClose.classList.add('hidden');
    });
  });
}

// Scroll Reveal Observer
const revealElements = document.querySelectorAll('.reveal');
if (revealElements.length > 0) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => revealObserver.observe(el));
}

// Project Tag Filtering
const tagButtons = document.querySelectorAll('.tag-btn');
tagButtons.forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.getAttribute('data-tag');
    const projectCards = document.querySelectorAll('project-card, .project-card');

    // Update active button state
    tagButtons.forEach(btn => {
      btn.classList.remove('border-primary', 'bg-primary/15', 'text-primary');
      btn.classList.add('border-border', 'text-muted-foreground');
    });
    button.classList.remove('border-border', 'text-muted-foreground');
    button.classList.add('border-primary', 'bg-primary/15', 'text-primary');

    // Filter cards
    projectCards.forEach(card => {
      const cardTag = card.getAttribute('data-tag') || card.getAttribute('tag');
      if (filter === 'TODOS' || cardTag === filter) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// Componente: TechCard
class TechCard extends HTMLElement {
  connectedCallback() {
    const icon = this.getAttribute('icon') || '';
    const name = this.getAttribute('name') || '';

    this.innerHTML = `
      <div class="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-card/40 p-5 text-center transition-all hover:-translate-y-1 hover:border-primary/50 hover:bg-primary/5">
        <img src="${icon}" alt="${name}" class="h-9 w-9 object-contain" />
        <span class="text-xs font-semibold leading-tight">${name}</span>
      </div>
    `;
  }
}
customElements.define('tech-card', TechCard);

// Componente: ProjectCard
class ProjectCard extends HTMLElement {
  connectedCallback() {
    const tag = this.getAttribute('tag') || '';
    const title = this.getAttribute('title') || '';
    const tech = this.getAttribute('tech') || '';
    const image = this.getAttribute('image') || '';
    const bodyContent = this.innerHTML;

    this.className = 'project-card block cursor-pointer h-full';
    this.setAttribute('data-tag', tag);

    this.innerHTML = `
      <article class="group relative overflow-hidden rounded-2xl border border-border bg-card/40 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_0_50px_hsl(var(--primary)/0.1)] h-full flex flex-col justify-between">
        <div>
          <div class="flex items-start justify-between gap-3">
            <h3 class="text-lg font-bold leading-tight">${title}</h3>
            <span class="shrink-0 rounded-full border border-primary/30 px-2.5 py-0.5 font-mono text-[9px] tracking-[0.15em] text-primary">
              ${tag}
            </span>
          </div>
          ${image ? `<img src="${image}" alt="${title}" class="mt-4 h-48 w-full rounded-xl object-cover object-top" />` : ''}
          <p class="mt-2 font-mono text-[11px] text-accent">${tech}</p>
          <div class="mt-4 text-sm leading-relaxed text-muted-foreground line-clamp-3">
            ${bodyContent}
          </div>
        </div>
        <div class="mt-4 font-mono text-[11px] text-primary flex items-center gap-1 opacity-80 group-hover:opacity-100">
          <span>&gt;_ Clique para ver detalhes e fotos</span>
        </div>
      </article>
    `;

    this.addEventListener('click', (e) => {
      // Impede que links dentro do card fechem ou abram o modal diretamente
      if (e.target.closest('a')) return;
      openProjectModal({ title, tag, tech, image, content: bodyContent });
    });
  }
}
customElements.define('project-card', ProjectCard);

// Modal Global dos Projetos (com Animação Scale/Pop)
function openProjectModal({ title, tag, tech, image, content }) {
  let existingModal = document.getElementById('project-modal-container');
  if (existingModal) existingModal.remove();

  // Desativa scroll do fundo
  document.body.style.overflow = 'hidden';

  const modal = document.createElement('div');
  modal.id = 'project-modal-container';
  modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md transition-opacity duration-300 opacity-0';
  
  modal.innerHTML = `
    <div id="project-modal-backdrop" class="absolute inset-0"></div>
    <div class="modal-box relative w-full max-w-2xl max-h-[90vh] bg-card border border-border rounded-2xl shadow-2xl p-6 sm:p-8 overflow-y-auto z-10 flex flex-col justify-between transform scale-90 opacity-0 transition-all duration-300 ease-out">
      <div>
        <div class="flex items-start justify-between gap-4 border-b border-border pb-4">
          <div>
            <span class="rounded-full border border-primary/30 px-2.5 py-0.5 font-mono text-[10px] tracking-[0.15em] text-primary">${tag}</span>
            <h2 class="mt-2 text-2xl font-bold leading-tight text-foreground">${title}</h2>
          </div>
          <button id="modal-close-btn" aria-label="Fechar" class="rounded-lg border border-border p-2 text-muted-foreground hover:text-foreground hover:border-primary transition-colors">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        <div class="mt-6 space-y-4">
          ${image ? `
            <img id="modal-main-img" src="${image}" alt="${title}" class="w-full h-64 sm:h-72 rounded-xl object-cover object-top border border-border shadow-md transition-all duration-200" />
            <div class="grid grid-cols-3 gap-2">
              <img src="${image}" alt="Thumb 1" class="gallery-thumb w-full h-20 rounded-lg object-cover object-top border border-primary cursor-pointer transition-all hover:opacity-80" />
              <img src="assets/foto_time.png" alt="Thumb 2" class="gallery-thumb w-full h-20 rounded-lg object-cover object-top border border-border cursor-pointer transition-all hover:opacity-80" />
              <img src="assets/fluxo_camps.png" alt="Thumb 3" class="gallery-thumb w-full h-20 rounded-lg object-cover object-top border border-border cursor-pointer transition-all hover:opacity-80" />
            </div>
          ` : ''}
        </div>
        
        <p class="mt-4 font-mono text-xs text-accent">${tech}</p>
        
        <div class="mt-4 text-sm sm:text-base leading-relaxed text-muted-foreground space-y-3">
          ${content}
        </div>
      </div>
      
      <div class="mt-8 pt-4 border-t border-border flex items-center justify-between font-mono text-xs text-muted-foreground">
        <span>Ulisses de Pinho · Detalhes do Projeto</span>
        <button id="modal-close-footer" class="rounded-lg bg-primary/10 border border-primary/30 px-4 py-2 text-primary hover:bg-primary/20 transition-colors">Fechar</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Troca das Imagens da Galeria
  const mainImg = modal.querySelector('#modal-main-img');
  const thumbs = modal.querySelectorAll('.gallery-thumb');
  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      if (mainImg) mainImg.src = thumb.src;
      thumbs.forEach(t => t.classList.replace('border-primary', 'border-border'));
      thumb.classList.replace('border-border', 'border-primary');
    });
  });

  // Animação de Entrada ("pra frente")
  requestAnimationFrame(() => {
    modal.classList.remove('opacity-0');
    const box = modal.querySelector('.modal-box');
    box.classList.remove('scale-90', 'opacity-0');
    box.classList.add('scale-100', 'opacity-100');
  });

  // Função de Fechar com Animação de Saída
  const closeModal = () => {
    const box = modal.querySelector('.modal-box');
    modal.classList.add('opacity-0');
    box.classList.remove('scale-100', 'opacity-100');
    box.classList.add('scale-90', 'opacity-0');

    setTimeout(() => {
      modal.remove();
      document.body.style.overflow = '';
      window.removeEventListener('keydown', escHandler);
    }, 200);
  };

  modal.querySelector('#project-modal-backdrop').addEventListener('click', closeModal);
  modal.querySelector('#modal-close-btn').addEventListener('click', closeModal);
  modal.querySelector('#modal-close-footer').addEventListener('click', closeModal);

  const escHandler = (e) => {
    if (e.key === 'Escape') closeModal();
  };
  window.addEventListener('keydown', escHandler);
}

// Componente: InfoCard
class InfoCard extends HTMLElement {
  connectedCallback() {
    const title = this.getAttribute('title') || '';
    const color = this.getAttribute('color') || 'text-primary';
    const bodyContent = this.innerHTML;

    this.innerHTML = `
      <div class="rounded-2xl border border-border bg-card/50 p-5">
        <h3 class="font-mono text-[11px] tracking-[0.2em] ${color}">${title}</h3>
        <div class="mt-3">
          ${bodyContent}
        </div>
      </div>
    `;
  }
}
customElements.define('info-card', InfoCard);