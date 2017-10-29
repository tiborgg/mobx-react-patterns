'use strict';

import { observable, extendObservable, action } from 'mobx';
import _ from 'lodash';
import moment from 'moment';

export default class Photo {

    constructor(props) {

        extendObservable(this, {

            id: props.id,
            name: props.name,

            parentAlbum: props.parentAlbum,

            url: props.url,

            createdDate: props.createdDate,
            modifiedDate: props.modifiedDate,
            width: props.width || 0,
            height: props.height || 0,
            size: props.size || 0,

            fileContent: props.fileContent,

            syncState: 'new',
            uploadProgressSize: 0,

            get uploadProgress() {

            }
        });

        this.apiConnector = this.parentAlbum.apiConnector;
    }

    fetch() {

        if (this.syncState === 'synced')
            return this;

        this.apiConnector.fetchPhoto(this);
        return this;
    }

    upload() {

        this.apiConnector.uploadPhoto(this);
        return this;
    }

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

    delete() {

        this.apiConnector.deletePhoto(this);
        return this;
    }

    applyApiProps(apiProps) {

        if (apiProps.id !== this.id) {

            this.previousId = this.id;
            this.id = apiProps.id;
            this.parentAlbum.handlePhotoRemapped(this);
        }

        Object.assign(this, {

            name: apiProps.name,
            createdDate: moment(apiProps.createdAt),
            modifiedDate: moment(apiProps.timestamp),
            url: apiProps.url,
            size: apiProps.size,
            width: 0,
            height: 0
        });

        this.syncState = 'synced';

        return this;
    }

    handleDeleted = () =>
        this.parentAlbum.handlePhotoDeleted(this);

}