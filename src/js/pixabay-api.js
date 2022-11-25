'use strict';

import axios from "axios";

export class PixabayApi {
    #BASE_URL = 'https://pixabay.com/api/';
    #API_KEY = '31554206-44eb8eb4918d364b6fc8ad198';
    
    constructor() {
        this.page = 1;
        this.searchQuery = null;
        this.per_page = 40;
    }

    fetchPhotos() {
        const searchParams = {
            params: {
                key: this.#API_KEY,
                q: this.searchQuery,
                image_type: "photo",
                orientation: "horizontal",
                safesearch: "true",
                page: this.page,
                per_page: this.per_page,
            }
        }

        return axios.get(`${this.#BASE_URL}`, searchParams);
        
    }
}