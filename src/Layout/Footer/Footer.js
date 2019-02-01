import React, { Component } from 'react';

export default class Footer extends Component {
    render() {
        return (
            <header className="App-header">
                <div className="uk-text-center uk-column-1-2 uk-column-divider uk-padding">
                    <p>Made by <a href="https://komlosidev.net/">Peter Komlósi</a></p>
                    <p><a href="https://github.com/thavixt/ranked-play-sim/">Source code on Github</a></p>
                </div>
            </header>
        );
    }
}
