'use strict';

import { observable, extendObservable, action } from 'mobx';

export default class ApiConnector {

    _request(method, endpoint, callback, data) {

        let xhr = new XMLHttpRequest();
        let url = 'http://localhost:3000/api' + endpoint;

        // format body
        let body;

        if (typeof data === 'object' &&
            data !== null) {

            body = JSON.stringify(data);
        }

        xhr.open(method, url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onreadystatechange = () => {

            if (xhr.readyState == 4) {

                let status = xhr.status;
                let success = false;
                let data;

                if (status >= 200 && status <= 304) {

                    if (xhr.responseText.trim() === '') {
                        data = null;
                        success = true;
                    } else {

                        try {
                            // we don't call callback inside try block to avoid catching callback errors
                            data = JSON.parse(xhr.responseText);
                            success = true;
                        }
                        catch (e) {
                            callback(new Error('Unable to parse response text.'));
                        }
                    }

                    if (success)
                        callback(null, data);
                } else {

                    callback(new Error(xhr));
                }
            }
        };

        xhr.send(body);

        return xhr;
    }

    fetchPhotos(photosStore) {

        return this._request('GET', '/picture/', (err, data) => {

            if (err) return;
            photosStore.injectApiPhotos(data);
        });
    }

    fetchPhoto(photo) {

        photo.syncState = 'fetching';
        return this._request('GET', `/picture/${photo.id}`, (err, data) => {

            if (err) return;
            photo.applyApiProps(data);
        });
    }

    updatePhoto(photo) {

        let data = {
            name: photo.name
        };

        photo.syncState = 'updating';
        return this._request('PUT', `/picture/${photo.id}`, (err, data) => {

            if (err) return;
            photo.applyApiProps(data);
        }, data);
    }

    deletePhoto(photo) {

        photo.syncState = 'deleting';
        return this._request('DELETE', `/picture/${photo.id}`, (err, data) => {

            if (err) return;
            photo.handleDeleted();
        });
    }

    uploadPhoto(photo) {

        let xhr = new XMLHttpRequest();
        let url = `http://localhost:3000/api/picture`;

        let formData = new FormData();

        formData.append('name', photo.name);
        formData.append('pic', photo.fileContent);

        xhr.open('POST', url, true);

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


        photo.syncState = 'uploading';
        xhr.send(formData);

        return {
            cancel() {
                xhr.abort();
            }
        }
    }
}