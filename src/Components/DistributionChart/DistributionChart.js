import React, { Component } from 'react';
import Chart from 'chart.js';
import "./DistributionChart.css";

export default class DistributionChart extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.chart = null;
    }

    componentDidMount() {
        this.createChart();
        // Initial render
        this.updateChart();
    }

    componentDidUpdate() {
        this.updateChart();
    }

    updateChart() {
        let players = this.props.players.filter(player => player.games.placementGames.length === 10);
        // Separate tiers
        const bronze = players.filter(player => player.rank.tier === 1).length;
        const silver = players.filter(player => player.rank.tier === 2).length;
        const gold = players.filter(player => player.rank.tier === 3).length;
        const platinum = players.filter(player => player.rank.tier === 4).length;
        const diamond = players.filter(player => player.rank.tier === 5).length;
        const masterPlayers = players.filter(player => player.rank.tier === 6);
        const master = masterPlayers.length;
        // Top 200 of Master tier by Skill Rating (max 1% of the players)
        const grandMaster = masterPlayers
            .sort((a, b) => a.skillRating - b.skillRating) // Sort by SR
            .splice(-players.length * 0.01) // Get the top 1% max
            .length;
        // Update chart data
        this.chart.data.datasets[0].data = [bronze, silver, gold, platinum, diamond, master, grandMaster];
        this.chart.update();
    }

    createChart() {
        const type = "pie";

        // DATA object
        const data = {
            labels: ["Bronze", "Silver", "Gold", "Platinum", "Diamond", "Master", "Grand Master"],
            datasets: [{
                label: '',
                data: [0],
                backgroundColor: [
                    "rgba(205, 127, 50, 0.8)",
                    "rgba(210, 210, 210, 0.8)",
                    "rgba(255, 223, 0, 0.8)",
                    "rgba(36, 86, 223, 0.8)",
                    "rgba(162, 11, 218, 0.8)",
                    "rgba(100, 100, 100, 0.8)",
                    "rgba(50, 50, 50, 0.8)",
                ],
                //fill: false,
            }]
        };

        // OPTIONS object
        const options = {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: true,
                text: "Number of players in each tier"
            },
            legend: {
                display: true
            },
            tooltips: {
                enabled: true
            },
        };

        // Create chart 
        this.chart = new Chart(this._canvas, {
            type: type,
            data: data,
            options: options
        });
    }

    render() {
        return (
            <div className="DistributionChart-container">

                <h3 className="uk-text-center">Tier distribution</h3>
                <div className="DistributionChart">
                    <canvas ref={ref => this._canvas = ref}>
                    </canvas>
                </div >
            </div >
        )
    }
}
