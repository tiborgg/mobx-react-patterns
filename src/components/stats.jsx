'use strict';

import * as React from 'react';
import PropTypes from 'prop-types';
import { observable, extendObservable, action } from 'mobx';
import { observer } from 'mobx-react';

import PhotosStore from '../data/photosStore';

@observer
export default class PhotoBrowser
    extends React.Component {

    static propTypes = {
        store: PropTypes.instanceOf(PhotosStore)
    }

    constructor() {
        super();

        extendObservable(this, {

        });
    }

    render() {

        const { props } = this;
        let { store } = props;

        return (
            <div className="stats" aria-hidden={!store.hasUploadingPhotos}>
                stats

            </div>
        );
    }

}