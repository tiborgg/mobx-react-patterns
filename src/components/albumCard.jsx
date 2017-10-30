'use strict';

import * as React from 'react';
import PropTypes from 'prop-types';
import { observable, extendObservable, action } from 'mobx';
import { observer } from 'mobx-react';
import _ from 'lodash';

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

        extendObservable(this, {
            isExpanded: false,

            isNameInputFocused: false,
            nameInputValue: null
        });
    }

    render() {

        const { props } = this;
        let { model } = props;

        return (
            <div className="album-card" aria-expanded={this.isExpanded}>

                <header className="album-header" onClick={this.handleHeaderClick}>

                    <div className="album-arrow">
                        <span className="fa fa-chevron-down"/>
                    </div>

                    <div className="album-cover">
                        <div className="album-cover-image" style={{ backgroundImage: `url(${model.coverUrl})` }} />
                    </div>

                    <div className="album-info">
                        <h2 className="album-name">

                            <input className="album-name-input"
                                type="text"
                                spellCheck={false}
                                placeholder="Enter album name"
                                value={this.isNameInputFocused ? this.nameInputValue : model.name}
                                onChange={this.handleNameInputChange}
                                onFocus={this.handleNameInputFocus}
                                onBlur={this.handleNameInputBlur} />
                        </h2>

                        <h4 className="album-details">
                            <span className="value">{model.photos.length} photos</span>
                            <span className="separator"> / </span>
                            <span className="label">Created </span>
                            <span className="value">{model.createdDate.fromNow()}</span>
                            <span className="separator"> / </span>
                            <span className="label">Modified </span>
                            <span className="value">{model.modifiedDate.fromNow()}</span>
                        </h4>
                    </div>

                    <div className="album-actions">

                        <div className="upload-photo-button album-action-button" role="button">
                            <span className="icon fa fa-upload" />
                            <input type="file" multiple={true} onChange={this.handleUploadInputChange} />
                        </div>

                        <button className="delete-album-button album-action-button" onClick={this.handleDeleteButtonClick}>
                            <span className="icon fa fa-trash" />
                        </button>

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

                        <div className="photo-upload-button" role="button">
                            <input type="file" multiple={true} onChange={this.handleUploadInputChange} />
                        </div>
                    </li>
                </ul>
            </div>
        );
    }

    @action
    handleUploadInputChange = (evt) => {

        evt.stopPropagation();

        const { props } = this;
        let { model } = props;

        _.forEach(evt.target.files, fileContent => {

            // fileContent instanceof File
            // see https://developer.mozilla.org/en-US/docs/Web/API/File

            model.uploadPhoto({
                fileContent
            });
        });
    }

    @action
    handleHeaderClick = () => {
        this.isExpanded = !this.isExpanded;
        if (this.isExpanded)
            this.props.model.fetch();
    }

    handleDeleteButtonClick = () =>
        this.props.model.delete();

    @action
    handleNameInputChange = evt =>
        this.nameInputValue = evt.target.value;

    @action
    handleNameInputFocus = evt => {
        
        this.isNameInputFocused = true;
        this.nameInputValue = this.props.model.name || '';
    }

    @action
    handleNameInputBlur = () => {
        this.props.model.update({
            name: this.nameInputValue
        });

        this.isNameInputFocused = false;
        this.nameInputValue = null;
    }
}