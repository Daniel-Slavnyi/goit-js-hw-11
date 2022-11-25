import './css/styles.css';
import { PixabayApi } from './js/pixabay-api';
import createGalleryCard from './templates/photo-card.hbs';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
console.log('hihiuhihi');
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

        console.log(photos);
        const { data } = photos;
       
        if (data.totalHits === 0) {
            Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
            return;
        }
        
        if (data.totalHits / 40 <= pixabayApi.page) {
            refs.galleryEl.innerHTML = createGalleryCard(data.hits);
            Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
            
            new SimpleLightbox('.gallery a', {
            captionsData: 'alt',
            captionDelay: 250
            });
            
            return;
        }

        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
        refs.galleryEl.innerHTML = createGalleryCard(data.hits);
        
            new SimpleLightbox('.gallery a', {
            captionsData: 'alt',
            captionDelay: 250
            });

        refs.btnAddMoreEL.classList.remove('is-hidden');

    }).catch (err => {
        console.log(err);  
    });
}

function onBtnAddMoreClick() {
    pixabayApi.page += 1;

    pixabayApi.fetchPhotos().then(photos => {
        const { data } = photos;
        refs.galleryEl.insertAdjacentHTML('beforeend', createGalleryCard(data.hits));

        new SimpleLightbox('.gallery a', {
        captionsData: 'alt',
        captionDelay: 250
        });

        if (data.totalHits / 40 < pixabayApi.page) {
            refs.btnAddMoreEL.classList.add('is-hidden');
        }
    });
}


