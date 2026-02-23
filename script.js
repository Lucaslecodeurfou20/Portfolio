document.addEventListener('DOMContentLoaded', () => {
    if (typeof projectsData !== 'undefined') {
        initApp();
    } else {
        console.error('projectsData is not defined. Make sure data.js is included.');
    }

    initBurgerMenu();

    function initApp() {
        if (document.getElementById('latest-projects')) {
            loadLatestProjects();
        }

        if (document.getElementById('projectsGrid')) {
            loadAllProjects();
        }

        if (document.querySelector('.project-detail-section')) {
            loadProjectDetails();
        }
    }

    function initBurgerMenu() {
        const burger = document.querySelector('.burger-menu');
        const nav = document.querySelector('.nav-links');
        const navLinksItems = document.querySelectorAll('.nav-links li');

        if (burger && nav) {
            burger.addEventListener('click', () => {
                nav.classList.toggle('nav-active');
                burger.classList.toggle('toggle');
            });
            navLinksItems.forEach(link => {
                link.addEventListener('click', () => {
                    nav.classList.remove('nav-active');
                    burger.classList.remove('toggle');
                });
            });
        }
    }


    function loadLatestProjects() {
        const sortedProjects = [...projectsData].sort((a, b) => {
            return b.annee.localeCompare(a.annee);
        }).slice(0, 5);

        const track = document.querySelector('#latest-projects .carousel-track');
        if (!track) return;

        track.innerHTML = '';

        sortedProjects.forEach(project => {
            const slide = document.createElement('li');
            slide.classList.add('carousel-slide');
            const isVideo = project.image.toLowerCase().endsWith('.mp4');
            const tags = Array.isArray(project.tag) ? project.tag : [project.tag];
            const tagsHtml = tags.map(tag => `<span class="card-tag">${tag}</span>`).join('');
            const tagsContainer = `<div class="card-tags-container">${tagsHtml}</div>`;

            let mediaHtml = '';

            if (isVideo) {
                mediaHtml = `
                    <div class="project-media-container">
                        <video src="${project.image}" class="project-video" muted loop playsinline></video>
                        ${tagsContainer}
                    </div>
                `;
            } else {
                mediaHtml = `
                    <div class="project-media-container">
                        <img src="${project.image}" alt="${project.Nom_du_projet}" class="project-image" style="object-fit: cover;">
                        ${tagsContainer}
                    </div>
                `;
            }

            slide.innerHTML = `
                <a href="projet_template.html?id=${project.id}" class="project-link">
                    <div class="project-card glass">
                        ${mediaHtml}
                        <div class="project-info">
                            <h3>${project.Nom_du_projet}</h3>
                            <p>${project.text_preview}</p>
                        </div>
                    </div>
                </a>
            `;
            track.appendChild(slide);
            if (isVideo) {
                setupVideoHover(slide);
            }
        });
        if (track.children.length > 0) {
            track.children[0].classList.add('current-slide');
        }
        initCarousel();
    }

    function loadAllProjects() {
        const projectsGrid = document.getElementById('projectsGrid');
        if (!projectsGrid) return;

        projectsGrid.innerHTML = '';
        allProjects = [];

        projectsData.forEach(project => {
            const tags = Array.isArray(project.tag) ? project.tag : [project.tag];
            const dataCategory = tags.join(' ');

            const projectLink = document.createElement('a');
            projectLink.href = `projet_template.html?id=${project.id}`;
            projectLink.classList.add('project-link');
            projectLink.setAttribute('data-category', dataCategory);
            projectLink.setAttribute('data-title', project.Nom_du_projet);
            const tagsHtml = tags.map(tag => `<span class="card-tag">${tag}</span>`).join('');
            const tagsContainer = `<div class="card-tags-container">${tagsHtml}</div>`;
            const isVideo = project.image.toLowerCase().endsWith('.mp4');
            let mediaContent = '';

            if (isVideo) {
                mediaContent = `
                    <div class="project-media-container">
                        <video src="${project.image}" class="project-video" muted loop playsinline></video>
                        ${tagsContainer}
                    </div>
                 `;
            } else {
                mediaContent = `
                    <div class="project-media-container">
                        <img src="${project.image}" alt="${project.Nom_du_projet}" class="project-video" style="object-fit: cover;">
                        ${tagsContainer}
                    </div>
                 `;
            }

            projectLink.innerHTML = `
                <div class="glass project-card">
                    ${mediaContent}
                    <div class="project-info">
                        <h4>${project.Nom_du_projet}</h4>
                        <p>${project.text_preview}</p>
                    </div>
                </div>
            `;
            projectsGrid.appendChild(projectLink);
            allProjects.push(projectLink);
            if (isVideo) {
                setupVideoHover(projectLink);
            }
        });
        initSearchFilterPagination();
    }
    function setupVideoHover(container) {
        const video = container.querySelector('video');

        container.addEventListener('mouseenter', () => {
            video.play().catch(e => console.log('Autoplay prevented:', e));
        });

        container.addEventListener('mouseleave', () => {
            video.pause();
            video.currentTime = 0;
        });
    }

    function loadProjectDetails() {
        const urlParams = new URLSearchParams(window.location.search);
        const projectId = urlParams.get('id');

        if (!projectId) return;

        const project = projectsData.find(p => p.id == projectId);

        if (!project) {
            console.error('Project not found');
            const header = document.querySelector('.project-header-content');
            if (header) header.innerHTML = '<h1>Projet non trouvé</h1>';
            return;
        }
        document.title = `${project.Nom_du_projet} - Portfolio Lucas Porcaro`;
        const logiciels = project.logiciels || project.logiciel || [];
        const logicielsString = Array.isArray(logiciels) ? logiciels.join(', ') : logiciels;
        const metaContainer = document.querySelector('.project-meta');
        if (metaContainer) {
            metaContainer.innerHTML = `
                <span class="tag">${logicielsString}</span>
                <span class="tag">Année ${project.annee}</span>
            `;
        }

        const isVideo = project.image.toLowerCase().endsWith('.mp4');
        const mediaContainer = document.querySelector('.project-header-content');
        const existingImg = document.querySelector('.project-main-image');

        if (existingImg && mediaContainer) {
            if (isVideo) {
                const videoEl = document.createElement('video');
                videoEl.src = project.image;
                videoEl.className = 'project-main-image';
                videoEl.controls = true;
                videoEl.autoplay = false;
                videoEl.style.width = '100%';
                videoEl.style.height = 'auto';
                videoEl.style.maxHeight = '600px';
                videoEl.style.objectFit = 'contain';
                videoEl.style.borderRadius = '8px';
                videoEl.style.marginBottom = '2rem';

                mediaContainer.replaceChild(videoEl, existingImg);
            } else {
                if (existingImg.tagName === 'VIDEO') {
                    const newImg = document.createElement('img');
                    newImg.className = 'project-main-image';
                    newImg.style.width = '100%';
                    newImg.style.height = '300px';
                    newImg.style.objectFit = 'cover';
                    newImg.style.borderRadius = '8px';
                    newImg.style.marginBottom = '2rem';
                    mediaContainer.replaceChild(newImg, existingImg);
                    newImg.src = project.image;
                    newImg.alt = project.Nom_du_projet;
                } else {
                    existingImg.src = project.image;
                    existingImg.alt = project.Nom_du_projet;
                }
            }
        }


        const titleEl = document.querySelector('.project-header-content h1');
        if (titleEl) titleEl.textContent = project.Nom_du_projet;

        const descEl = document.querySelector('.project-description');
        if (descEl) descEl.textContent = project.description;

        const gallerySection = document.querySelector('.project-gallery');
        const galleryGrid = document.querySelector('.gallery-grid');

        if (project.galerie && project.galerie.length > 0) {
            if (galleryGrid) {
                galleryGrid.innerHTML = '';
                project.galerie.forEach(item => {
                    const div = document.createElement('div');
                    div.classList.add('gallery-item', 'glass');

                    let mediaHtml = '';
                    if (item.src.toLowerCase().endsWith('.mp4')) {
                        mediaHtml = `<video src="${item.src}" controls></video>`;
                    } else {
                        mediaHtml = `<img src="${item.src}" alt="${item.caption}">`;
                    }

                    div.innerHTML = `
                        ${mediaHtml}
                        <span class="gallery-caption">${item.caption}</span>
                    `;
                    galleryGrid.appendChild(div);
                });
            }
            if (gallerySection) gallerySection.style.display = 'block';
        } else {
            if (gallerySection) gallerySection.style.display = 'none';
        }

        const currentIndex = projectsData.findIndex(p => p.id == projectId);

        const prevLink = document.querySelector('.prev-project');
        const nextLink = document.querySelector('.next-project');

        if (prevLink) {
            if (projectsData.length > 1) {
                const prevProjectIndex = currentIndex > 0 ? currentIndex - 1 : projectsData.length - 1;
                const prevProject = projectsData[prevProjectIndex];
                prevLink.href = `projet_template.html?id=${prevProject.id}`;
                prevLink.innerHTML = `<i class="fa-solid fa-arrow-left"></i> ${prevProject.Nom_du_projet}`;
                prevLink.style.display = 'inline-flex';
            } else {
                prevLink.style.display = 'none';
            }
        }

        if (nextLink) {
            if (projectsData.length > 1) {
                const nextProjectIndex = currentIndex < projectsData.length - 1 ? currentIndex + 1 : 0;
                const nextProject = projectsData[nextProjectIndex];
                nextLink.href = `projet_template.html?id=${nextProject.id}`;
                nextLink.innerHTML = `${nextProject.Nom_du_projet} <i class="fa-solid fa-arrow-right"></i>`;
                nextLink.style.display = 'inline-flex';
            } else {
                nextLink.style.display = 'none';
            }
        }

        initLightbox();
    }

    function initCarousel() {
        const carousels = document.querySelectorAll('.carousel-wrapper');
        carousels.forEach(carousel => {
            const track = carousel.querySelector('.carousel-track');
            if (!track || track.children.length === 0) return;

            let slides = Array.from(track.children);
            const nextButton = carousel.querySelector('.next-btn');
            const prevButton = carousel.querySelector('.prev-btn');
            const clonesStart = slides.map(slide => slide.cloneNode(true));
            const clonesEnd = slides.map(slide => slide.cloneNode(true));

            clonesStart.forEach(clone => clone.classList.add('clone-start'));
            clonesEnd.forEach(clone => clone.classList.add('clone-end'));

            clonesStart.reverse().forEach(clone => track.prepend(clone));
            clonesEnd.forEach(clone => track.append(clone));

            const allSlides = Array.from(track.children);
            const originalCount = slides.length;

            let currentIndex = originalCount;
            let isTransitioning = false;

            const updateSlidePosition = (index, withTransition = true) => {
                const slide = allSlides[0];
                if (!slide) return;
                const slideStyle = window.getComputedStyle(slide);
                const slideWidth = slide.offsetWidth + parseFloat(slideStyle.marginLeft) + parseFloat(slideStyle.marginRight);

                const trackContainer = carousel.querySelector('.carousel-track-container');
                const containerCenter = trackContainer.getBoundingClientRect().width / 2;
                const amountToMove = -(index * slideWidth) + (containerCenter - slideWidth / 2);

                if (withTransition) {
                    track.style.transition = 'transform 0.5s ease-in-out';
                } else {
                    track.style.transition = 'none';
                }
                track.style.transform = 'translateX(' + amountToMove + 'px)';

                allSlides.forEach(s => s.classList.remove('current-slide'));
                if (allSlides[index]) allSlides[index].classList.add('current-slide');
            };

            setTimeout(() => updateSlidePosition(currentIndex, false), 100);
            window.addEventListener('resize', () => {
                track.style.transition = 'none';
                updateSlidePosition(currentIndex, false);
            });

            const newNext = nextButton.cloneNode(true);
            nextButton.parentNode.replaceChild(newNext, nextButton);
            const newPrev = prevButton.cloneNode(true);
            prevButton.parentNode.replaceChild(newPrev, prevButton);

            newNext.addEventListener('click', () => {
                if (isTransitioning) return;
                isTransitioning = true;
                currentIndex++;
                updateSlidePosition(currentIndex);
            });

            newPrev.addEventListener('click', () => {
                if (isTransitioning) return;
                isTransitioning = true;
                currentIndex--;
                updateSlidePosition(currentIndex);
            });

            track.addEventListener('transitionend', () => {
                isTransitioning = false;
                if (currentIndex >= 2 * originalCount) {
                    track.style.transition = 'none';
                    currentIndex = currentIndex - originalCount;
                    updateSlidePosition(currentIndex, false);
                }
                if (currentIndex < originalCount) {
                    track.style.transition = 'none';
                    currentIndex = currentIndex + originalCount;
                    updateSlidePosition(currentIndex, false);
                }
            });
        });
    }

    function initSearchFilterPagination() {
        const searchInput = document.getElementById('projectSearch');
        const filterButtons = document.querySelectorAll('.filter-btn');
        const projectsGrid = document.getElementById('projectsGrid');
        const paginationContainer = document.getElementById('paginationContainer');

        if (!searchInput || !projectsGrid || !paginationContainer) return;

        const allProjects = Array.from(projectsGrid.querySelectorAll('.project-link'));
        let currentFilter = 'all';
        let searchQuery = '';
        let currentPage = 1;
        const itemsPerPage = 9;
        let filteredProjects = [...allProjects];

        const displayProjects = () => {
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const paginatedProjects = filteredProjects.slice(startIndex, endIndex);

            allProjects.forEach(project => project.classList.add('hidden'));
            paginatedProjects.forEach(project => project.classList.remove('hidden'));

            let noResultsMsg = document.getElementById('noResultsMsg');
            if (filteredProjects.length === 0) {
                if (!noResultsMsg) {
                    noResultsMsg = document.createElement('p');
                    noResultsMsg.id = 'noResultsMsg';
                    noResultsMsg.style.gridColumn = '1/-1';
                    noResultsMsg.style.textAlign = 'center';
                    noResultsMsg.innerText = 'Aucun projet ne correspond à votre recherche.';
                    projectsGrid.appendChild(noResultsMsg);
                }
                noResultsMsg.style.display = 'block';
            } else {
                if (noResultsMsg) {
                    noResultsMsg.style.display = 'none';
                }
            }

            setupPagination();
        };

        const setupPagination = () => {
            paginationContainer.innerHTML = '';
            const pageCount = Math.ceil(filteredProjects.length / itemsPerPage);

            if (pageCount <= 1) return;

            const prevBtn = document.createElement('button');
            prevBtn.innerText = 'Précédent';
            prevBtn.classList.add('pagination-btn');
            if (currentPage === 1) prevBtn.disabled = true;
            prevBtn.addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    displayProjects();
                    window.scrollTo({
                        top: projectsGrid.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            });
            paginationContainer.appendChild(prevBtn);

            for (let i = 1; i <= pageCount; i++) {
                const btn = document.createElement('button');
                btn.innerText = i;
                btn.classList.add('pagination-btn');
                if (i === currentPage) btn.classList.add('active');
                btn.addEventListener('click', () => {
                    currentPage = i;
                    displayProjects();
                    window.scrollTo({
                        top: projectsGrid.offsetTop - 100,
                        behavior: 'smooth'
                    });
                });
                paginationContainer.appendChild(btn);
            }

            const nextBtn = document.createElement('button');
            nextBtn.innerText = 'Suivant';
            nextBtn.classList.add('pagination-btn');
            if (currentPage === pageCount) nextBtn.disabled = true;
            nextBtn.addEventListener('click', () => {
                if (currentPage < pageCount) {
                    currentPage++;
                    displayProjects();
                    window.scrollTo({
                        top: projectsGrid.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            });
            paginationContainer.appendChild(nextBtn);
        };

        const filterProjects = () => {
            const query = searchQuery.toLowerCase();

            filteredProjects = allProjects.filter(project => {
                const category = project.getAttribute('data-category');
                const title = project.getAttribute('data-title').toLowerCase();
                const tags = category.toLowerCase();

                const matchesFilter = currentFilter === 'all' || category.includes(currentFilter);
                const matchesSearch = title.includes(query) || tags.includes(query);

                return matchesFilter && matchesSearch;
            });

            currentPage = 1;
            displayProjects();
        };

        displayProjects();
        const newSearchInput = searchInput.cloneNode(true);
        searchInput.parentNode.replaceChild(newSearchInput, searchInput);

        newSearchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.trim();
            filterProjects();
        });

        filterButtons.forEach(btn => {
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);

            newBtn.addEventListener('click', () => {
                const currentButtons = document.querySelectorAll('.filter-btn');
                currentButtons.forEach(b => b.classList.remove('active'));
                newBtn.classList.add('active');

                currentFilter = newBtn.getAttribute('data-filter');
                filterProjects();
            });
        });
    }

    function initLightbox() {
        const imageModal = document.getElementById('imageModal');
        const projectMainImage = document.querySelector('.project-main-image');
        const galleryImages = document.querySelectorAll('.gallery-item img');

        if (imageModal) {
            const modalImg = imageModal.querySelector('img');
            const closeImageModal = imageModal.querySelector('.close-modal');

            const openLightbox = (src, alt) => {
                modalImg.src = src;
                modalImg.alt = alt;
                imageModal.classList.add('show');
                imageModal.classList.remove('hidden');
            };

            const closeLightbox = () => {
                imageModal.classList.remove('show');
                setTimeout(() => {
                    imageModal.classList.add('hidden');
                    modalImg.src = '';
                }, 300);
            };

            if (projectMainImage && projectMainImage.tagName === 'IMG') {
                projectMainImage.style.cursor = 'zoom-in';
                projectMainImage.onclick = () => openLightbox(projectMainImage.src, projectMainImage.alt);
            }

            galleryImages.forEach(img => {
                img.style.cursor = 'zoom-in';
                img.onclick = () => openLightbox(img.src, img.alt);
            });

            if (closeImageModal) {
                closeImageModal.onclick = closeLightbox;
            }

            imageModal.onclick = (e) => {
                if (e.target === imageModal) {
                    closeLightbox();
                }
            };
        }
    }


    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            alert('Copié dans le presse-papier : ' + text);
        }).catch(err => {
            console.error('Erreur lors de la copie :', err);
        });
    };

    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const textToCopy = btn.getAttribute('data-copy');
            if (textToCopy) {
                copyToClipboard(textToCopy);
            }
        });
    });

    if (!document.getElementById('backToTopBtn')) {
        const backToTopBtn = document.createElement('button');
        backToTopBtn.id = 'backToTopBtn';
        backToTopBtn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
        backToTopBtn.title = "Retour en haut";
        document.body.appendChild(backToTopBtn);

        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }


});

