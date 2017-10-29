'use strict';

import { observable, extendObservable, action } from 'mobx';
import { v4 as uuid } from 'uuid';

import Photo from './photo';

export default class Album {

    constructor(props, apiConnector) {

        this.apiConnector = apiConnector;

        extendObservable(this, {

            id: props.id,
            name: props.name,

            parentStore: props.parentStore,

            syncState: 'new',

            createdDate: props.createdDate,
            modifiedDate: props.modifiedDate,

            _photos: observable.map(props._photos),
            get photos() {

                return this._photos.values();
            }
        });
    }

    createLocalPhotoFromFileContent(fileContent) {

        let photo = new Photo({

            id: uuid(), // ID is temporary, it will be replaced by the one generated by the back-end
            name: fileContent.name,
            url: URL.createObjectUrl(fileContent),

            fileContent: fileContent

        }, this.apiConnector);

        this._photos.set(photo.id, photo);
        return photo;
    }

    fetch() {

        this.apiConnector.fetchAlbum(album);
        return this;
    }

    update(props) {

        this.apiConnector.updateAlbum(album);
        return this;
    }

    delete() {

        this.apiConnector.deleteAlbum(album);
        return this;
    }


    handleDeleteSuccess() {

    }
}