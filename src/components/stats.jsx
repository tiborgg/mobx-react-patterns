'use strict';

import * as React from 'react';
import PropTypes from 'prop-types';
import { observable, extendObservable, action } from 'mobx';
import { observer } from 'mobx-react';

import PhotosStore from '../data/photosStore';
import getDisplaySize from '../util/getDisplaySize';

@observer
export default class PhotoBrowser
    extends React.Component {

    static propTypes = {
        store: PropTypes.instanceOf(PhotosStore)
    }

    constructor() {
        super();

        extendObservable(this, {

            get queueUploadSpeed() {
                return getDisplaySize(this.props.store.queueUploadSpeed);
            },
            get totalUploadProgressSize() {
                return getDisplaySize(this.props.store.totalUploadProgressSize);
            },
            get totalUploadFileSize() {
                return getDisplaySize(this.props.store.totalUploadFileSize);
            }
        });
    }

    render() {

        const { props } = this;
        let { store } = props;

        return (
            <div className="stats" aria-hidden={!store.hasUploadingPhotos}>

                <div className="stats-details">
                    <div className="progress">
                        <span className="completed-percentage">
                            <em className="percentage">{(store.totalUploadProgress * 100).toFixed(2)}%</em> 
                            ({this.totalUploadProgressSize} / {this.totalUploadFileSize})
                        </span>
                    </div>
                    <div className="speed">
                        Speed:
                        <em>{this.queueUploadSpeed} / s</em>
                    </div>
                </div>

                <div className="upload-progress">
                    <div className="upload-progress-bar" style={{ width: (store.totalUploadProgress * 100) + '%' }}></div>
                </div>
            </div>
        );
    }

}