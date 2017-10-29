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

        return (
            <div className="photo-card" 
                onMouseEnter={this.handleMouseEnter} 
                onMouseLeave={this.handleMouseLeave}>

                <div className="photo-thumb" style={{ backgroundImage: `url(${model.url})` }}></div>

                <div className="photo-name">

                    <textarea className="photo-name-input"
                        placeholder="Enter photo name"
                        value={this.isNameInputFocused ? this.nameInputValue : model.name}
                        onChange={this.handleNameInputChange}
                        onFocus={this.handleNameInputFocus}
                        onBlur={this.handleNameInputBlur} />
                </div>

                <div className="photo-overlay">
                    <button className="photo-delete-button" onClick={this.handleDeleteButtonClick}>
                        <span className="icon fa fa-trash" />
                    </button>

                    <div className="photo-info">

                    </div>
                </div>

                {(model.syncState === 'uploading') ? (
                    <div>upload progress: {model.uploadProgressSize}</div>
                ) : null}
            </div>
        );
    }

    handleMouseEnter = evt => {}
        //this.props.model.fetch();
        
    handleMouseLeave = evt => {}

    handleDeleteButtonClick = () =>
        this.props.model.delete();

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