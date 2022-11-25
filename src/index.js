import './css/styles.css';
import { PixabayApi } from './js/pixabay-api';
import createGalleryCard from './templates/photo-card.hbs';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const refs = {
    searchFormEl: document.querySelector('.search-form'),
    galleryEl: document.querySelector('.gallery'),
    btnAddMoreEL: document.querySelector('.btn-more')
};

const simpleLightBox = new SimpleLightbox('.gallery a', {
            captionsData: 'alt',
            captionDelay: 250
            });

const pixabayApi = new PixabayApi();

const onSearchFormSibmit = async (e) => {
    e.preventDefault();

    pixabayApi.searchQuery = e.target.elements.searchQuery.value;
    pixabayApi.page = 1;

    try {
        const response = await pixabayApi.fetchPhotos();

        const { data } = response;
       
        if (data.totalHits === 0) {
            Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
            return;
        }
        
        if (data.totalHits / pixabayApi.per_page > pixabayApi.page) {
             refs.btnAddMoreEL.classList.remove('is-hidden');
        }

        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
        refs.galleryEl.innerHTML = createGalleryCard(data.hits);
        simpleLightBox.refresh();

        
    } catch (error) {
        console.log(error);
    }
};

const onBtnAddMoreClick = async () => {
    pixabayApi.page += 1;

    try {
        const response = await pixabayApi.fetchPhotos();

        const { data } = response;

        refs.galleryEl.insertAdjacentHTML('beforeend', createGalleryCard(data.hits));

        simpleLightBox.refresh();

        const { height: cardHeight } = document.querySelector(".gallery")
            .firstElementChild.getBoundingClientRect();

            window.scrollBy({
            top: cardHeight * 2.5,
            behavior: "smooth",
});

        if (data.totalHits / pixabayApi.per_page < pixabayApi.page) {
            refs.btnAddMoreEL.classList.add('is-hidden');
        }

    } catch (error) {
        console.log(error);
    }
};

refs.searchFormEl.addEventListener('submit', onSearchFormSibmit);
refs.btnAddMoreEL.addEventListener('click', onBtnAddMoreClick);






