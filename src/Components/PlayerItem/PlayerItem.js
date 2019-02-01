import React, { Component } from 'react';
import "./PlayerItem.css";

export default class PlayerItem extends Component {
    render() {
        let player = this.props.player;
        //let matchesPlayed = player.games.placementGames.length + (player.games.wins + player.games.losses);

        /* const defaultStyle = {
            backgroundColor: "transparent",
            color: "rgba(30, 30, 30, 0.8)"
        };
        const TIERCOLORS = [
            "rgb(165, 120, 55)",
            "rgb(180, 180, 180)",
            "rgb(255, 200, 0)",
            "rgb(85, 125, 240)",
            "rgb(160, 10, 220)",
            "rgb(100, 100, 100)",
            "rgb(30, 30, 30)",
        ]; */

        return (
            <div className="playerItem-container">
                <div className={"playerItem " + (player.games.placementGames.length < 10 ? "default" : "tier" + player.rank.tier)}
                    onClick={(e) => this.props.openModal(player)}>
                    <div className="uid uk-text-truncate">
                        <p>#{player.uid}</p>
                    </div>
                    <div className="rating">
                        <p>SR: {player.skillRating}</p>
                        <p>Rank: {player.getRank()}</p>
                        {/* <p>Ranked points: {player.rank.score}</p> */}
                    </div>
                    <div className="winrate">
                        <p>Winrate: {player.getWinrate()}%</p>
                    </div>
                    {/* <div className="played">
                        <p>{needsPlacementGames ?
                            <strong>(Placements)</strong> :
                            <span>Matches played: {matchesPlayed}</span>
                        }</p>
                    </div> */}
                </div>
            </div>
        );
    }
}
