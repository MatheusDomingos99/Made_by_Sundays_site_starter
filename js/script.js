// ========================================
// PROJECTS
// ========================================


const projectsCarousel =
  document.querySelector('.projects-carousel');


const projectPrev =
  document.querySelector('.project-prev');


const projectNext =
  document.querySelector('.project-next');


const projectsNavigation =
  document.querySelector('.projects-navigation');


let projects = [];
let currentProject = 0;


// ========================================
// CARREGA OS PROJETOS
// ========================================


fetch('projects.json')
  .then(response => {

    if (!response.ok) {
      throw new Error('Could not load projects.json');
    }


    return response.json();

  })


  .then(projectData => {

    projects = projectData;


    // ========================================
    // CRIA OS PROJETOS
    // ========================================

    projects.forEach((project, i) => {

      const slide =
        document.createElement('article');


      slide.className =
        'project-slide' +
        (i === 0 ? ' active' : '');


      slide.innerHTML = `

        <div class="project-gallery">

          <div class="project-image active">

            <img
              src="assets/images/projects/project_${String(project.id).padStart(2, '0')}_before.png"
              alt="${project.title} before">

          </div>


          <div class="project-image">

            <img
              src="assets/images/projects/project_${String(project.id).padStart(2, '0')}_after.png"
              alt="${project.title} after">

          </div>

        </div>


        <div class="project-info">

          <div>

            <span class="project-number">
              ${String(i + 1).padStart(2, '0')} /
              ${String(projects.length).padStart(2, '0')}
            </span>

            <h3>
              ${project.title}
            </h3>

            <p>
              ${project.description}
            </p>

          </div>

        </div>

      `;


      projectsCarousel.insertBefore(
        slide,
        projectsNavigation
      );

    });


    // ========================================
    // SHOW PROJECT
    // ========================================

    function showProject(index) {

      if (!projects.length) return;


      currentProject =
        (index + projects.length) %
        projects.length;


      const projectSlides =
        Array.from(
          document.querySelectorAll(
            '.project-slide'
          )
        );


      projectSlides.forEach(
        (slide, i) => {

          slide.classList.toggle(
            'active',
            i === currentProject
          );

        }
      );


      // ========================================
      // PROJETO ATIVO
      // ========================================

      const activeProject =
        projectSlides[currentProject];


      // ========================================
      // MOVE A NAVEGAÇÃO
      // PARA DENTRO DO PROJETO ATIVO
      // ========================================

      if (
        activeProject &&
        projectsNavigation
      ) {

        const projectInfo =
          activeProject.querySelector(
            '.project-info'
          );


        activeProject.insertBefore(
          projectsNavigation,
          projectInfo
        );

      }


      // ========================================
      // SEMPRE COMEÇA NO BEFORE
      // ========================================

      const images =
        activeProject.querySelectorAll(
          '.project-image'
        );


      const buttons =
        document.querySelectorAll(
          '.projects-navigation .image-nav'
        );


      images.forEach(
        (image, i) => {

          image.classList.toggle(
            'active',
            i === 0
          );

        }
      );


      buttons.forEach(
        (button, i) => {

          const active =
            i === 0;


          button.classList.toggle(
            'active',
            active
          );


          button.setAttribute(
            'aria-pressed',
            String(active)
          );

        }
      );

    }


    // ========================================
    // PROJECT NAVIGATION
    // ========================================

    if (projectPrev) {

      projectPrev.addEventListener(
        'click',
        () => {

          showProject(
            currentProject - 1
          );

        }
      );

    }


    if (projectNext) {

      projectNext.addEventListener(
        'click',
        () => {

          showProject(
            currentProject + 1
          );

        }
      );

    }


    // ========================================
    // PROJECT SLIDES
    // ========================================

    const projectSlides =
      Array.from(
        document.querySelectorAll(
          '.project-slide'
        )
      );


    // ========================================
    // BEFORE / AFTER CENTRAL
    // ========================================

    const navigationButtons =
      Array.from(
        document.querySelectorAll(
          '.projects-navigation .image-nav'
        )
      );


    navigationButtons.forEach(
      (button, i) => {

        button.addEventListener(
          'click',
          () => {

            const activeProject =
              projectSlides[currentProject];


            if (!activeProject) return;


            const images =
              activeProject.querySelectorAll(
                '.project-image'
              );


            images.forEach(
              (image, imageIndex) => {

                image.classList.toggle(
                  'active',
                  imageIndex === i
                );

              }
            );


            navigationButtons.forEach(
              (navButton, buttonIndex) => {

                const active =
                  buttonIndex === i;


                navButton.classList.toggle(
                  'active',
                  active
                );


                navButton.setAttribute(
                  'aria-pressed',
                  String(active)
                );

              }
            );

          }
        );

      }
    );


    // ========================================
    // BEFORE / AFTER + SWIPE
    // ========================================

    projectSlides.forEach(
      projectSlide => {

        const images =
          Array.from(
            projectSlide.querySelectorAll(
              '.project-image'
            )
          );


        const gallery =
          projectSlide.querySelector(
            '.project-gallery'
          );


        let currentImage = 0;

        let startX = 0;

        let dragging = false;


        // ========================================
        // SHOW IMAGE
        // ========================================

        function showImage(index) {

          currentImage =
            (index + images.length) %
            images.length;


          images.forEach(
            (image, i) => {

              image.classList.toggle(
                'active',
                i === currentImage
              );

            }
          );


          navigationButtons.forEach(
            (button, i) => {

              const active =
                i === currentImage;


              button.classList.toggle(
                'active',
                active
              );


              button.setAttribute(
                'aria-pressed',
                String(active)
              );

            }
          );

        }


        // ========================================
        // SWIPE
        // ========================================

        gallery.addEventListener(
          'pointerdown',
          event => {

            if (
              event.pointerType === 'mouse' &&
              event.button !== 0
            ) {

              return;

            }


            startX =
              event.clientX;


            dragging =
              true;

          }
        );


        gallery.addEventListener(
          'pointerup',
          event => {

            if (!dragging) return;


            dragging =
              false;


            const distance =
              event.clientX - startX;


            if (
              Math.abs(distance) > 50
            ) {

              showImage(
                currentImage +
                (
                  distance < 0
                    ? 1
                    : -1
                )
              );

            }

          }
        );


        gallery.addEventListener(
          'pointercancel',
          () => {

            dragging =
              false;

          }
        );


        // ========================================
        // COMEÇA NO BEFORE
        // ========================================

        showImage(0);

      }
    );


    // ========================================
    // MOSTRA O PRIMEIRO PROJETO
    // ========================================

    showProject(0);

  })


  // ========================================
  // PROJECT ERROR
  // ========================================

  .catch(error => {

    console.error(
      'Error loading projects:',
      error
    );

  });



