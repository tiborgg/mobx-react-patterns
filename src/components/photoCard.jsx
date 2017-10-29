'use strict';

import * as React from 'react';
import PropTypes from 'prop-types';
import { observable, extendObservable, action } from 'mobx';
import { observer } from 'mobx-react';

import Photo from '../data/photo';

@observer
export default class PhotoCard
    extends React.Component {

    static propTypes = {
        model: PropTypes.instanceOf(Photo).isRequired
    }

    constructor() {
        super();


    }

    render() {

        const { props } = this;
        let { model } = props;

        return (
            <div className="photo-card">
                <div className="photo-thumb">

                </div>

                <div className="photo-name">
                    {model.name}
                </div>
            </div>
        );
    }
}