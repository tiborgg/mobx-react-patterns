'use strict';

import { observable, extendObservable, action } from 'mobx';

import Album from './data/album';
import Photo from './data/photo';

export default class AlbumsStore {

    constructor(apiConnector) {

        this.apiConnector = apiConnector;

        extendObservable(this, {

            _albums: observable.map(),
            get albums() {

                return this._albums.values();
            }
        });

    }

    fetchAlbums() {

        this.apiConnector.fetchAlbums();
    }

    /**
     * @param {Array<Object>} apiAlbums
     */
    injectApiAlbums(apiAlbums) {


    }
}