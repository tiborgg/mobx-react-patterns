'use strict';

import * as React from 'react';
import PropTypes from 'prop-types';
import { observable, extendObservable, action } from 'mobx';
import { observer } from 'mobx-react';
import _ from 'lodash';

import Photo from '../data/photo';

@observer
export default class PhotoCard
    extends React.Component {

    static propTypes = {
        model: PropTypes.instanceOf(Photo).isRequired
    }

    constructor() {
        super();

        extendObservable(this, {

            isNameInputFocused: false,
            nameInputValue: null
        });
    }

    render() {

        const { props } = this;
        let { model } = props;

        let className = 'photo-card ' + model.syncState;

        return (
            <div className={className}
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}>

                <div className="photo-thumb" style={{ backgroundImage: `url(${model.url})` }}>

                    <div className="photo-overlay">

                        <button className="photo-delete-button" onClick={this.handleDeleteButtonClick}>
                            <span className="icon fa fa-trash" />
                        </button>

                        <div className="photo-info">
                            <div className="photo-info-name">{model.name}</div>

                            <div className="photo-details">
                                <span className="value">{model.displaySize}</span>
                                <span className="separator"> / </span>
                                <span className="value">{model.width} x {model.height}</span>
                            </div>
                            <div className="photo-created-date">Created <span className="value">{model.createdDate.fromNow()}</span></div>
                        </div>
                    </div>

                    <div className="photo-upload-overlay">

                        <div className="upload-progress">
                            <div className="upload-progress-bar" style={{ width: (model.uploadProgress * 100) + '%' }}></div>
                        </div>
                    </div>
                </div>

                <div className="photo-name">

                    <textarea className="photo-name-input"
                        placeholder="Enter photo name"
                        spellCheck={false}
                        value={this.isNameInputFocused ? this.nameInputValue : model.name}
                        onChange={this.handleNameInputChange}
                        onFocus={this.handleNameInputFocus}
                        onBlur={this.handleNameInputBlur} />
                </div>
            </div>
        );
    }

    handleMouseEnter = evt => {

        let { model } = this.props;
        if (model.syncState !== 'uploading' && model.syncState !== 'synced')
            model.fetch();
    }

    handleMouseLeave = evt => { }

    handleDeleteButtonClick = () => {

        let { model } = this.props;
        model.delete();
    }

    @action
    handleNameInputChange = evt =>
        this.nameInputValue = evt.target.value;

    @action
    handleNameInputFocus = () => {

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