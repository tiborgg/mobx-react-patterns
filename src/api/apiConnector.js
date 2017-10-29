'use strict';

import { observable, extendObservable, action } from 'mobx';

export default class ApiConnector {

    constructor() {

    }

    _request(method, endpoint, callback, data) {

        let xhr = new XMLHttpRequest();
        let url = 'http://localhost:8000/api' + endpoint;

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

    _get = (url, callback) => this._request('GET', url, callback);
    _post = (url, callback, data) => this._request('POST', url, callback, data);
    _put = (url, callback, data) => this._request('PUT', url, callback, data);
    _delete = (url, callback) => this._request('DELETE', url, callback, data);

    fetchAlbums(albumsStore) {

        return this._get('/albums', (err, data) => {

            if (err) return;
            albumsStore.injectApiAlbums(data);
        });
    }

    @action
    fetchAlbum(album) {

        album.syncState = 'fetching';
        return this._get(`/albums/${album.id}`, (err, data) => {

            if (err) return;
            album.applyApiData(data);
        });
    }

    @action
    updateAlbum(album) {

        album.syncState = 'updating';
        return this._put(`/albums/${album.id}`, (err, data) => {

            if (err) return;
            album.applyApiData(data);
        });
    }

    deleteAlbum(album) {

        album.syncState = 'deleting';
        return this._delete(`/albums/${album.id}`, (err, data) => {

            if (err) return;
            album.handleDeleteSuccess();
        });
    }

    fetchPhoto(photo) {

        album.syncState = 'fetching';
        return this._get(`/photos/${photo.id}`, (err, data) => {

            if (err) return;
            photo.applyApiData(data);
        });
    }

    updatePhoto(photo) {

        album.syncState = 'updating';
        return this._put(`/photos/${photo.id}`, (err, data) => {

            if (err) return;
            photo.applyApiData(data);
        }, photo.exportApiData());
    }

    deletePhoto(photo) {

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