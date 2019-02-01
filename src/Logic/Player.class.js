import { limit, randomBetween } from "./utils";

// Constants
const TIER_NAMES = ["NO_TIER", "Bronze", "Silver", "Gold", "Platinum", "Diamond", "Master", "Grand Master"];
const TIERS = 6;
const DIVISION_NAMES = ["", "I", "II", "III", "IV", "V"];
const DIVISIONS_PER_TIER = 5;
// Score needed to progress to the next division
const SCORE_PER_DIVISION = 50;
// Number of placement matches needed to be put into an initial Tier and Division
const PLACEMENT_MATCHES_NEEDED = 10;
// Min and max value for a rating change after a match
const MIN_RATINGCHANGE = 5;
const MAX_RATINGCHANGE = 15;

export default class Player {
	/**
	 * Creates an instance of Player.
	 * @param {object} lastSeasonRank 
	 * @param {number} lastSeasonRank.tier
	 * @param {number} lastSeasonRank.division
	 */
	constructor(lastSeasonRank = { tier: randomBetween(1, 4), division: randomBetween(1, 5) }) {
		// Properties
		this.uid = this.generateUID();
		this.skillRating = this.getRandomSR();
		this.rank = {
			tier: lastSeasonRank.tier, // 1-6
			division: lastSeasonRank.division, // 1-5
			score: SCORE_PER_DIVISION / 2, // 0-100, reset on division change
			placement: {}, // Placement rank
			lastSeason: lastSeasonRank // Ranking at the end of the last season
		};
		this.games = {
			wins: 0, // Ranked matches won
			losses: 0, // Ranked matches lost
			placementGames: [], //[0, 0, 0, 0, 0],
			rankedGames: [], // TODO: Last 10 only ?
			last: { // Last match - used for win streaks
				won: false,
				match: null
			},
			next: {
				promotion: false,
				demotion: false
			}
		};
		this.active = true;
	}

	/** 
	 * Reset the player. (Prepare for next season).
	 * @param {object} lastSeasonRank 
	 * @param {number} lastSeasonRank.tier
	 * @param {number} lastSeasonRank.division
	 * @returns {this}
	*/
	reset(lastSeasonRank) {
		this.uid = this.generateUID();
		this.skillRating = this.getRandomSR();
		this.rank = {
			tier: lastSeasonRank.tier, // 1-6
			division: lastSeasonRank.division, // 1-5
			score: SCORE_PER_DIVISION / 2, // 0-100, reset on division change
			placement: {}, // Placement rank
			lastSeason: lastSeasonRank // Ranking at the end of the last season
		};
		this.games = {
			wins: 0, // Ranked matches won
			losses: 0, // Ranked matches lost
			placementGames: [], //[0, 0, 0, 0, 0],
			rankedGames: [], // TODO: Last 10 only ?
			last: { // Last match - used for win streaks
				won: false,
				match: null
			},
			next: {
				promotion: false,
				demotion: false
			}
		};
		this.active = true;
		return this;
	}

	/**
	 * Generate a random UID for the player.
	 * @returns {string}
	 */
	generateUID() {
		const uidLength = 3 + Math.ceil((Math.random() * 5));
		const allowedCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		let uid = "";
		for (var i = 0; i < uidLength; i++) {
			uid += allowedCharacters.charAt(
				Math.floor(Math.random() * allowedCharacters.length)
			);
		}
		return uid;
	}

	/**
	 * Generate a random skill rating to start with.
	 * @returns {number}
	 */
	getRandomSR() {
		let skillRating = 100 + Math.round(Math.random() * 100);
		return skillRating;
	}

	/**
	 * Calculate the Player's winrate percentage.
	 * @returns {number}
	 */
	getWinrate() {
		let gamesPlayed = this.games.wins + this.games.losses;
		let winRate = (this.games.wins / gamesPlayed) * 100;
		if (isNaN(winRate)) {
			return 0;
		}
		else {
			return winRate.toFixed(0);
		}
	}

	/**
	 * Return a readable version of the Player's current rank.
	 * @param {boolean=false} full version
	 * @returns {string}
	 */
	getRank(full = false) {
		if (!full)
			return TIER_NAMES[this.rank.tier] + " " + DIVISION_NAMES[this.rank.division];
		else
			return TIER_NAMES[this.rank.tier] + " tier - Division " + DIVISION_NAMES[this.rank.division];
	}

	/**
	 * Returns the number of games won during the placement period.
	 * @returns {string}
	 */
	getPlacementWins() {
		let wins = this.games.placementGames.filter((score) => score > 0);
		return wins.length;
	}

	/**
	 * Returns the number of games won during the placement period.
	 * @returns {string}
	 */
	getPlacementRank(full = false) {
		if (this.games.placementGames.length < PLACEMENT_MATCHES_NEEDED) return "in progess";
		else if (!full)
			return TIER_NAMES[this.rank.placement.tier] + " " + DIVISION_NAMES[this.rank.placement.division];
		else
			return TIER_NAMES[this.rank.placement.tier] + " tier - Division " + DIVISION_NAMES[this.rank.placement.division];
	}

