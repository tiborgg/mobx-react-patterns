'use strict';

import './style.less';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { observable, extendObservable, action } from 'mobx';
import { observer } from 'mobx-react';
import DevTools from 'mobx-react-devtools';

import ApiConnector from './api/apiConnector';
import PhotoBrowser from './components/photoBrowser';
import PhotosStore from './data/photosStore';

@observer
class App extends React.Component {

    constructor() {
        super();

        this.apiConnector = new ApiConnector();

        extendObservable(this, {
            photosStore: new PhotosStore(this.apiConnector)
        });

        this.photosStore.fetchPhotos();
    }

    render() {

        return (
            <div className='app'>

                <header>
                    <h1 className="app-title">MobX / React photo albums</h1>
                </header>

                <PhotoBrowser store={this.photosStore} />
            </div>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);