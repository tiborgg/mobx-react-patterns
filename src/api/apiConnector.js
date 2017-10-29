'use strict';

import { observable, extendObservable, action } from 'mobx';

export default class ApiConnector {

    constructor() {

    }

    uploadPhoto(photo) {

        let xhr = new XMLHttpRequest();

        let formData = new FormData();

        formData.append('name', photo.name);
        formData.append('description', photo.description);
        formData.append('fileData', photo.content);

        xhr.open('POST', uploadUrl, true);

        xhr.setRequestHeader('Accept', '*.*');

        xhr.onload = evt => {

            let status = xhr.status;
            let success = false;
            let data;

            if (status >= 200 && status <= 304) {

                if (xhr.responseText.trim() === '') {
                    data = null;
                    success = true;
                } else {

                    try {
                        
                        data = JSON.parse(xhr.responseText);
                        success = true;
                    }
                    catch (e) {
                        callback(new Error('Unable to parse response text.'));
                    }
                }

                if (success)
                    photo.applyApiProps(data);

            } else {

                photo.error = xhr.responseText;
            }
        };

        xhr.upload.onprogress = action((evt) => {

            if (evt.lengthComputable)
                photo.uploadProgressSize = evt.loaded;

        });

        xhr.send(formData);

        return {
            cancel() {
                xhr.abort();
            }
        }
    }
}