// Scroll Progress Bar
const scrollProgress = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
  if (totalScroll > 0) {
    const progress = window.scrollY / totalScroll;
    scrollProgress.style.transform = `scaleX(${progress})`;
  }
});

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
      iconMenu.classList.remove('hidden');
      iconClose.classList.add('hidden');
    } else {
      mobileMenu.classList.remove('hidden');
      iconMenu.classList.add('hidden');
      iconClose.classList.remove('hidden');
    }
  });

  // Close mobile menu on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      iconMenu.classList.remove('hidden');
      iconClose.classList.add('hidden');
    });
  });
}

// Scroll Reveal Observer
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, {
  threshold: 0.1
});

revealElements.forEach(el => revealObserver.observe(el));

// Project Tag Filtering
const tagButtons = document.querySelectorAll('.tag-btn');
const projectCards = document.querySelectorAll('.project-card');

tagButtons.forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.getAttribute('data-tag');

    // Update active button state
    tagButtons.forEach(btn => {
      btn.classList.remove('border-primary', 'bg-primary/15', 'text-primary');
      btn.classList.add('border-border', 'text-muted-foreground');
    });
    button.classList.remove('border-border', 'text-muted-foreground');
    button.classList.add('border-primary', 'bg-primary/15', 'text-primary');

    // Filter cards
    projectCards.forEach(card => {
      const cardTag = card.getAttribute('data-tag');
      if (filter === 'TODOS' || cardTag === filter) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  });
});
/// Template stackscards
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

// Template dos Project Cards 1
class ProjectCard extends HTMLElement {
  connectedCallback() {
    const tag = this.getAttribute('tag') || '';
    const title = this.getAttribute('title') || '';
    const tech = this.getAttribute('tech') || '';
    const image = this.getAttribute('image') || '';
    const bodyContent = this.innerHTML;

    this.className = 'project-card block';
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
          <div class="mt-4 text-sm leading-relaxed text-muted-foreground">
            ${bodyContent}
          </div>
        </div>
      </article>
    `;
  }
}
customElements.define('project-card', ProjectCard);

// Template das Info Cards 2 
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