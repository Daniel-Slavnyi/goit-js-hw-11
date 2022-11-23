

export class PixabayApi {
    #BASE_URL = 'https://pixabay.com/api/';
    #API_KEY = '31554206-44eb8eb4918d364b6fc8ad198';
    
    constructor() {
        this.page = 1;
        this.searchQuery = null;
    }

    fetchPhotos() {
        const searchParams = new URLSearchParams({
            key: this.#API_KEY,
            q: this.searchQuery,
            image_type: "photo",
            orientation: "horizontal",
            safesearch: "true",
            page: this.page,
            per_page: '40'
        });
        return fetch(`${this.#BASE_URL}?${searchParams}`).then(resolve => {
            if (!resolve.ok) {
                throw new Error(resolve.statusText);
            }

            return resolve.json();
        });
    }
}