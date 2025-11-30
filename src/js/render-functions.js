// render-functions.js
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  gallery: document.querySelector('.gallery'),
  loader: document.querySelector('.loader'),
  loadMoreBtn: document.querySelector('.load-more'),
};

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

export function createGallery(images = []) {
  if (!refs.gallery) return;

  const markup = images
    .map(
      img => `
    <div class="photo-card">
      <a href="${img.largeImageURL}">
        <img src="${img.webformatURL}" alt="${img.tags}" loading="lazy" />
      </a>
      <div class="info">
        <p class="info-item"><b>Likes</b><span>${img.likes}</span></p>
        <p class="info-item"><b>Views</b><span>${img.views}</span></p>
        <p class="info-item"><b>Comments</b><span>${img.comments}</span></p>
        <p class="info-item"><b>Downloads</b><span>${img.downloads}</span></p>
      </div>
    </div>`
    )
    .join('');

  refs.gallery.insertAdjacentHTML('beforeend', markup);

  lightbox.refresh();
}

export function clearGallery() {
  if (!refs.gallery) return;
  refs.gallery.innerHTML = '';
}

export function showLoader() {
  if (!refs.loader) return;
  refs.loader.classList.remove('is-hidden');
}

export function hideLoader() {
  if (!refs.loader) return;
  refs.loader.classList.add('is-hidden');
}

export function showLoadMoreButton() {
  if (!refs.loadMoreBtn) return;
  refs.loadMoreBtn.classList.remove('is-hidden');
}

export function hideLoadMoreButton() {
  if (!refs.loadMoreBtn) return;
  refs.loadMoreBtn.classList.add('is-hidden');
}

export const domRefs = refs;
