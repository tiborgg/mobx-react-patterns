'use strict';

import * as React from 'react';
import PropTypes from 'prop-types';
import { observable, extendObservable, action } from 'mobx';
import { observer } from 'mobx-react';
import _ from 'lodash';

import PhotosStore from '../data/photosStore';
import PhotoCard from './photoCard';

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
            <div className="photo-browser" aria-expanded={this.isExpanded}>

                <ul className="photo-list">
                    {store.photos.map(photo => {

                        return (
                            <li className="photo-item" key={photo.id}>
                                <PhotoCard model={photo} />
                            </li>
                        );
                    })}

                    <li className="photo-item photo-upload-item" key="$uploadItem">

                        <div className="upload-photo-button" role="button">
                            <span className="icon fa fa-upload" />
                            <input type="file" multiple={true} onChange={this.handleUploadInputChange} />
                        </div>
                    </li>
                </ul>
            </div>
        );
    }

    @action
    handleUploadInputChange = (evt) => {

        let { store } = this.props;

        _.forEach(evt.target.files, fileContent => {

            // fileContent instanceof File
            // see https://developer.mozilla.org/en-US/docs/Web/API/File

            store.uploadPhoto({
                fileContent
            });
        });
    }

}