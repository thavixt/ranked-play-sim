import React, { Component } from 'react';
import "./PlayerList.css";

// Components
import PlayerItem from "../PlayerItem/PlayerItem";
import PlayerModal from "../PlayerModal/PlayerModal";

export default class PlayerList extends Component {

	openPlayerModal(player) {
		this._playerModal.show(player);
	}

	render() {
		//console.log("PlayerList:", this.props.players);

		// Sort by skill rating - highest first
		let players = this.props.players;
		//let players = this.props.players.sort((a, b) => { return b.skillRating - a.skillRating });

		// Create items
		let playerItems = players.map((val, i, arr) =>
			<PlayerItem key={val.uid} player={val}
				openModal={this.openPlayerModal.bind(this)}
			/>
		);

		return (
			<div className="playerList-container" id={this.props.id}>

				<h3 className="uk-text-center">Player List</h3>
				<div className="playerList">
					{playerItems}
				</div>

				<PlayerModal id="PlayerModal" ref={ref => this._playerModal = ref} />
			</div>
		);
	}
}
