'use strict';

import { observable, extendObservable, action } from 'mobx';
import { v4 as uuid } from 'uuid';

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

            // some props might not make sense because they are so closely related to another prop
            // but they might make sense from a code readability perspective, and that's one of the
            // concepts that MobX encourages 
            get hasUploadingPhotos() {

                return this.uploadingPhotos.length > 0;
            },

            get totalUploadProgressSize() {
                return this.uploadingPhotos.reduce((sum, photo) => sum + photo.uploadProgressSize, 0);
            },
            get totalUploadFileSize() {
                return this.uploadingPhotos.reduce((sum, photo) => sum + photo.fileSize, 0);
            },
            get totalUploadProgress() {
                // always check for division by zero!
                if (this.totalUploadFileSize === 0)
                    return 0;

                return this.totalUploadProgressSize / this.totalUploadFileSize;
            },

            queueStartTime: null,
            get queueUploadSpeed() {

                if (!this.hasUploadingPhotos)
                    return 0;

                return this.totalUploadProgressSize / (new Date() - this.queueStartTime) * 1000;
            }
        });

        this.apiConnector = apiConnector;
    }

    @action
    fetchPhotos() {

        this.apiConnector.fetchPhotos(this);
        return this;
    }

    @action
    uploadPhoto(props) {

        let { fileContent } = props;

        let photo = new Photo({

            id: uuid(),
            parentStore: this,
            syncState: 'new',

            name: fileContent.name,
            createdDate: new Date(),
            modifiedDate: new Date(),
            fileSize: fileContent.size,
            width: 0,
            height: 0,

            fileContent: props.fileContent,
            url: URL.createObjectURL(props.fileContent)
        });

        this._photos.set(photo.id, photo);

        // if there are no uploading photos in the queue, then mark the start of a new queue
        this.queueStartTime = new Date();

        // sync with the server
        photo.upload();
        return this;
    }

    @action
    injectApiPhotos(apiPhotos) {

        apiPhotos.forEach(apiPhoto => {

            let photo = new Photo({

                id: apiPhoto.id,
                parentStore: this,
                syncState: 'partiallySynced',

                name: apiPhoto.name,
                createdDate: new Date(apiPhoto.createdAt),
                modifiedDate: new Date(apiPhoto.timestamp),
                url: apiPhoto.url
            });

            this._photos.set(photo.id, photo);
        });
    }

    @action
    handlePhotoRemapped(photo) {

        this._photos.delete(photo.previousId);
        this._photos.set(photo.id, photo);
    }

    @action
    handlePhotoDeleted(photo) {

        this._photos.delete(photo.id);
    }

}