'use strict';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { observable, extendObservable, action } from 'mobx';
import { observer } from 'mobx-react';
import DevTools from 'mobx-react-devtools';

class Album {

    constructor(props) {

        extendObservable(this, {

            id: props.id,

            _photos: observable.map(),
            get photos() {

                return this._photos.values();
            }
        });
    }
}

class Photo {

    constructor(props) {

        extendObservable(this, {

            id: props.id,
            name: props.name,
            url: props.url,
            thumbnailUrl: props.thumbnailUrl,

            isUploading: false,
            uploadProgressSize: 0
        });
    }

    upload() {


    }
}


@observer
class App extends React.Component {

    constructor() {
        super();


    }

    render() {
        return (
            <div className='app'>

            </div>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);