'use strict';

import './style.less';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { observable, extendObservable, action } from 'mobx';
import { observer } from 'mobx-react';
import DevTools from 'mobx-react-devtools';

import ApiConnector from './api/apiConnector';
import AlbumBrowser from './components/albumBrowser';
import AlbumsStore from './albumsStore';

@observer
class App extends React.Component {

    constructor() {
        super();

        this.apiConnector = new ApiConnector();

        extendObservable(this, {
            albumsStore: new AlbumsStore(this.apiConnector)
        });
    }

    render() {
        return (
            <div className='app'>

                <header>
                    <h1>MobX / React photo albums</h1>
                </header>

                <AlbumBrowser albumsStore={this.albumsStore} />

                <footer>

                </footer>
            </div>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);