const preloader = document.getElementById('preloader');
const progressBar = document.querySelector('.progress-bar');
if (preloader && progressBar) {
    document.body.style.overflow = 'hidden';
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 2;
        if (progress > 90) progress = 90;
        progressBar.style.width = `${progress}%`;
    }, 200);

    window.addEventListener('load', () => {
        clearInterval(interval);
        progressBar.style.width = '100%';
        setTimeout(() => {
            preloader.classList.add('preloader-hidden');
            document.body.style.overflow = '';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }, 500);
    });
}

function showNotification(message, type = 'success') {
    const container = document.getElementById('notification-container');
    if (!container) return;

    const notification = document.createElement('div');
    notification.classList.add('notification', type);
    notification.textContent = message;
    container.appendChild(notification);
    setTimeout(() => {
        notification.classList.add('notification-hide');
        notification.addEventListener('transitionend', () => {
            notification.remove();
        });
    }, 5000);
}

const contactForm = document.getElementById('contactForm');
if (contactForm) {
    const successModal = document.getElementById('successModal');
    let closeSuccessBtn, closeSuccessX;

    if (successModal) {
        closeSuccessBtn = successModal.querySelector('.close-success-btn');
        closeSuccessX = successModal.querySelector('.close-modal');

        const closeSuccessModal = () => {
            successModal.classList.remove('show');
            setTimeout(() => successModal.classList.add('hidden'), 300);
        };

        if (closeSuccessBtn) closeSuccessBtn.addEventListener('click', closeSuccessModal);
        if (closeSuccessX) closeSuccessX.addEventListener('click', closeSuccessModal);

        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) closeSuccessModal();
        });
    }

    contactForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const submitBtn = this.querySelector('.btn-submit');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Envoi en cours...';
        submitBtn.disabled = true;

        emailjs.sendForm('service_ujtm1me', 'template_eyqrmjj', this)
            .then(function () {
                if (successModal) {
                    successModal.classList.add('show');
                    successModal.classList.remove('hidden');
                } else {
                    showNotification('Message envoyé avec succès !', 'success');
                }

                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, function (error) {
                console.error('Erreur EmailJS:', error);
                showNotification('Une erreur est survenue lors de l\'envoi. Veuillez réessayer.', 'error');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
    });
}
