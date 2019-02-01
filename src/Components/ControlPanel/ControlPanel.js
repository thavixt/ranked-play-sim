import React, { Component } from 'react';
import './ControlPanel.css';

export default class ControlPanel extends Component {
    render() {
        return (
            <div className="ControlPanel" hidden={this.props.hidden}>
                <div className="control-grid">
                    {/* Add player buttons */}
                    <div className="uk-button-group">
                        <button className="uk-button uk-button-secondary uk-button-small"
                            onClick={(e) => this.props.createPlayers(10)}
                            disabled={this.props.playerCount >= this.props.maxPlayerCount}>
                            Add 10 players</button>
                        <button className="uk-button uk-button-secondary uk-button-small"
                            onClick={(e) => this.props.createPlayers(25)}
                            disabled={this.props.playerCount >= this.props.maxPlayerCount}>
                            Add 25 players</button>
                    </div>

                    {/* Main control buttons - Start, Stop, Reset */}
                    <div className="uk-button-group">
                        {this.props.process ?
                            /* Autoplay is ON - Stop and Reset buttons */
                            (<button className="uk-button uk-button-danger uk-button-small"
                                onClick={(e) => this.props.stopSeason()}
                                disabled={(!this.props.process)}>
                                Stop season</button>)
                            :
                            /* Autoplay is Off - Start and Reset buttons */
                            (<button className="uk-button uk-button-primary start-button uk-button-small"
                                onClick={(e) => this.props.startSeason()}
                                disabled={(this.props.process) ? true :
                                    !(this.props.playerCount && this.props.playerCount >= this.props.minPlayerCount)}>
                                Start season</button>)
                        }
                        <button className="uk-button uk-button-danger uk-button-small"
                            onClick={(e) => this.props.resetSeason()}>
                            Reset season</button>
                    </div>

                    {/* Play match buttons */}
                    <div className="uk-button-group">
                        <button className="uk-button uk-button-secondary uk-button-small"
                            onClick={(e) => this.props.playMatches(1)}
                            disabled={(this.props.process) ? true : !(this.props.playerCount)}>
                            Play a match</button>
                        <button className="uk-button uk-button-secondary uk-button-small"
                            onClick={(e) => this.props.playMatches(10)}
                            disabled={(this.props.process) ? true : !(this.props.playerCount)}>
                            Play 10 matches</button>
                    </div>

                    {/* State Save and Load buttons */}
                    {this.props.exportAllowed ?
                        /* Option to save/load is allowed */
                        (<div className="uk-button-group">
                            <button className="uk-button uk-button-primary uk-button-small"
                                disabled={(this.props.process) ? true : !(this.props.playerCount)}
                                onClick={(e) => this.props.downloadState()}>
                                Export state</button>

                            {this.props.process ?
                                /* Autoplay is ON - fake button */
                                (<button className="uk-button uk-button-primary uk-button-small"
                                    disabled={true}>
                                    Import state</button>)
                                :
                                /* Autoplay is OFF - real buttons */
                                (<span>
                                    <label className="uk-button uk-button-primary uk-button-small"
                                        htmlFor="state-input" disabled={(this.props.process)}>
                                        Import state</label>
                                    <input type="file" id="state-input" accept=".json" hidden={true}
                                        onChange={(e) => this.props.loadState(e.target.files[0])} />
                                </span>)
                            }
                        </div>)
                        :
                        /* Option to save/load is NOT allowed - fake buttons */
                        (<div className="uk-button-group">
                            <button className="uk-button uk-button-primary uk-button-small"
                                disabled={true}>
                                Export state</button>
                            <button className="uk-button uk-button-primary uk-button-small"
                                disabled={true}>
                                Import state</button>
                        </div>)
                    }
                </div>

                {/* Tab switching */}
                <ul className="tab-switcher" uk-tab="true">
                    <li className={this.props.activeTab === 1 ? "uk-active" : ""}>
                        <a onClick={(e) => this.props.changeActiveTab(1)}
                            type="button">
                            Distribution</a>
                    </li>
                    <li className={this.props.activeTab === 2 ? "uk-active" : ""}>
                        <a onClick={(e) => this.props.changeActiveTab(2)}
                            type="button">
                            Tier charts</a>
                    </li>
                    <li className={this.props.activeTab === 3 ? "uk-active" : ""}>
                        <a onClick={(e) => this.props.changeActiveTab(3)}
                            type="button">
                            Player list</a>
                    </li>
                </ul>

                {/* <div className="uk-container">
                    <div className="uk-button-group">
                        <button className="uk-button uk-button-primary uk-button-small"
                            onClick={(e) => this.props.changeActiveTab(1)}
                            type="button" disabled={this.props.activeTab === "DistributionChart"}>
                            Distribution</button>
                        <button className="uk-button uk-button-secondary uk-button-small"
                            onClick={(e) => this.props.changeActiveTab(2)}
                            type="button" disabled={this.props.activeTab === "TierChartList"}>
                            Tier charts</button>
                        <button className="uk-button uk-button-secondary uk-button-small"
                            onClick={(e) => this.props.changeActiveTab(3)}
                            type="button" disabled={this.props.activeTab === "PlayerList"}>
                            Player list</button>
                    </div>
                </div> */}
            </div>
        )
    }
}
