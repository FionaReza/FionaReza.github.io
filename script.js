const menuButton = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuButton && navLinks) {
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
    navLinks.classList.toggle('is-open', !isOpen);
  });
  navLinks.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open navigation');
      navLinks.classList.remove('is-open');
    }
  });
}

const currentFile = window.location.pathname.split('/').pop() || 'index.html';
const currentPage = currentFile.replace('.html', '') === 'index' ? 'about' : currentFile.replace('.html', '');
document.querySelector(`[data-page="${currentPage}"]`)?.classList.add('active');
const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

// Display the two retained Lafayette River monitoring figures.
const projectGallery = document.querySelector('[data-gallery="lafayette"]');
if (projectGallery) {
  const presentationImages = [
    { filename: 'Slide29.JPG', caption: 'Ac dinoflagellate time series, January–July 2025 (cells/mL).' },
    { filename: 'Slide30.JPG', caption: 'Phytoplankton assemblages in AC, January–July 2025 (cells/mL).' }
  ];
  const collage = document.createElement('figure');
  collage.className = 'project-collage';
  const collageGrid = document.createElement('div');
  collageGrid.className = 'project-collage-grid';
  presentationImages.forEach(({ filename, caption }, index) => {
    const image = document.createElement('img');
    image.src = `images%20from%20presentation/NYCC%20AC%20Phytoplankton%20Identification/${encodeURIComponent(filename)}`;
    image.alt = caption;
    image.loading = 'lazy';
    image.onerror = () => image.closest('.collage-cell')?.remove();
    const cell = document.createElement('div');
    cell.className = 'collage-cell';
    cell.append(image);
    collageGrid.append(cell);
  });
  collage.append(collageGrid);
  const collageCaption = document.createElement('figcaption');
  collageCaption.textContent = 'Figure: Phytoplankton assemblages in the Lafayette River, January–July 2025.';
  collage.append(collageCaption);
  projectGallery.append(collage);
}





// Adapt research galleries to the number and orientation of their images.
document.querySelectorAll('.research-entry-media, .portfolio-projects .portfolio-card').forEach((media) => {
  media.querySelectorAll(':scope > div, :scope > aside').forEach((gallery) => {
    const figures = Array.from(gallery.children).filter((node) => node.tagName === 'FIGURE');
    if (!figures.length) return;
    gallery.classList.add('compact-research-gallery');
    gallery.dataset.figureCount = String(figures.length);
    const images = figures.map((figure) => figure.querySelector('img, video')).filter(Boolean);
    const updateOrientation = () => {
      const landscapePair = figures.length === 2 && images.length === 2 && images.every((img) => (img.naturalWidth || img.videoWidth) > (img.naturalHeight || img.videoHeight));
      gallery.classList.toggle('landscape-pair', landscapePair);
    };
    images.forEach((img) => {
      img.addEventListener('load', updateOrientation);
      img.addEventListener('loadedmetadata', updateOrientation);
    });
    updateOrientation();
  });
});
// Place the retained research figures in a column to the right of the text.
document.querySelectorAll('.research-entry-body').forEach((body) => {
  const media = body.querySelector('.research-entry-media');
  const text = body.querySelector('.research-entry-text');
  if (!media || !text) return;
  const figures = Array.from(media.querySelectorAll('figure'));
  if (!figures.length) {
    media.remove();
    body.classList.add('research-text-only');
    return;
  }
  const gallery = document.createElement('div');
  gallery.className = 'research-right-gallery';
  figures.forEach((figure) => gallery.append(figure));
  media.replaceWith(gallery);
  body.prepend(text);
  body.classList.add('research-images-right');
  const entry = body.closest('.research-entry');
  if (entry) {
    entry.append(gallery);
    entry.classList.add('research-gallery-raised');
  }
});