import React, { Component } from 'react';
import "./PlayerModal.css";

import Chart from 'chart.js';
import UIkit from 'uikit';

//import Player from "../../Logic/Player.class";

export default class PlayerModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            player: {},
            //matchesPlayed: 0,
            placementsPlayed: 0,
            lastRankedGame: {},
            lastRankedGameDetails: null,
            ratingChanges: [],
            ratingHistory: []
        };
        this._modal = null;
        this._canvas = null;
    }

    componentDidMount() {
        this.createChart();
        // Initial render
        this.updateStats(this.state.player, true);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.updateStats(this.state.player, true);
    }

    /**
     * Show and update modal with a Player's statistics.
     * @param {*} player 
     */
    show(player) {
        this._modal = UIkit.modal("#" + this.props.id);
        this.setState({ player: player });
        this.updateStats(player, true);
        //console.log(typeof this._modal, player);
        // If the modal is not initialized yet, try again later
        if (this._modal === undefined) {
            window.setTimeout(() => {
                this.show(player);
            }, 100);
        }
        // Show updated modal
        else {
            this._modal.show();
        }
    }

    /**
     * Hide modal.
     */
    hide() {
        this._modal.hide();
    }

    /**
     * Switch the target Player without reopening the modal.
     * @param {Player} player 
     */
    switchTo(player) {
        //console.log("SWITCH: ", player);
        this.setState({ player: player });
        this.updateStats(player, true);
    }

    /**
     * Update the stats of the current player.
     * @param {Player} player 
     * @param {boolean=true} forceUpdate=true
     */
    updateStats(player, forceUpdate = false) {
        //const player = this.state.player
        // Don't update on default params
        if (!player.uid) return false;
        // Don't update when the modal is hidden
        //if (!forceUpdate || !this._modal.isToggled()) return false;

        //const matchesPlayed = (player.games.wins + player.games.losses);
        const placementsPlayed = player.games.placementGames.length;
        const lastRankedGame = player.games.rankedGames.length ? player.games.rankedGames.slice(-1)[0] : false;

        let lastRankedGameDetails = null;
        if (lastRankedGame) {
            const onTeam = lastRankedGame.didWin ? lastRankedGame.winnerTeamIndex : lastRankedGame.loserTeamIndex;
            const teamOneResult = lastRankedGame.winnerTeamIndex === 0 ? " winner" : " loser";
            const teamTwoResult = lastRankedGame.winnerTeamIndex === 1 ? " winner" : " loser";
            const teamOneSide = onTeam === 0 ? " own" : " opponent";
            const teamTwoSide = onTeam === 1 ? " own" : " opponent";
            lastRankedGameDetails = (
                <div>
                    <h3>Last match</h3>
                    <div>Result: {lastRankedGame.didWin ? "win" : "loss"}</div>
                    <div className="uk-grid-collapse uk-grid-match uk-child-width-1-2@s uk-flex-top match" uk-grid="true">
                        <div className={"team left" + teamOneResult + teamOneSide}>
                            <span onClick={() => this.switchTo(lastRankedGame.teams[0][0])}>
                                #{lastRankedGame.teams[0][0].uid}
                            </span>
                            <span onClick={() => this.switchTo(lastRankedGame.teams[0][1])}>
                                #{lastRankedGame.teams[0][1].uid}
                            </span>
                            <span onClick={() => this.switchTo(lastRankedGame.teams[0][2])}>
                                #{lastRankedGame.teams[0][2].uid}
                            </span>
                        </div>
                        <div className={"team right" + teamTwoResult + teamTwoSide}>
                            <span onClick={() => this.switchTo(lastRankedGame.teams[1][0])}>
                                #{lastRankedGame.teams[1][0].uid}
                            </span>
                            <span onClick={() => this.switchTo(lastRankedGame.teams[1][1])}>
                                #{lastRankedGame.teams[1][1].uid}
                            </span>
                            <span onClick={() => this.switchTo(lastRankedGame.teams[1][2])}>
                                #{lastRankedGame.teams[1][2].uid}
                            </span>
                        </div>
                    </div>
                </div>
            );
        }

        const ratingChangeList = [];
        const ratingHistory = [];
        const ratingChanges = player.games.rankedGames.map((match, i) => {
            // ratingChangeList - List of rating changes (rating, +/-)
            ratingChangeList.push(
                <span key={i} className={match.ratingChange > 0 ? "gain" : "loss"}>
                    {match.skillRating} ({match.ratingChange > 0 ? "+" : ""}{match.ratingChange})
                    </span>);
            // ratingHistory - Chart data
            ratingHistory.push(match.skillRating);
            // ratingChanges - Chart labels
            if (match.ratingChange > 0)
                return "+" + match.ratingChange.toString();
            else return match.ratingChange.toString();
        });

        // Reverse the order of the Chart data and labels,
        // so the most recent item is on the right side of the chart.
        ratingHistory.reverse();
        ratingChanges.reverse();

        this.setState({
            //matchesPlayed: matchesPlayed,
            placementsPlayed: placementsPlayed,
            lastRankedGame: lastRankedGame,
            lastRankedGameDetails: lastRankedGameDetails,
            ratingChangeList: ratingChangeList
        });

        //if (forceUpdate) {
        this.updateChart(ratingChanges, ratingHistory);
        //}
    }

    /**
     * Initial chart creation and render with no data.
     */
    createChart() {
        const type = "line";

        // DATA object
        const data = {
            labels: [0, 0, 0], // labels,
            datasets: [{
                label: '',
                data: [0, 0, 0], // datapoints,
                backgroundColor: "rgba(50,50,50,0.8)",
                fill: false,
            }]
        };

        // OPTIONS object
        const options = {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: false,
                text: ""
            },
            legend: {
                display: false
            },
            tooltips: {
                enabled: false
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        drawTicks: false,
                        //stepSize: 100
                    },
                    gridLines: {
                        display: true
                    }
                }],
                xAxes: [{
                    barPercentage: 1, // 0.9
                    categoryPercentage: 0.7, // 0.8
                    gridLines: {
                        display: false
                    }
                }],
            }
        };

        this.chart = new Chart(this._canvas, {
            type: type,
            data: data,
            options: options
        });
    }

    /**
     * Update the chart labels and data.
     * @param {*} labels 
     * @param {*} data 
     */
    updateChart(labels, data) {
        this.chart.data.labels = labels;
        this.chart.data.datasets[0].data = data;
        this.chart.update();
    }

    render() {
        return (
            <div className="playerModal-container">

                <div id={this.props.id} className="uk-modal-full playerModal" uk-modal="true">
                    <div className="uk-modal-dialog" uk-overflow-auto="true">
                        <button className="uk-modal-close-full uk-close-large" type="button" uk-close="true"></button>
                        <div className="uk-grid-collapse uk-grid-match uk-child-width-1-2@s uk-flex-top" uk-grid="true">

                            <div className="uk-padding-large playerModal-side left">
                                <h3>Player ID:</h3>
                                <h1>#{this.state.player.uid}</h1>
                                <hr />

                                {this.state.player.uid &&
                                    <div className="rating">
                                        <p> Skill Rating: {this.state.player.skillRating}</p>
                                        {/* Rank: T{player.rank.tier} D{player.rank.division} */}
                                        <p>
                                            <strong>Rank: {this.state.player.getRank()}</strong>
                                        </p>
                                        <p>Ranked points: {this.state.player.rank.score} / {this.state.player.SCORE_PER_DIVISION}</p>
                                        <p>Placement rank: {this.state.player.getPlacementRank()}</p>
                                    </div>
                                }
                                <hr />

                                {this.state.player.uid &&
                                    <div className="winrate">
                                        <p>Winrate: {this.state.player.getWinrate()}%</p>
                                    </div>
                                }
                                <br />
                                <br />

                                <div className="played">
                                    <p>Placement matches played: {this.state.placementsPlayed}</p>
                                    {this.state.player.uid &&
                                        <div className="match-count">
                                            <p>Ranked matches played: {this.state.player.games.wins + this.state.player.games.losses}</p>
                                        </div>
                                    }
                                </div>
                            </div>

                            <div className="uk-padding-large playedModal-side right">
                                <h2>Match history</h2>
                                <div className="last-ranked">
                                    {this.state.lastRankedGameDetails ?
                                        (this.state.lastRankedGameDetails)
                                        : (<p>No ranked games yet.</p>)
                                    }
                                </div>
                                <hr />

                                <div className="rating-changes">
                                    <h3>Rating history</h3>
                                    <div className="uk-flex uk-flex-left">
                                        <div className="rating-changes-list">
                                            {this.state.ratingChangeList}
                                        </div>
                                        <div className="rating-changes-chart uk-flex-1">
                                            <canvas ref={ref => this._canvas = ref}></canvas>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        );
    }
}
