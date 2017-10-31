'use strict';

import { observable, extendObservable, action } from 'mobx';
import { v4 as uuid } from 'uuid';
import moment from 'moment';

import Photo from './photo';

export default class PhotosStore {

    constructor(apiConnector) {

        extendObservable(this, {

            _photos: observable.map(),
            get photos() {

                return this._photos.values();
            },

            get uploadingPhotos() {

                return this.photos.filter(photo => photo.syncState === 'uploading');
            },
            get totalUploadProgressSize() {
                return this.uploadingPhotos.reduce((sum, photo) => sum + photo.uploadProgressSize, 0);
            },
            get totalUploadFileSize() {
                return this.uploadingPhotos.reduce((sum, photo) => sum + photo.fileSize, 0);
            },
            get totalUploadProgress() {
                return this.totalUploadProgressSize / this.totalUploadFileSize;
            },

            
            get totalAverageUploadSpeed() {

            },
            get currentUploadSpeec() {

            }
        });

        this.apiConnector = apiConnector;
    }

    fetchPhotos() {

        this.apiConnector.fetchPhotos(this);
        return this;
    }

    uploadPhoto(props) {

        let { fileContent } = props;

        let photo = new Photo({

            id: uuid(),
            parentAlbum: this,
            syncState: 'new',

            name: fileContent.name,
            createdDate: moment(),
            modifiedDate: moment(),
            size: fileContent.size,
            width: 0,
            height: 0,

            fileContent: props.fileContent,
            url: URL.createObjectURL(props.fileContent)
        });

        this._photos.set(photo.id, photo);

        // sync with the server
        photo.upload();
        return this;
    }

    injectApiPhotos(apiPhotos) {

        apiPhotos.forEach(apiPhoto => {

            let photo = new Photo({
                id: apiPhoto.id,
                parentAlbum: this,
                syncState: 'partiallySynced',

                name: apiPhoto.name,
                createdDate: moment(apiPhoto.createdAt),
                modifiedDate: moment(apiPhoto.timestamp),
                url: apiPhoto.url
            });

            this._photos.set(photo.id, photo);
        });
    }

    handlePhotoRemapped(photo) {

        this._photos.delete(photo.previousId);
        this._photos.set(photo.id, photo);
    }

    handlePhotoDeleted(photo) {

        this._photos.delete(photo.id);
    }

}