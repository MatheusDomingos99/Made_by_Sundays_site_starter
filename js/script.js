// ========================================
// MOBILE MENU
// ========================================

const mobileMenuButton =
  document.querySelector('.mobile-menu-button');

const mainNav =
  document.querySelector('.nav');


if (mobileMenuButton && mainNav) {

  mobileMenuButton.addEventListener(
    'click',
    () => {

      const isOpen =
        mainNav.classList.toggle('menu-open');


      mobileMenuButton.setAttribute(
        'aria-expanded',
        String(isOpen)
      );


      mobileMenuButton.setAttribute(
        'aria-label',
        isOpen
          ? 'Close menu'
          : 'Open menu'
      );

    }
  );


  // Fecha o menu ao clicar em um link

  const mobileNavLinks =
    mainNav.querySelectorAll(
      '.navlinks a'
    );


  mobileNavLinks.forEach(
    link => {

      link.addEventListener(
        'click',
        () => {

          mainNav.classList.remove(
            'menu-open'
          );


          mobileMenuButton.setAttribute(
            'aria-expanded',
            'false'
          );


          mobileMenuButton.setAttribute(
            'aria-label',
            'Open menu'
          );

        }
      );

    }
  );


  // Fecha com ESC

  document.addEventListener(
    'keydown',
    event => {

      if (
        event.key === 'Escape' &&
        mainNav.classList.contains('menu-open')
      ) {

        mainNav.classList.remove(
          'menu-open'
        );


        mobileMenuButton.setAttribute(
          'aria-expanded',
          'false'
        );


        mobileMenuButton.setAttribute(
          'aria-label',
          'Open menu'
        );

      }

    }
  );


  // Se voltar para desktop,
  // garante que o menu seja resetado.

  window.addEventListener(
    'resize',
    () => {

      if (window.innerWidth > 850) {

        mainNav.classList.remove(
          'menu-open'
        );


        mobileMenuButton.setAttribute(
          'aria-expanded',
          'false'
        );


        mobileMenuButton.setAttribute(
          'aria-label',
          'Open menu'
        );

      }

    }
  );

}

// ========================================
// PROJECTS — HORIZONTAL SCROLL
// ========================================

const projectsCarousel =
  document.querySelector('.projects-carousel');

