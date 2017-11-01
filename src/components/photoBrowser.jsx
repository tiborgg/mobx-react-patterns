'use strict';

import * as React from 'react';
import PropTypes from 'prop-types';
import { observable, extendObservable, action } from 'mobx';
import { observer } from 'mobx-react';

import PhotosStore from '../data/photosStore';
import PhotoCard from './photoCard';
import Stats from './stats';

@observer
export default class PhotoBrowser
    extends React.Component {

    static propTypes = {
        store: PropTypes.instanceOf(PhotosStore)
    }

    render() {

        const { props } = this;
        let { store } = props;

        return (
            <div className="photo-browser">

                <ul className="photo-list">
                    {store.photos.map(photo => {

                        return (
                            <li className="photo-item" key={photo.id}>
                                <PhotoCard model={photo} />
                            </li>
                        );
                    })}

                    <li className="photo-item photo-upload-item" key="$uploadItem">

                        <div className="photo-upload-button" role="button">
                            <span className="icon fa fa-upload" />
                            <input type="file" multiple={true} onChange={this.handleUploadInputChange} />
                        </div>
                    </li>
                </ul>

                <Stats store={store} />
            </div>
        );
    }

    @action
    handleUploadInputChange = (evt) => {

        let { store } = this.props;
        let { files } = evt.target;

        for (let i = 0; i < files.length; i++) {

            // fileContent instanceof File
            // see https://developer.mozilla.org/en-US/docs/Web/API/File

            store.uploadPhoto({
                fileContent: files[i]
            });
        }
    }

}