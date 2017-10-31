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







// import * as React from 'react';
// import { render } from 'react-dom';
// import { observable } from 'mobx';
// import { observer } from 'mobx-react';

// window.WhyMobX = observable({
//     because: "It's awesome"
// });

// @observer
// class WhyMobX extends React.Component {

//     render() {

//         return <div>{WhyMobX.because}</div>
//     }
// }

// render(<WhyMobX />, document.getElementById('whatever'));

// setTimeout(() => {
//     WhyMobX.because = 'This is how you update your UI like a boss';
// }, 1000);

// @observer
// class MobxState extends React.Component {

//     constructor() {
//         super();

//         extendObservable(this, {
//             counter: 0
//         });
//     }

//     render() {

//         return (
//             <div>
//                 <div>{this.counter}</div>
//                 <button onClick={this.handleIncrement}>increment</button>
//             </div>
//         );
//     }

//     handleIncrement = () => {

//         this.counter++;
//     }
// }


// ReactDOM.render(<MobxState />, document.getElementById('root'));