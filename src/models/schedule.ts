export class Schedule {
    tournamentName: string;
	round: number;
	player1: string;
	player2: string;
	result: number | undefined

    constructor (
        tournamentName: string,
        round: number,
        player1: string,
        player2: string,
        result: number | undefined) {
            this.tournamentName = tournamentName
            this.round = round
            this.player1 = player1
            this.player2 = player2
            this.result = result
        }


        
}