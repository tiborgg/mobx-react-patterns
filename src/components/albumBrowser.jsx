'use strict';

import * as React from 'react';
import { observable, extendObservable, action } from 'mobx';
import { observer } from 'mobx-react';

import AlbumCard from './albumCard';

@observer
export default class AlbumBrowser
    extends React.Component {

    constructor() {
        super();

        extendObservable(this, {
            createInputValue: ''
        });
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
                    Create new album

                    <input type="text"
                        value={this.createInputValue}
                        onChange={this.handleCreateInputChange} />

                    <button onClick={this.handleCreateButtonClick}>Create</button>
                </li>
            </ul>
        );
    }

    @action
    handleCreateInputChange = (evt) =>
        this.createInputValue = evt.target.value;

    
    handleCreateButtonClick = (evt) => {

        this.props.albumsStore.createAlbum({
            name: this.createInputValue
        });
    }
}