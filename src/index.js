import './css/styles.css';
import { PixabayApi } from './js/pixabay-api';
import createGalleryCard from './templates/photo-card.hbs';

const refs = {
    searchFormEl: document.querySelector('.search-form'),
    galleryEl: document.querySelector('.gallery'),
    btnAddMoreEL: document.querySelector('.btn-more')
};
const pixabayApi = new PixabayApi();

refs.searchFormEl.addEventListener('submit', onSearchFormSibmit);
refs.btnAddMoreEL.addEventListener('click', onBtnAddMoreClick);

function onSearchFormSibmit(e) {
    e.preventDefault();

    pixabayApi.searchQuery = e.target.elements.searchQuery.value;
    pixabayApi.page = 1;
    
    pixabayApi.fetchPhotos().then(photos => {
        if (photos.totalHits === 0) {
            console.log("Sorry, there are no images matching your search query. Please try again.");
            return;
        }
        
        if (photos.totalHits / 40 <= pixabayApi.page) {
            refs.galleryEl.innerHTML = createGalleryCard(photos.hits);
            console.log(photos);
            return;
        }

        console.log(photos);
        refs.galleryEl.innerHTML = createGalleryCard(photos.hits);
        
        refs.btnAddMoreEL.classList.remove('is-hidden');
    }).catch (err => {
        console.log(err);  
    });
}

function onBtnAddMoreClick() {
    pixabayApi.page += 1;

    pixabayApi.fetchPhotos().then(photos => {
        refs.galleryEl.insertAdjacentHTML('beforeend', createGalleryCard(photos.hits));

        if (photos.totalHits / 40 < pixabayApi.page) {
            refs.btnAddMoreEL.classList.add('is-hidden');
        }
    });
}
