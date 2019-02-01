import React, { Component } from 'react';
import UIkit from "uikit";
import './SeasonController.css';

// Classes
import Match from "../../Logic/Match.class";
import Player from "../../Logic/Player.class";

// Components
import ControlPanel from "../ControlPanel/ControlPanel";
import DistributionChart from "../DistributionChart/DistributionChart";
import PlayerList from "../PlayerList/PlayerList";
import TierChartList from "../TierChartList/TierChartList";

// Utils
import CircularJSON from "circular-json";
import FileSaver from 'file-saver';
import { createTeams } from "../../Logic/utils";

export default class SeasonController extends Component {
	constructor(props) {
		super(props);
		this.state = {
			players: [],
			playersReplaced: 0,
			matches: [],
			activeTab: 3,
			process: null,
			exportAllowed: true,
			loading: false,
			saving: false,
		};
		this.DEFAULT_PLAYER_COUNT = 10;
		this.MAX_PLAYER_COUNT = 200;
		this.TEAM_SIZE = 3;
		this.AUTO_SPEED = 100;
	}

	componentWillMount() {
		// Load previous state
		//this.loadStateFromLocalStorage();
	}

	componentDidMount() {
		this.setState({ loading: false });
		// Check API support
		if (typeof window.FileReader !== 'function' || typeof window.Blob !== 'function') {
			this.setState({ exportAllowed: false });
			console.error("The FileReader and/or Blob APIs are not supported on this browser yet.\nYou will not be able to export or import states.");
			UIkit.notification({
				message: 'The FileReader and/or Blob APIs are not supported on this browser yet.<br>You will not be able to download and load states.',
				status: 'danger',
				pos: 'bottom-right',
				timeout: 5000
			});
		}
		// Start a new season automatically?
		this.createPlayers(this.DEFAULT_PLAYER_COUNT);
		//this.startSeason();
	}

	/**
	 * Trigger a save of the application state as a .json file.
	 */
	downloadState() {
		/* UIkit.notification({
			message: 'Saving, please wait...',
			status: 'danger',
			pos: 'top-right',
			timeout: 2000
		}); */
		this.setState({ saving: true });
		//console.log("%c Downloading state ... ", "background:black; color:white");
		const exportObj = {
			players: this.state.players,
			playersReplaced: this.state.playersReplaced,
			matches: this.state.matches,
		};
		//console.log(exportObj);
		try {
			// Wait a bit for a re-render
			setTimeout(() => {
				const serialized = CircularJSON.stringify(exportObj);
				this.downloadObjectAsJson(serialized, "rankedplaysim-export-" + (new Date()).getTime());
			}, 500);
		} catch (ex) {
			console.error("Failed to parse or save the state. The state might be too big, or contain too many circular references.\n", ex)
			UIkit.notification({
				message: 'Save failed.',
				status: 'danger',
				pos: 'top-right',
				timeout: 1000
			});
		}
		this.setState({ saving: true });
	}

	/**
	 * Download the state data as a .json file and .zip it if necessary.
	 * @param {string} serializedExportObj stringified JSON
	 * @param {string} exportName name of the file to download
	 */
	async downloadObjectAsJson(serializedExportObj, exportName) {
		// DataURIs with lengths over approx. 2,000,000 will fail to download on Chrome v64.0 64-bit
		//var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(serializedExportObj);
		//console.log(dataStr.length);
		// .zip the JSON if the serialized state gets too large
		let wasZipped = false;
		/* if (serializedExportObj.length > 1000000) {
			// It's going to be zipped
			wasZipped = true;
			// JSZip instance
			let zipper = new JSZip();
			// Add file to it
			zipper.file(exportName + ".json", serializedExportObj);
			// Create the compressed file
			zipper.generateAsync({ type: "blob" })
				.then(function (content) {
					// Download it as a ZIP file containing the JSON state
					FileSaver.saveAs(content, exportName + ".zip");
					//downloadIt(content, exportName, "zip");
				});
		} else {
			wasZipped = false;
			// Download it as a regular JSON file
			//downloadIt(dataStr, exportName, "json");
		} */
		// For now, we won't use JSZip.
		let fileBlob = new Blob([serializedExportObj], { type: "text/json;charset=utf-8" });
		FileSaver.saveAs(fileBlob, exportName + ".json");
		//return wasZipped;
		//console.log("%c State saved! ", "background:black; color:white");

		// Wait a bit for a re-render
		setTimeout(() => {
			UIkit.notification({
				message: 'State saved!',
				status: 'success',
				pos: 'top-right',
				timeout: 3000
			});
			this.setState({ saving: false });
		}, 500);

		/**
		 * Actually download it.
		 * NOTE: Replaced by FileSaver.js for better compatibility.
		 * @param {string} dataStr 
		 * @param {string} exportName 
		 * @param {string} extension
		 * function downloadIt(dataStr, exportName, extension) {
			console.log(dataStr, exportName, extension);
			var downloadAnchorNode = document.createElement('a');
			downloadAnchorNode.setAttribute("href", dataStr);
			downloadAnchorNode.setAttribute("download", exportName + "." + extension);
			downloadAnchorNode.click();
			downloadAnchorNode.remove();
		} */
	}

