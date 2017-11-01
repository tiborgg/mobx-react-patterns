'use strict';

import { observable, extendObservable, action } from 'mobx';

import getDisplaySize from '../util/getDisplaySize';

export default class Photo {

    constructor(props) {

        extendObservable(this, {

            id: props.id,
            parentStore: props.parentStore,

            name: props.name,
            url: props.url,
            createdDate: props.createdDate,
            modifiedDate: props.modifiedDate,
            width: props.width || 0,
            height: props.height || 0,

            fileSize: props.fileSize || 0,
            fileContent: props.fileContent,

            syncState: 'new',
            uploadProgressSize: 0,

            get uploadProgress() {
                
                return this.uploadProgressSize / this.fileSize;
            },

            get displaySize() { return getDisplaySize(this.fileSize); }
        });

        this.apiConnector = this.parentStore.apiConnector;
    }

    @action
    fetch() {

        if (this.syncState === 'synced')
            return this;

        this.apiConnector.fetchPhoto(this);
        return this;
    }

    @action
    upload() {

        this.apiConnector.uploadPhoto(this);
        return this;
    }

    @action
    update(props) {

        let hasChanges = false;
        if (props.name && props.name !== this.name) {
            this.name = props.name;
            hasChanges = true;
        }

        if (!hasChanges)
            return this;

        this.apiConnector.updatePhoto(this);
        return this;
    }

    @action
    delete() {

        this.apiConnector.deletePhoto(this);
        return this;
    }

    @action
    applyApiProps(apiProps) {

        if (apiProps.id !== this.id) {

            this.previousId = this.id;
            this.id = apiProps.id;
            this.parentStore.handlePhotoRemapped(this);
        }

        Object.assign(this, {

            name: apiProps.name,
            createdDate: new Date(apiProps.createdAt),
            modifiedDate: new Date(apiProps.timestamp),
            url: apiProps.url,
            fileSize: apiProps.size,
            width: apiProps.width,
            height: apiProps.height
        });

        this.syncState = 'synced';

        return this;
    }

    handleDeleted = () =>
        this.parentStore.handlePhotoDeleted(this);

}