if (projectsCarousel) {
  const projectsTrack =
    projectsCarousel.querySelector('.projects-track');

  const projectsSectionHead =
    document.querySelector('#work .section-head');

  let projects = [];

// ========================================
// HERO DYNAMIC SLIDESHOW
// ========================================

const heroSlides = Array.from(
  document.querySelectorAll('.hero-slide')
);

if (heroSlides.length > 1) {
  let currentHeroSlide = 0;
  const heroSlideDuration = 5000;

  setInterval(() => {
    heroSlides[currentHeroSlide].classList.remove('active');

    currentHeroSlide =
      (currentHeroSlide + 1) % heroSlides.length;

    heroSlides[currentHeroSlide].classList.add('active');
  }, heroSlideDuration);
}

  // ========================================
  // CRIA A ESTRUTURA DO SCROLL HORIZONTAL
  // ========================================

  const projectsScrollArea =
    document.createElement('div');

  projectsScrollArea.className =
    'projects-scroll-area';

  const projectsSticky =
    document.createElement('div');

  projectsSticky.className =
    'projects-sticky';

  const projectsContainer =
    projectsCarousel.parentNode;

  projectsContainer.insertBefore(
    projectsScrollArea,
    projectsSectionHead || projectsCarousel
  );

  projectsScrollArea.appendChild(
    projectsSticky
  );

  // Mantém o título fixo junto ao banner
  if (projectsSectionHead) {
    projectsSticky.appendChild(
      projectsSectionHead
    );
  }

  projectsSticky.appendChild(
    projectsCarousel
  );

  // ========================================
  // CARREGA OS PROJETOS
  // ========================================

  fetch('projects.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(
          'Could not load projects.json'
        );
      }

      return response.json();
    })

    .then(projectData => {
      projects = projectData;

      if (!projectsTrack) {
        return;
      }

// ========================================
// CRIA OS PROJETOS — DESKTOP BEFORE / AFTER
// ========================================

projects.forEach((project, i) => {
  const slide = document.createElement('article');

  slide.className = 'project-slide';

  const projectId = String(project.id).padStart(2, '0');

  slide.innerHTML = `
<div class="project-gallery">
  <div class="project-image project-before">
    <span class="project-label">Before</span>
    <img src="assets/images/projects/project_${projectId}_before.png" alt="${project.title} before custom furniture">
  </div>

  <div class="project-image project-gap" aria-hidden="true"></div>

  <div class="project-image project-after">
    <span class="project-label">After</span>
    <img src="assets/images/projects/project_${projectId}_after.png" alt="${project.title} after custom furniture">
  </div>

  <div class="project-image-divider" aria-hidden="true">
    <span>→</span>
  </div>
</div>

      <button
        class="project-image-divider"
        type="button"
        aria-label="Before and after comparison"
      >
        <span>‹</span>
        <span>›</span>
      </button>

    </div>

    <div class="project-info">

      <span class="project-number">
        ${String(i + 1).padStart(2, '0')} /
        ${String(projects.length).padStart(2, '0')}
      </span>

      <span class="project-gold-line"></span>

      <h3>${project.title}</h3>

      <p class="project-description">
        ${project.description}
      </p>

      <div class="project-features">

        <div class="project-feature">
          <span class="feature-icon">□</span>
          <div>
            <strong>MAXIMISED STORAGE</strong>
            <p>Everything in its place.</p>
          </div>
        </div>

        <div class="project-feature">
          <span class="feature-icon">⌗</span>
          <div>
            <strong>MORE FLOOR SPACE</strong>
            <p>A room that breathes.</p>
          </div>
        </div>

        <div class="project-feature">
          <span class="feature-icon">⌂</span>
          <div>
            <strong>A CALMER EVERYDAY</strong>
            <p>Function meets comfort.</p>
          </div>
        </div>

      </div>

    </div>
  `;

  projectsTrack.appendChild(slide);
});
      // ========================================
      // DIMENSIONA A ÁREA HORIZONTAL
      // ========================================

      function updateScrollHeight() {
        const horizontalDistance =
          Math.max(
            0,
            projectsTrack.scrollWidth -
            projectsCarousel.clientWidth
          );

        projectsScrollArea.style.setProperty(
          '--projects-scroll-height',
          `${window.innerHeight + horizontalDistance}px`
        );

        updateHorizontalPosition();
      }

      // ========================================
      // MOVE OS PROJETOS CONFORME O SCROLL
      // ========================================

      function updateHorizontalPosition() {
        const totalScrollDistance =
          projectsScrollArea.offsetHeight -
          window.innerHeight;

        if (totalScrollDistance <= 0) {
          projectsTrack.style.transform =
            'translate3d(0, 0, 0)';

          return;
        }

        const areaRect =
          projectsScrollArea.getBoundingClientRect();

        const currentScroll =
          Math.max(0, -areaRect.top);

        const progress =
          Math.min(
            1,
            currentScroll / totalScrollDistance
          );

        const horizontalDistance =
          Math.max(
            0,
            projectsTrack.scrollWidth -
            projectsCarousel.clientWidth
          );

        const translateX =
          horizontalDistance * progress;

        projectsTrack.style.transform =
          `translate3d(-${translateX}px, 0, 0)`;
      }

      // ========================================
      // SCROLL
      // ========================================

      let ticking = false;

      window.addEventListener(
        'scroll',
        () => {
          if (!ticking) {
            window.requestAnimationFrame(() => {
              updateHorizontalPosition();
              ticking = false;
            });

            ticking = true;
          }
        },
        { passive: true }
      );

      // ========================================
      // REDIMENSIONAMENTO
      // ========================================

      window.addEventListener(
        'resize',
        () => {
          updateScrollHeight();
        }
      );

      // ========================================
      // INICIALIZA
      // ========================================

      updateScrollHeight();
    })

    .catch(error => {
      console.error(
        'Error loading projects:',
        error
      );
    });
}


// ========================================
// IDEAS & POSSIBILITIES
// ========================================

// O site procura automaticamente por
// idea_01.png até idea_50.png.
//
// Para cada imagem desktop:
// idea_01.png
//
// o site procura:
// idea_01_mobile.png
//
// Em telas de até 767px,
// usa a versão mobile.


// ========================================
// ELEMENTOS
// ========================================

const ideasSlidesContainer =
  document.querySelector(
    '.ideas-slides'
  );

const ideaDots =
  document.querySelector(
    '.idea-dots'
  );

const ideaPrev =
  document.querySelector(
    '.idea-prev'
  );

const ideaNext =
  document.querySelector(
    '.idea-next'
  );

const ideasNavigation =
  document.querySelector(
    '.ideas-navigation'
  );

let currentIdea = 0;


// ========================================
// IDEAS
// ========================================