	/**
	 * Calculate the Player's skill rating change based on the Match's results.
	 * @param {Match} match 
	 * @returns {number}
	 */
	calculateRatingChange(match, didWin) {
		// TODO: handle skill rating change depending on current Rating (Tier/Division/Score or Skill Rating?)
		// Get the rating difference of the match's teams
		let srDiff = match.skillRatingDifference;
		// Get a value (NOTE: based on what, really?)
		let ratingChange = Math.abs(Math.round(srDiff / 10));
		// If it was a loss, only lose 2/3 of the value NOTE: disabled
		ratingChange = didWin ? ratingChange : ratingChange/* (ratingChange / 3) * 2 */;
		// Limit between min and max rating change values
		ratingChange = limit(ratingChange, MIN_RATINGCHANGE, MAX_RATINGCHANGE);
		// Correct sign
		ratingChange = didWin ? ratingChange : -ratingChange;
		if (this.skillRating <= -ratingChange && !didWin) {
			// Don't push the SR into negatives in case of a loss
			ratingChange = 0;
		} /* else {
			// Add extra score in case of a win streak
			if (this.games.last.won) {
				ratingChange += randomBetween(1, 5);
			}
		} */
		return Math.round(ratingChange);
	}

	/**
	 * Place the Player in a Tier and Division based on performance during placement matches.
	 * @returns {this}
	 */
	finishPlacementMatches() {
		// Put the Player in an initial Tier and Division based on the placement games
		for (let matchScore of this.games.placementGames) {
			if (matchScore > 0) {
				this.rank.division++;
				if (this.rank.division >= DIVISIONS_PER_TIER) {
					if (this.rank.tier < TIERS) {
						this.rank.tier++;
						this.rank.division = 1;
					} else {
						this.rank.tier = TIERS;
						this.rank.division = 0;
					}
				}
			}
			if (matchScore < 0) {
				this.rank.division--;
				if (this.rank.division <= 0) {
					if (this.rank.tier > 1) {
						this.rank.tier--;
						this.rank.division = DIVISIONS_PER_TIER;
					} else {
						this.rank.division = 1;
					}
				}
			}
		}
		// If at or past max Tier, just stay and set to Division 0 (no divisions at max tier)
		if (this.rank.tier === TIERS) {
			this.rank.division = 0;
		}
		//console.log("#" + this.uid + " finished placements. New rank:", this.rank);
		this.rank.placement = { tier: this.rank.tier, division: this.rank.division };
		return this;
	}

	/** 
	 * Handle a Match's results if the Player still needs placement matches.
	 * @param {Match} match
	 * @returns {this}
	*/
	handlePlacementMatch(ratingChange) {
		//console.log("Placement: ", this);
		this.games.placementGames.push(ratingChange);
		// If the Player finished all 10 placement matches, place it in a Tier and Division
		if (this.games.placementGames.length === PLACEMENT_MATCHES_NEEDED) {
			this.finishPlacementMatches();
		}
		return this;
	}

	/**
	 * Adjust Tier and Division up or down according to the Player's current ranked score after a match.
	 * @returns {this}
	 */
	adjustRanking() {
		// Division up on winning a demotion match
		if (this.games.last.won && this.games.next.promotion) {
			this.games.next.promotion = false;
			// If not at Div. V yet, just division up
			if (this.rank.division < DIVISIONS_PER_TIER) {
				this.rank.division += 1;
			}
			// Else tier up too
			else {
				this.rank.division = 1;
				if (this.rank.tier < TIERS) {
					this.rank.tier += 1;
				}
			}
			this.rank.score = SCORE_PER_DIVISION / 4;
		}
		// Division down on losing a demotion match
		else if (!this.games.last.won && this.games.next.demotion) {
			this.games.next.demotion = false;
			// If not at Div. I yet, just division down
			if (this.rank.division > 1) {
				this.rank.division -= 1;
			}
			// Else tier down too
			else {
				this.rank.division = DIVISIONS_PER_TIER;
				if (this.rank.tier > 1) {
					this.rank.tier -= 1;
				}
			}
			this.rank.score = SCORE_PER_DIVISION / 2;
		}

		// Does the Player need a promotion or demotion match next time?
		if (this.rank.score >= SCORE_PER_DIVISION) {
			// Next match will be a promotion match
			this.games.next.promotion = true;
			this.games.next.demotion = false;
		}
		else if (this.rank.score <= 0) {
			// Next match will be a demotion match
			this.games.next.promotion = false;
			this.games.next.demotion = true;
		} else {
			this.games.next.promotion = false;
			this.games.next.demotion = false;
		}

		// Except if he's at max Tier, just stay and set to Division 0 (no divisions at max tier)
		if (this.rank.tier === TIERS) {
			this.rank.division = 0;
		}

		return this;
	}

	/** 
	 * Handle a match's results and update the Player's stats accordingly.
	 * @param {Match} match
	 * @param {Boolean} didWin
	 * @returns {this}
	*/
	handleMatchResult(match, didWin) {
		// Calculate the rating change after the match
		const ratingChange = this.calculateRatingChange(match, didWin);
		this.skillRating += ratingChange;

		// Does the player need placement games?
		if (this.games.placementGames.length < PLACEMENT_MATCHES_NEEDED) {
			this.handlePlacementMatch(ratingChange, didWin);
		}
		// Otherwise it was an actual ranked game
		else {
			if (didWin) {
				this.games.wins++;
			} else {
				this.games.losses++;
			}
			this.rank.score += ratingChange;
			// Adjust Tier and Division up or down accordingly
			this.adjustRanking();
			// Store match in history
			this.games.rankedGames.unshift({ ...match, didWin, ratingChange, skillRating: this.skillRating });
			this.games.rankedGames.length = 7;
			this.games.last.won = didWin;
			this.games.last.match = match;
		}

		// FIXME: Randomly reset the Player
		// 1% chance - happens 1 out of 1000 matches
		/* if (Math.random() < 0.001) {
			this.reset({
				tier: this.rank.tier,
				division: this.rank.division
			})
		} */

		return this;
	}
}
