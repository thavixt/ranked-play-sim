import React, { Component } from 'react';

export default class Header extends Component {
    render() {
        return (
            <header className="App-header">
                <nav className="uk-navbar-container uk-background-secondary" uk-navbar="true">
                    <div className="uk-navbar-center">

                        <h1 className="App-title">Ranked Play Simulator</h1>

                        {/* <ul className="uk-navbar-nav">
                            <li className="uk-active"><a href="#">Active</a></li>
                            <li>
                                <a href="#">Parent</a>
                                <div className="uk-navbar-dropdown">
                                    <ul className="uk-nav uk-navbar-dropdown-nav">
                                        <li className="uk-active"><a href="#">Active</a></li>
                                        <li><a href="#">Item</a></li>
                                        <li><a href="#">Item</a></li>
                                    </ul>
                                </div>
                            </li>
                            <li><a href="#">Item</a></li>
                        </ul> */}

                    </div>
                </nav>
            </header>
        );
    }
}
