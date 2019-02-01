import React, { Component } from 'react';

import SeasonController from "../../Components/SeasonController/SeasonController";

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //
        };
    }
    render() {
        return (
            <div className="uk-background-muted">
                <SeasonController />
            </div>
        );
    }
}
