/**
 * @typedef {Object} Selection
 * @property {any} selected players
 * @property {any} remaining players
 */

/**
 * Get n random entries from an array without repeats.
 * @param {number} numberOfEntriesToGet 
 * @param {any} array 
 * @returns {Selection}
 */
export function selectWithoutRepeat(numberOfEntriesToGet, array) {
    // Copy array
    let pool = array.slice(0);
    // Shuffle array
    pool = pool.sort(function() {
        return Math.round(Math.random()) * 2 - 1;
    });
    // Get n random entries
    let entries = [];
    for (let i = 0; i < numberOfEntriesToGet; i++) {
        entries.push(pool.pop());
    }
    // Return the selected entries and the rest of the array
    return {
        selected: entries,
        remaining: pool
    }
}
/**
 * Create two teams of equal size from an array of Players.
 * @param {number} teamSize 
 * @param {Player[]} arrayOfPlayers 
 * @returns {[Selection, Selection]}
 */
export function createTeams(teamSize, arrayOfPlayers) {
    // Copy array
    let activePlayers = arrayOfPlayers.filter((player) => player.active).slice();
    // Shuffle array
    //players = players.sort(function () { return Math.round(Math.random()); });
    // Checks
    if (activePlayers.length < teamSize * 2) {
        return new Error("Not enough players to create two teams.");
    }
    // Create two teams
    let firstTeam = selectWithoutRepeat(teamSize, activePlayers);
    let secondTeam = selectWithoutRepeat(teamSize, firstTeam.remaining)
    // Return two teams of Player objects.
    return [
        firstTeam.selected,
        secondTeam.selected
    ];
}

/**
 * Limit a number between a min and max value.
 * @param {number} number 
 * @param {number} min 
 * @param {number} max 
 * @returns {number}
 */
export function limit(number, min, max) {
    return Math.min(Math.max(parseInt(number, 10), min), max);
}

/**
 * Returns a random number between a min and max value (both inclusive).
 * @param {number} min 
 * @param {number} max 
 * @returns {number}
 */
export function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