// ========================================
// IDEAS & POSSIBILITIES
// ========================================

// O site procura automaticamente por
// idea_01.png até idea_50.png.
// Só as imagens desktop que realmente existirem
// na pasta serão exibidas.
//
// Para cada imagem desktop:
//
// idea_01.png
//
// o site procura automaticamente:
//
// idea_01_mobile.png
//
// Em telas de até 767px,
// o navegador usa a versão mobile.
// Em telas maiores,
// usa a versão desktop.


// ========================================
// ELEMENTOS
// ========================================


const ideasSlidesContainer =
  document.querySelector('.ideas-carousel');


const ideaDots =
  document.querySelector('.idea-dots');


const ideaPrev =
  document.querySelector('.idea-prev');


const ideaNext =
  document.querySelector('.idea-next');


const ideasNavigation =
  document.querySelector('.ideas-navigation');


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
              `assets/images/ideas%20%26%20possibilities/${fileName.replace('.png', '_mobile.png')}`;


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
        // DESCOBRE QUANTAS BOLINHAS CABEM
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


        // Move todas as bolinhas existentes
        // para dentro da pista da roleta.

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
            (index + ideaSlides.length) %
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


          if (
            activeIdea &&
            ideasNavigation
          ) {

            activeIdea.appendChild(
              ideasNavigation
            );

          }


          // ========================================
          // ROLETA DAS BOLINHAS
          // ========================================

          const totalIdeas =
            ideaDotElements.length;


          const visibleDots =
            getVisibleDotCount();


          // Se todas as ideias cabem na janela,
          // não precisamos deslocar a roleta.

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
          // ATUALIZA ESTADO DAS BOLINHAS
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
        // RECALCULA A ROLETA AO REDIMENSIONAR
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
        // IDEA NAVIGATION
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

}