	/**
	 * Load the previous state from an external JSON file.
	 * @param {File} inputFile
	 */
	loadState(inputFile) {
		/* UIkit.notification({
			message: 'Loading, please wait...',
			status: 'danger',
			pos: 'top-right',
			timeout: 2000
		}); */
		this.setState({ loading: true });
		// No input file
		if (!inputFile) return false;
		//console.log("%c Loading state ... ", "background:black; color:white");
		let reader = new FileReader();
		// Load input file
		reader.onload = (e) => {
			this.restoreStateObject(e.target.result);
		}
		// Start reading the input file as text (since it's kinda JSON)
		reader.readAsText(inputFile);
	}

	/**
	 * Restore object class prototypes of the external state.
	 * @param {string} stringifiedState 
	 */
	restoreStateObject(stringifiedState) {
		try {
			// Parse circular JSON
			let loadedState = CircularJSON.parse(stringifiedState);
			// Restore class prototypes
			loadedState.players.forEach(player => player.__proto__ = Object.create(Player.prototype));
			loadedState.matches.forEach(match => match.__proto__ = Object.create(Match.prototype));
			// Set state to the restored save
			//console.log(loadedState);
			this.setState({
				players: loadedState.players,
				playersReplaced: loadedState.playersReplaced,
				matches: loadedState.matches,
			});
			//console.log("%c State loaded! ", "background:black; color:white");
			UIkit.notification({
				message: 'State loaded!',
				status: 'success',
				pos: 'top-right',
				timeout: 3000
			});
		} catch (ex) {
			console.error("Failed to parse state file. The file is probably not a valid state file, or the file has been corrupted.\n", ex);
			UIkit.notification({
				message: 'Invalid state file.',
				status: 'danger',
				pos: 'top-right',
				timeout: 10000
			});
		} finally {
			// Wait a bit for a re-render
			setTimeout(() => {
				this.setState({ loading: false });
			}, 500);
		}
	}

	/**
	 * Create the defined number of Player objects.
	 * @param {number} number of players to create 
	 */
	createPlayers(number) {
		let newPlayers = [];
		for (let i = 0; i < number; i++) {
			newPlayers.push(new Player());
		}
		// Update player list
		this.setState(prevState => ({
			players: [...prevState.players, ...newPlayers]
		}));
		UIkit.notification({
			message: 'Added ' + number + ' players',
			status: 'success',
			pos: 'top-right',
			timeout: 1000
		});
	}

	/**
	 * Play a match with randomly selected players.
	 */
	playMatch() {
		//console.log("Playing a match...");
		// Create the two random teams
		let players = this.state.players;
		let teams = createTeams(this.TEAM_SIZE, players);
		//console.log("Teams created: ", teams);

		// Play a match between the two teams
		let newMatch = new Match(...teams);
		newMatch.playMatch();
		this.handleMatchResults(newMatch);
		// Update state with the new match
		this.setState(prevState => ({
			matches: [...prevState.matches, newMatch]
		}));
	}

