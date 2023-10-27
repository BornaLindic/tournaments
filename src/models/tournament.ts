export class Tournament {
    name: string;
    owner: string;
    scoringType: number;

    constructor(name: string, owner: string, scoring_type: number) {
        this.name = name
        this.owner = owner
        if (scoring_type == 0 || scoring_type == 1 || scoring_type == 2) {
            this.scoringType = scoring_type
        } else {
            throw new Error("Scoring type must be 0, 1 or 2")
        }
    }
}