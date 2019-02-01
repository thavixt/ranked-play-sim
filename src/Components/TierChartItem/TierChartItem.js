import React, { Component } from 'react';
import Chart from 'chart.js';
import "./TierChartItem.css";

//const TEST_DATA = [123, 125, 531, 324, 132, 432, 123, 420];

export default class TierChartItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            playerCount: 0,
            divisionPopulations: []
        };
        this.chart = null;
    }

    componentDidMount() {
        this.createChart();
        // Initial render
        this.updateStats(this.props.players);
        this.updateChart();
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.updateStats(nextProps.players);
    }

    componentDidUpdate() {
        this.updateChart();
    }

    updateStats(players) {
        if (this.props.noDivisions) {
            let ratingScores = players.map((player) => player.skillRating).sort((a, b) => a - b);
            // Store in an array to use as a Chart.js dataset
            this.setState({
                playerCount: ratingScores.length,
                divisionPopulations: ratingScores
            });
        }
        // Separate data by divisions
        else {
            // Get all division numbers
            let divisionNumbers = players.map((player) => player.rank.division);
            // Group by occurence
            let divisionPopulations = divisionNumbers.reduce(function (acc, curr) {
                acc[curr] ? acc[curr]++ : acc[curr] = 1;
                return acc;
            }, {});
            // Store in an array to use as a Chart.js dataset
            this.setState({
                playerCount: divisionNumbers.length,
                divisionPopulations: [
                    divisionPopulations[1],
                    divisionPopulations[2],
                    divisionPopulations[3],
                    divisionPopulations[4],
                    divisionPopulations[5]
                ]
            });
        }
    }

    updateChart() {
        //console.log("Updating " + this.props.tierName+ " tier chart.");
        if (this.props.noDivisions) {
            this.chart.data.labels = this.state.divisionPopulations;
        }
        this.chart.data.datasets[0].data = this.state.divisionPopulations;
        this.chart.options.title.text = this.props.tierName + " tier - " + this.state.playerCount + " players";
        this.chart.update();
        /* if (this.props.noDivisions) {
            console.log("data:", this.chart.data.datasets[0].data);
            console.log("label:", this.chart.data.labels);
        } */
    }

    createChart() {
        const type = this.props.noDivisions ? "line" : "bar";

        // DATA object
        const data = {};
        if (this.props.noDivisions) {
            data.labels = [];
            data.datasets = [{
                label: '',
                data: this.state.divisionPopulations,
                backgroundColor: "rgba(" + this.props.color.join(', ') + ", 0.8)",
                fill: false,
            }];
        }
        else {
            data.labels = ["Div. I", "Div. II", "Div. III", "Div. IV", "Div. V"];
            data.datasets = [{
                label: '',
                data: this.state.divisionPopulations,
                backgroundColor: "rgba(" + this.props.color.join(', ') + ", 0.8)"
            }];
        }

        // OPTIONS object
        const options = {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: true,
                text: this.props.tierName + " tier - " + this.state.playerCount + " players"
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
                        stepSize: 10
                    },
                    gridLines: {
                        display: false
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

        if (this.props.noDivisions) {
            options.scales.yAxes[0].ticks.stepSize = 500;
        }

        //console.log("Creating " + this.props.tierName+ " tier chart. Data: ", data);
        this.chart = new Chart(this._canvas, {
            type: type,
            data: data,
            options: options
        });
    }

    render() {
        //console.log(this.props.tierName, this.props.players, this.state);
        return (
            <div className="TierChartItem-container">
                <div className="TierChartItem">
                    <canvas ref={ref => this._canvas = ref}>
                    </canvas>
                </div >
            </div >
        )
    }
}
