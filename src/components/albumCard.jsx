'use strict';

import * as React from 'react';
import PropTypes from 'prop-types';
import { observable, extendObservable, action } from 'mobx';
import { observer } from 'mobx-react';

import Album from '../data/album';

import PhotoCard from './photoCard';

@observer
export default class AlbumCard
    extends React.Component {

    static propTypes = {
        model: PropTypes.instanceOf(Album)
    }

    constructor() {
        super();


    }

    render() {

        const { props } = this;
        let { model } = props;

        return (
            <div className="album-card">

                <header className="album-header">

                    <div className="album-cover">

                    </div>

                    <div className="album-info">
                        <h2 className="album-name">{model.name}</h2>
                        <h4 className="album-photo-count">{model.photos.length} photos</h4>
                    </div>

                </header>

                <ul className="photo-browser">
                    {model.photos.map(photo => {

                        return (
                            <li className="photo-item" key={photo.id}>
                                <PhotoCard model={photo} />
                            </li>
                        );
                    })}

                    <li className="photo-item photo-upload-item" key="$uploadItem">
                        upload
                    </li>
                </ul>
            </div>
        );
    }
}