	/**
	 * Play several matches with randomly selected players.
	 * @param {number} numberOfMatches to play
	 */
	playMatches(numberOfMatches) {
		for (let i = 0; i < numberOfMatches; i++) {
			this.playMatch();
		}
	}

	/**
	 * Update all participating Player with the match's results.
	 * @param {Match} match to handle the results of
	 */
	handleMatchResults(match) {
		//console.log(match);
		let winnerIndex = match.winnerTeamIndex;
		let loserIndex = match.loserTeamIndex;
		// Handle match results for each Player
		for (let winner of match.teams[winnerIndex]) {
			winner.handleMatchResult(match, true);
		}
		for (let loser of match.teams[loserIndex]) {
			loser.handleMatchResult(match, false);
		}
	}

	/**
	 * Start a new season and play matches automatically.
	 */
	startSeason() {
		let process = window.setInterval(this.playMatches.bind(this, 1), this.AUTO_SPEED);
		this.setState({ process: process });
		UIkit.notification({
			message: 'Playing matches automatically...',
			status: 'success',
			pos: 'top-right',
			timeout: 1000
		});
	}

	/**
	 * Stop playing matches automatically.
	 */
	stopSeason() {
		window.clearInterval(this.state.process);
		this.setState({ process: null });
		UIkit.notification({
			message: 'Season stopped.',
			status: 'warning',
			pos: 'top-right',
			timeout: 1000
		});
	}

	/**
	 * Stop the season and delete all matches and players.
	 */
	resetSeason() {
		window.clearInterval(this.state.process);
		this.setState({ process: null, players: [], matches: [] });
		UIkit.notification({
			message: 'Season reset.',
			status: 'warning',
			pos: 'top-right',
			timeout: 1000
		});
		//this.createPlayers(this.DEFAULT_PLAYER_COUNT);
		//console.clear();
	}

	/**
	 * Change the active tab.
	 * @param {number} key of the active tab
	 */
	changeActiveTab(key) {
		this.setState({ activeTab: key });
	}

	render() {
		let activeTab;
		switch (this.state.activeTab) {
			case 1:
				activeTab = <DistributionChart id="DistributionChart" players={this.state.players} />;
				break;
			case 2:
				activeTab = <TierChartList id="TierChartList" players={this.state.players} />;
				break;
			case 3:
				activeTab = <PlayerList id="PlayerList" players={this.state.players} />;
				break;
			default:
				activeTab = null;
		}

		let placementsLeft = this.state.players
			.reduce((prev, next) => prev += (10 - next.games.placementGames.length), 0);

		return (
			<div className="seasonContainer">

				<div className={"cover " + (this.state.saving ? "active" : "hidden")}>
					<h2 className="status">Saving, please wait ...</h2>
				</div>
				<div className={"cover " + (this.state.loading ? "active" : "hidden")}>
					<h2 className="status">Loading, please wait ...</h2>
				</div>

				<hr />
				<div className="uk-text-center stats">
					<p>Number of players:  <span>{this.state.players.length}</span></p>
					{/* <p>Players replaced:  <span>{this.state.playersReplaced}</span></p> */}
					<p>Matches played:  <span>{this.state.matches.length}</span></p>
					<p>Placement matches left:  <span>{placementsLeft}</span></p>
				</div>
				<hr />

				<ControlPanel
					process={this.state.process}

					playerCount={this.state.players.length}
					minPlayerCount={this.TEAM_SIZE * 2}
					maxPlayerCount={this.MAX_PLAYER_COUNT}

					createPlayers={this.createPlayers.bind(this)}
					startSeason={this.startSeason.bind(this)}
					stopSeason={this.stopSeason.bind(this)}
					playMatches={this.playMatches.bind(this)}

					resetSeason={this.resetSeason.bind(this)}

					changeActiveTab={this.changeActiveTab.bind(this)}
					activeTab={this.state.activeTab}

					exportAllowed={this.state.exportAllowed}
					downloadState={this.downloadState.bind(this)}
					loadState={this.loadState.bind(this)}
				/>

				{activeTab}
				<hr />
			</div>
		);
	}
}
