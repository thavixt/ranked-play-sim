export default class Match {
  constructor(teamOne, teamTwo) {
    this.teams = [teamOne, teamTwo];
    this.skillRatingDifference = 0;
    this.winnerTeamIndex = 0;
    this.loserTeamIndex = 0;
  }

  playMatch() {
    // Calculate the skill rating difference of the two teams
    let teamOneSR = this.teams[0].reduce((sum, current) => sum + current.skillRating, 0);
    let teamTwoSR = this.teams[1].reduce((sum, current) => sum + current.skillRating, 0);
    //console.log("Skill ratings:", teamOneSR, teamTwoSR);
    this.skillRatingDifference = (teamOneSR - teamTwoSR);
    //console.log("Skill rating difference: ", this.skillRatingDifference);

    // Calculate the chance of team One winning based on the Skill Rating difference and a random chance
    const chance = Math.random();
    // If teamOne has better overall Skill Rating, 70% to win
    if (this.skillRatingDifference > 0) {
      this.winnerTeamIndex = (chance <= 0.7) ? 1 : 0;
      this.loserTeamIndex = (this.winnerTeamIndex === 1) ? 0 : 1;
    }
    // If teamOne has lower overall Skill Rating, 30% to win
    else if (this.skillRatingDifference < 0) {
      this.winnerTeamIndex = (chance <= 0.3) ? 1 : 0;
      this.loserTeamIndex = (this.winnerTeamIndex === 1) ? 0 : 1;
    }
    // If the Skill Rating are equal (unlikely outside placement matches), 50% to win
    else if (this.skillRatingDifference === 0) {
      this.winnerTeamIndex = (chance <= 0.5) ? 1 : 0;
      this.loserTeamIndex = (this.winnerTeamIndex === 1) ? 0 : 1;
    }

    return this;
  }
}
