# Ranked Play Simulator
Simulating a season of ranked play based loosely on games like Rocket League, Heroes of the Storm etc.

## How it works
The app creates `Player` objects and simulates 3v3 `Match`es between them.

Each time a `Player` finishes a `Match`, a change in it's *rating score* is calculated. This score is used to track the progress of *players* through the `Ranks`. Upon reaching an upper of lower bound of this score (0-50), a `promotion` or `demotion` match is scheduled. Winning a *promotion match* causes the *Player* to proceed to the next `Division`, but losing a *demotion match* puts the player in the next lower *division*.

## The Player object

Each player is an instance of the `Player` class.

`Player` keeps track of:

* the `Rank` achieved during the last season
    >This will allow the app to simulate several *seasons* in a row in the future.
* the **current** `Rank` (*Tier* - *Division* - *Score*)
* the current Skill Rating (based on match "performance")
* number of wins and losses
* if the next match is a `promotion` or `demotion` match
* all `Matches` played
* points earned during the `placement` period

## The Match object

Every match is an instance of the `Match` class.

`Match` keeps track of:

* the participating *teams* of `Players`
* the `Skill Rating` difference between the teams
* the *index* of the winning and losing teams

The winning team is determined by chance based on the *Skill rating difference* of the two teams:
* if team A has a higher overall SR, it has approx. 65% chance to win
* if team A has a lower overall SR, it has approx. 35% chance to win

## Ranking system

The ranking system is based on the familiar systems of popular MOBAs and other online games.

There are 5+2 `Tier`s, each containing 5 `Divisions`:
* *Bronze* tier - divisions I-V
* *Silver* tier - same
* *Gold* tier - same
* *Platinum* tier - same
* *Diamond* tier - same
* *Master* tier - ranked by Skill Rating
* *Grand Master* - ranked by SR - top 200 of *Master* tier (max. 1% of all players)

## Matchmaking algorithm

For now, the algorithm just select an array of 3 players (non-reapeating) for each team in a match.

In the future, the algorithm will (hopefully) be able to find players of similar Skill Rating and/or Ranking without much of a performance hit.

TODO: improve the algo and document it

# Development

## Docs I learned from during development

* [MDN - Object prototype](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/prototype)

    Restoring the prototype reference of serialized objects.
    Example:

    ```javascript
    // Load a serialized object from local storage etc
    let serializedObject = localStorage.getItem('stored-state');
    // Parse it
    let myClassInstance = JSON.parse(serializedObject);
    // If you log it, you'll notice it's __proto__ will always be 'Object', not the original class it was contructed by.
    // Restore it's prototype:
    myClassInstance.__proto__ = Object.create(MyClass.prototype);
    ```

* [MDN - Array methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array#Methods_2)

    Since there are arrays of class instances in state, array *accessor* and *mutator* methods are used frequently.

* [MDN - for...in](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in)

    Just don't use on arrays where order might be important.

* [css-tricks - Auto-Sizing Columns in CSS Grid: 'auto-fill' vs 'auto-fit'](https://css-tricks.com/auto-sizing-columns-css-grid-auto-fill-vs-auto-fit/)
* [Rachel Andrew - Flexible Sized Grids with auto-fill and minmax](https://rachelandrew.co.uk/archives/2016/04/12/flexible-sized-grids-with-auto-fill-and-minmax/)

    Since CSS Grid allows for easy layout of structured content, and UIkit uses it a lot, understanding and manipulating it was important.
    
    `auto-fit` and `auto-fill` keywords are immensely useful, so understanding the difference between them was important.

    A key line of CSS I ended up using from the beginning:
    ```css
    .grid-wrapper {
        grid-template-columns: repeat(auto-fit, minmax(10em, 1fr));
    }
    ```

* [React - Error Boundaries](https://reactjs.org/docs/error-boundaries.html)

* [create-react-app - Building for relative paths](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#building-for-relative-paths)

## Made with

* [React](https://reactjs.org/docs/) through [create-react-app](https://github.com/facebook/create-react-app)

* [UIKit](https://getuikit.com/docs/)

    I just thought I'd try the v3 beta. It's alright, but the docs need some work.

* [Chart.js](http://www.chartjs.org/docs/latest/)

    It's easy to integrate it's API into React's lifecycle methods to perform updates.

* [circular-json](https://www.npmjs.com/package/circular-json)
    
    The app uses the `circular-json` module to serialize circular references from React's state objects, so it's able to save, download then later load and parse the SeasonController component's state.

* [FileSaver.js](https://github.com/eligrey/FileSaver.js)<!-- and [Blob.js](https://github.com/eligrey/Blob.js) -->

    Helps with downloading files across different browsers.

# TODO

- [ ] write tests?
- [x] ~~improve the tab switcher style~~
- [x] ~~finish the Footer component~~
- [x] ~~visualize last match on the Player modal~~
- [x] ~~visualize Skill Rating changes over time on the Player modal~~
- [ ] Match inspection tab (and Match modal?)
- [ ] improve matchmaking - only select players of similar skill level or ranking
- [x] ~~Ability to store and reload state from cache/localStorage~~

## Maybe TODO

- [ ] error handling with React's `ErrorBoundary` component
