// main.js
import { getImagesByQuery, per_page } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
  domRefs,
} from './js/render-functions.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

let currentQuery = '';
let currentPage = 1;
let totalHits = 0;

const formEl = document.querySelector('#form');
const loadMoreBtn = domRefs.loadMoreBtn;
const galleryEl = domRefs.gallery;

hideLoadMoreButton();
hideLoader();

if (formEl) {
formEl.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(formEl);
  const query = (formData.get('searchQuery') || '').trim();

  if (!query) {
    iziToast.warning({ title: 'Warning', message: 'Please enter a search query.' });
    return;
  }

  currentQuery = query;
  currentPage = 1;
  clearGallery();
  hideLoadMoreButton();

  showLoader();
  await Promise.resolve();

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);
    totalHits = data.totalHits || 0;
    const hits = data.hits || [];

    if (totalHits === 0) {
      iziToast.error({
        title: 'No results',
        message: 'No images found. Try another query.'
      });
      return;
    }

    createGallery(hits);

    iziToast.success({
      title: 'Success',
      message: `Hooray! We found ${totalHits} images.`
    });

    if (currentPage * per_page < totalHits) {
      showLoadMoreButton();
    } else {
      iziToast.info({
        title: 'End',
        message: "We're sorry, but you've reached the end of search results."
      });
    }

  } catch (err) {
    console.error(err);
    iziToast.error({ title: 'Error', message: 'Something went wrong while fetching images.' });
  } finally {
    hideLoader();
  }
});
}

if (loadMoreBtn) {
 loadMoreBtn.addEventListener('click', async () => {
  showLoader();
  await Promise.resolve();
  hideLoadMoreButton();

  currentPage += 1;

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);
    const hits = data.hits || [];

    if (hits.length === 0) {
      iziToast.info({ title: 'End', message: "We're sorry, but you've reached the end of search results." });
      return;
    }

    createGallery(hits);

    const firstCard = galleryEl.querySelector('.photo-card');
    if (firstCard) {
      const { height } = firstCard.getBoundingClientRect();
      window.scrollBy({
        top: height * 2,
        behavior: 'smooth',
      });
    }

    if (currentPage * per_page < totalHits) {
      showLoadMoreButton();
    } else {
      iziToast.info({ title: 'End', message: "We're sorry, but you've reached the end of search results." });
    }

  } catch (err) {
    console.error(err);
    iziToast.error({ title: 'Error', message: 'Failed to load more images.' });
    currentPage -= 1;
    showLoadMoreButton();
  } finally {
    hideLoader();
  }
});

}

const params = new URLSearchParams(window.location.search);
const initialQuery = params.get('searchQuery');

if (initialQuery) {
  document.querySelector('#searchQuery').value = initialQuery;
  formEl.dispatchEvent(new Event('submit'));
}
