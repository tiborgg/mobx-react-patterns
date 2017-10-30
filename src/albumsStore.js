'use strict';

import { observable, extendObservable, action } from 'mobx';
import { v4 as uuid } from 'uuid';
import _ from 'lodash';
import moment from 'moment';

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

        this.apiConnector.fetchAlbums(this);
    }

    createAlbum(props) {

        let album = new Album({

            id: uuid(),
            parentStore: this,
            syncState: 'new',

            name: props.name,
            createdDate: moment(),
            modifiedDate: moment()
        });

        this._albums.set(album.id, album);

        // sync with the server
        album.create();
        return this;
    }

    /**
     * @param {Array<Object>} apiAlbums
     */
    injectApiAlbums(apiAlbums) {

        apiAlbums.forEach(apiAlbum => {

            let album = new Album({

                id: apiAlbum.id,
                parentStore: this,
                syncState: 'partiallySynced',

                name: apiAlbum.name,
                createdDate: moment(apiAlbum.createdAt),
                modifiedDate: moment(apiAlbum.timestamp),
                coverUrl: apiAlbum.coverUrl
            });

            this._albums.set(album.id, album);
            return this;
        });
    }

    @action
    handleAlbumRemapped(album) {

        this._albums.delete(album.previousId);
        this._albums.set(album.id, album);
    }

    @action
    handleAlbumDeleted(album) {

        this._albums.delete(album.id);
    }

}