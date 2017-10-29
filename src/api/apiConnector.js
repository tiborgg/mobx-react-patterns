'use strict';

import { observable, extendObservable, action } from 'mobx';

export default class ApiConnector {

    constructor() {

    }

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

    _get = (url, callback) => this._request('GET', url, callback);
    _post = (url, callback, data) => this._request('POST', url, callback, data);
    _put = (url, callback, data) => this._request('PUT', url, callback, data);
    _delete = (url, callback) => this._request('DELETE', url, callback);

    fetchAlbums(albumsStore) {

        return this._get('/album', (err, data) => {

            if (err) return;
            albumsStore.injectApiAlbums(data);
        });
    }

    @action
    fetchAlbum(album) {

        album.syncState = 'fetching';
        return this._get(`/album/${album.id}`, (err, data) => {

            if (err) return;
            
            album.applyApiProps(data);
            album.injectApiPhotos(data.pictures);
        });
    }

    @action
    createAlbum(album) {

        let data = {
            name: album.name
        };

        album.syncState = 'creating';
        return this._post(`/album`, (err, data) => {

            if (err) return;
            album.applyApiProps(data);
        }, data);
    }

    @action
    updateAlbum(album) {

        let data = {
            name: album.name
        };

        album.syncState = 'updating';
        return this._put(`/album/${album.id}`, (err, data) => {

            if (err) return;
            album.applyApiProps(data);
        }, data);
    }

    deleteAlbum(album) {

        album.syncState = 'deleting';
        return this._delete(`/album/${album.id}`, (err, data) => {

            if (err) return;
            album.handleDeleted();
        });
    }


    fetchPhoto(photo) {

        
        photo.syncState = 'fetching';
        return this._get(`/picture/${photo.id}`, (err, data) => {

            if (err) return;
            photo.applyApiProps(data);
        });
    }

    updatePhoto(photo) {

        let data = {
            name: photo.name
        };

        photo.syncState = 'updating';
        return this._put(`/picture/${photo.id}`, (err, data) => {

            if (err) return;
            photo.applyApiProps(data);
        }, data);
    }

    deletePhoto(photo) {

        photo.syncState = 'deleting';
        return this._delete(`/picture/${photo.id}`, (err, data) => {

            if (err) return;
            photo.handleDeleted();
        });
    }

    uploadPhoto(photo) {

        let xhr = new XMLHttpRequest();
        let url = `http://localhost:3000/api/album/${photo.parentAlbum.id}/picture`;

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