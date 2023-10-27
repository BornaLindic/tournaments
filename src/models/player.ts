export class Player {
    tournamentName: string;
    name: string;
    score: number;

    constructor(tournamentName: string, name: string, score: number) {
        this.tournamentName = tournamentName;
        this.name = name;
        this.score = score;
    }
}