if (ideasSlidesContainer) {

  const ideaFiles = [];


  // ========================================
  // GERA IDEA_01 ATÉ IDEA_50
  // ========================================

  for (
    let i = 1;
    i <= 50;
    i++
  ) {

    ideaFiles.push(
      `idea_${String(i).padStart(2, '0')}.png`
    );

  }


  // ========================================
  // VERIFICA IMAGENS DESKTOP
  // ========================================

  const imageChecks =
    ideaFiles.map(
      fileName => {

        return new Promise(
          resolve => {

            const image =
              new Image();


            image.onload =
              () => {

                resolve(
                  fileName
                );

              };


            image.onerror =
              () => {

                resolve(null);

              };


            image.src =
              `assets/images/ideas%20%26%20possibilities/${fileName}`;

          }
        );

      }
    );


  Promise.all(imageChecks)

    .then(
      existingFiles => {

        const validIdeaFiles =
          existingFiles.filter(
            fileName =>
              fileName !== null
          );


        // ========================================
        // CRIA OS SLIDES
        // ========================================

        validIdeaFiles.forEach(
          (fileName, i) => {

            const slide =
              document.createElement(
                'article'
              );


            slide.className =
              'idea-slide' +
              (
                i === 0
                  ? ' active'
                  : ''
              );


            const gallery =
              document.createElement(
                'div'
              );


            gallery.className =
              'idea-gallery';


            // ========================================
            // PICTURE
            // ========================================

            const picture =
              document.createElement(
                'picture'
              );


            // ========================================
            // MOBILE IMAGE
            // ========================================

            const mobileSource =
              document.createElement(
                'source'
              );


            mobileSource.media =
              '(max-width: 767px)';


            mobileSource.srcset =
              `assets/images/ideas%20%26%20possibilities/${fileName.replace(
                '.png',
                '_mobile.png'
              )}`;


            // ========================================
            // DESKTOP IMAGE / FALLBACK
            // ========================================

            const image =
              document.createElement(
                'img'
              );


            image.src =
              `assets/images/ideas%20%26%20possibilities/${fileName}`;


            image.alt =
              `Custom furniture idea ${String(i + 1).padStart(2, '0')}`;


            picture.appendChild(
              mobileSource
            );


            picture.appendChild(
              image
            );


            gallery.appendChild(
              picture
            );


            slide.appendChild(
              gallery
            );


            ideasSlidesContainer.appendChild(
              slide
            );

          }
        );


        // ========================================
        // IDEA SLIDES
        // ========================================

        const ideaSlides =
          Array.from(
            document.querySelectorAll(
              '.idea-slide'
            )
          );


        // ========================================
        // IDEA DOTS
        // ========================================

        validIdeaFiles.forEach(
          (fileName, i) => {

            const dot =
              document.createElement(
                'button'
              );


            dot.className =
              'idea-dot' +
              (
                i === 0
                  ? ' active'
                  : ''
              );


            dot.type =
              'button';


            dot.setAttribute(
              'aria-label',
              `Idea ${i + 1}`
            );


            dot.addEventListener(
              'click',
              () => showIdea(i)
            );


            ideaDots.appendChild(
              dot
            );

          }
        );


        const ideaDotElements =
          Array.from(
            document.querySelectorAll(
              '.idea-dot'
            )
          );


        // ========================================
        // CONFIGURAÇÃO DA ROLETA
        // ========================================

        let ideaDotStart = 0;


        // ========================================
        // QUANTAS BOLINHAS CABEM
        // ========================================

        function getVisibleDotCount() {

          if (
            window.innerWidth <= 380
          ) {

            return 4;

          }


          if (
            window.innerWidth <= 767
          ) {

            return 5;

          }


          return 7;

        }


        // ========================================
        // CRIA A JANELA DA ROLETA
        // ========================================

        const ideaDotsViewport =
          document.createElement(
            'div'
          );


        ideaDotsViewport.className =
          'idea-dots-viewport';


        const ideaDotsTrack =
          document.createElement(
            'div'
          );


        ideaDotsTrack.className =
          'idea-dots-track';


        ideaDotElements.forEach(
          dot => {

            ideaDotsTrack.appendChild(
              dot
            );

          }
        );


        ideaDotsViewport.appendChild(
          ideaDotsTrack
        );


        ideaDots.appendChild(
          ideaDotsViewport
        );


        // ========================================
        // SHOW IDEA
        // ========================================

        function showIdea(index) {

          if (
            !ideaSlides.length
          ) {

            return;

          }


          const previousIdea =
            currentIdea;


          currentIdea =
            (
              index + ideaSlides.length
            ) %
            ideaSlides.length;


          ideaSlides.forEach(
            (slide, i) => {

              slide.classList.toggle(
                'active',
                i === currentIdea
              );

            }
          );


          const activeIdea =
            ideaSlides[currentIdea];


          // ========================================
          // MOVE NAVIGATION
          // PARA DENTRO DO SLIDE ATIVO
          // ========================================

          if (
            activeIdea &&
            ideasNavigation
          ) {

            activeIdea.appendChild(
              ideasNavigation
            );

          }


          // ========================================
          // ROLETA DOS DOTS
          // ========================================

          const totalIdeas =
            ideaDotElements.length;


          const visibleDots =
            getVisibleDotCount();


          if (
            totalIdeas <=
            visibleDots
          ) {

            ideaDotStart = 0;

          } else {

            // ========================================
            // AVANÇANDO
            // ========================================

            if (
              currentIdea >=
              ideaDotStart +
              visibleDots
            ) {

              ideaDotStart =
                currentIdea -
                visibleDots +
                1;

            }


            // ========================================
            // VOLTANDO
            // ========================================

            if (
              currentIdea <
              ideaDotStart
            ) {

              ideaDotStart =
                currentIdea;

            }


            // ========================================
            // LOOP PARA FRENTE
            // ========================================

            if (
              previousIdea ===
              totalIdeas - 1 &&
              currentIdea === 0
            ) {

              ideaDotStart = 0;

            }


            // ========================================
            // LOOP PARA TRÁS
            // ========================================

            if (
              previousIdea === 0 &&
              currentIdea ===
              totalIdeas - 1
            ) {

              ideaDotStart =
                Math.max(
                  0,
                  totalIdeas -
                  visibleDots
                );

            }


            // ========================================
            // LIMITES
            // ========================================

            ideaDotStart =
              Math.max(
                0,
                Math.min(
                  ideaDotStart,
                  totalIdeas -
                  visibleDots
                )
              );

          }


          // ========================================
          // ATUALIZA DOTS
          // ========================================

          ideaDotElements.forEach(
            (dot, i) => {

              dot.classList.toggle(
                'active',
                i === currentIdea
              );

            }
          );


          // ========================================
          // MOVE A ROLETA
          // ========================================

          if (
            totalIdeas >
            visibleDots
          ) {

            const firstDot =
              ideaDotElements[0];


            if (firstDot) {

              const dotStyle =
                window.getComputedStyle(
                  firstDot
                );


              const dotWidth =
                parseFloat(
                  dotStyle.width
                );


              const trackStyle =
                window.getComputedStyle(
                  ideaDotsTrack
                );


              const gap =
                parseFloat(
                  trackStyle.columnGap ||
                  trackStyle.gap ||
                  8
                );


              const offset =
                ideaDotStart *
                (
                  dotWidth +
                  gap
                );


              ideaDotsTrack.style.transform =
                `translateX(-${offset}px)`;

            }

          } else {

            ideaDotsTrack.style.transform =
              'translateX(0)';

          }

        }


        // ========================================
        // RECALCULA AO REDIMENSIONAR
        // ========================================

        let resizeTimer;


        window.addEventListener(
          'resize',
          () => {

            clearTimeout(
              resizeTimer
            );


            resizeTimer =
              setTimeout(
                () => {

                  showIdea(
                    currentIdea
                  );

                },
                100
              );

          }
        );


        // ========================================
        // IDEA PREVIOUS
        // ========================================

        if (ideaPrev) {

          ideaPrev.addEventListener(
            'click',
            () => {

              showIdea(
                currentIdea - 1
              );

            }
          );

        }


        // ========================================
        // IDEA NEXT
        // ========================================

        if (ideaNext) {

          ideaNext.addEventListener(
            'click',
            () => {

              showIdea(
                currentIdea + 1
              );

            }
          );

        }


        // ========================================
        // INITIAL IDEA
        // ========================================

        showIdea(0);

      }
    );

    // ========================================
// HERO CONTACT — REPLAY ANIMATION
// ========================================

const heroContact = document.querySelector('.hero-contact');

if (heroContact) {
  const heroContactObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          heroContact.classList.remove('is-visible');

          void heroContact.offsetWidth;

          heroContact.classList.add('is-visible');
        } else {
          heroContact.classList.remove('is-visible');
        }
      });
    },
    {
      threshold: 0.2
    }
  );

  heroContactObserver.observe(heroContact);
}

}