'use strict';

import { observable, extendObservable, action } from 'mobx';

export default class Photo {

    constructor(props, apiConnector) {

        this.apiConnector = apiConnector;

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
    }

    fetch() {

        this.apiConnector.fetchPhoto(this);
        return this;
    }

    upload() {

        this.apiConnector.uploadPhoto(this);
        return this;
    }

    delete() {

        this.apiConnector.deletePhoto(this);
        return this;
    }
}