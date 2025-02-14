import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import iconSvgError from './img/error.svg';
import iconSvgWarning from './img/warning.svg';
import getRequestURL from './js/pixabay-api.js';
import addGalleryElements from './js/render-functions.js';

document.addEventListener('DOMContentLoaded', function() {
  const galleryList = document.querySelector('.gallery');
  const loaderElement = document.querySelector('.loader');
  const requestForm = document.querySelector('.search-form');

  console.log('galleryList:', galleryList);
  console.log('loaderElement:', loaderElement);
  console.log('requestForm:', requestForm);

  if (!galleryList || !loaderElement || !requestForm) {
    console.error('One or more required elements are missing.');
    return;
  }

  const errFindImagesMessage = {
    message: `Sorry, there are no images matching <br> your search query. Please, try again!`,
    messageColor: '#fff',
    backgroundColor: '#ef4040',
    position: 'topRight',
    iconUrl: iconSvgError,
  };

  const owerMaxLengthInputMessg = {
    message: `Перевищено максимально допустиму кількість символів!<br> Допустимо 100 символів.`,
    messageColor: '#fff',
    backgroundColor: '#ffa000',
    position: 'topRight',
    iconUrl: iconSvgWarning,
    displayMode: 'once',
  };

  let gallery = new SimpleLightbox('.gallery a', {
    captions: true,
    captionType: 'attr',
    captionsData: 'alt',
    captionDelay: 250,
    captionPosition: 'bottom',
  });

  gallery.on('show.simplelightbox', function () {});

  gallery.on('error.simplelightbox', function (e) {
    console.log(e);
  });

  requestForm.addEventListener('input', checkMaxLengthRequestWords);
  requestForm.addEventListener('submit', searchImages);

  function checkMaxLengthRequestWords(event) {
    if (event.target.value.trim().length > 100) {
      iziToast.show(owerMaxLengthInputMessg);
      event.target.value = event.target.value.trim().slice(0, 100);
    }
  }

  function searchImages(event) {
    event.preventDefault();
    console.log('searchImages event triggered');
    if (event.currentTarget.requestField.value.trim().length === 0) {
      return;
    }
    if (loaderElement) {
      loaderElement.classList.remove('visually-hidden');
    }
    galleryList.innerHTML = '';

    const responseUrl = getRequestURL(
      event.currentTarget.requestField.value.trim()
    );
    requestForm.reset();
    console.log('responseUrl:', responseUrl);

    fetch(responseUrl, {
      headers: {
        Accept: 'application/json',
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(response.status);
        }
        return response.json();
      })
      .then(data => {
        console.log('API response data:', data);
        if (data.hits.length === 0) {
          iziToast.show(errFindImagesMessage);
          return;
        }
        addGalleryElements(galleryList, data);
        gallery.refresh();
      })
      .catch(() => {
        iziToast.show(errFindImagesMessage);
      })
      .finally(() => {
        if (loaderElement) {
          loaderElement.classList.add('visually-hidden');
        }
      });
  }
});
