'use strict';

import * as React from 'react';
import { observable, extendObservable, action } from 'mobx';
import { observer } from 'mobx-react';

import AlbumCard from './albumCard';

export default class AlbumBrowser
    extends React.Component {

    constructor() {
        super();


    }

    render() {

        const { props } = this;
        let { albumsStore } = props;

        return (
            <ul className="album-browser">
                {albumsStore.albums.map(album => {

                    return (
                        <li className="album-item" key={album.id}>
                            <AlbumCard model={album} />
                        </li>
                    );
                })}

                <li className="album-item album-create-item" key="$createItem">
                    create new
                </li>
            </ul>
        );
    }
}