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


// pattern 3, computed properties

@observer
class MobxState extends React.Component {

    constructor() {
        super();

        extendObservable(this, {
            numbers: [2, 4, 15], // will be converted to observable.array

            // both props will be converted tot computed properties
            get sum() { return this.numbers.reduce((sum, x) => sum + x, 0); },
            get avg() { return this.sum / (this.numbers.length + 1); }
        });
    }

    // only avg is used below, but will re-render if any of avg's dependencies changes
    render() {
        return (
            <div>
                <div>average: {this.avg}</div>
                <button onClick={this.handleIncrement}>increment second number</button>
            </div>
        );
    }

    // will trigger a re-render, because this.numbers[1] is used by sum (reduce),
    // and sum is used by avg, which was tracked as a dependency for the render method 
    handleIncrement = () => this.numbers[1]++;
}


ReactDOM.render(<MobxState />, document.getElementById('root'));