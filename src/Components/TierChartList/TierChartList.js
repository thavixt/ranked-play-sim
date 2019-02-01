import React, { Component } from 'react';
import "./TierChartList.css";

import TierChartItem from "../TierChartItem/TierChartItem";

export default class TierChartList extends Component {
    render() {

        let players = this.props.players.filter(player => player.games.placementGames.length === 10);
        // Separate tiers
        const bronze = players.filter(player => player.rank.tier === 1);
        const silver = players.filter(player => player.rank.tier === 2);
        const gold = players.filter(player => player.rank.tier === 3);
        const platinum = players.filter(player => player.rank.tier === 4);
        const diamond = players.filter(player => player.rank.tier === 5);
        const master = players.filter(player => player.rank.tier === 6);
        // Top 200 of Master tier by Skill Rating (max 1% of the players)
        const grandMaster = master
            .sort((a, b) => a.skillRating - b.skillRating) // Sort by SR
            .splice(-players.length * 0.01); // Get the top 1% max

        return (
            <div className="TierChartList-container" id={this.props.id}>

                <h3 className="uk-text-center">Tier charts</h3>
                <div className="TierChartList">
                    <TierChartItem
                        players={bronze}
                        tierName="Bronze"
                        color={[205, 127, 50]} />
                    <TierChartItem
                        players={silver}
                        tierName="Silver"
                        color={[210, 210, 210]} />
                    <TierChartItem
                        players={gold}
                        tierName="Gold"
                        color={[255, 223, 0]} />
                    <TierChartItem
                        players={platinum}
                        tierName="Platinum"
                        color={[36, 86, 223]} />
                    <TierChartItem
                        players={diamond}
                        tierName="Diamond"
                        color={[162, 11, 218]} />
                </div>

                <div className="TierChartList">
                    <TierChartItem
                        players={master}
                        tierName="Master"
                        noDivisions
                        color={[50, 50, 50]} />
                    <TierChartItem
                        players={grandMaster}
                        tierName="Grand Master"
                        noDivisions
                        color={[50, 50, 50]} />
                </div>
            </div>
        )

    }
}
