import {pool} from './index';
import {Player} from '../models/player'
import {Schedule} from '../models/schedule'

async function create_tournament(
    owner: string,
    name:string,
    scoring_type: number,
    players: string[]) {
        // check constraint
        let tournaments = await(pool.query('SELECT "name" FROM lab1.tournaments'))
        for (let row of tournaments.rows) {
            if (row.name === name) {
                console.log('tournament with such name already exists')
                return
            }
        } 

        // insert tournament
        pool.query(`INSERT INTO lab1.tournaments VALUES ('${name}', '${owner}', ${scoring_type})`)
        
        // insert players
        for (let player of players) {
            pool.query(`INSERT INTO lab1.players VALUES ('${name}', '${player}', 0)`)
        }

        // insert schedule
        if (players.length % 2 != 0) {
            players.push('free round')
        }
        if (players.length == 4) {
            pool.query(`INSERT INTO lab1.schedules VALUES
                        ('${name}', 1, '${players[0]}', '${players[1]}'),
                        ('${name}', 1, '${players[2]}', '${players[3]}'),

                        ('${name}', 2, '${players[0]}', '${players[2]}'),
                        ('${name}', 2, '${players[3]}', '${players[1]}'),

                        ('${name}', 3, '${players[0]}', '${players[3]}'),
                        ('${name}', 3, '${players[1]}', '${players[2]}')`)
        } else if (players.length == 6) {
            pool.query(`INSERT INTO lab1.schedules VALUES
                        ('${name}', 1, '${players[1]}', '${players[0]}'),
                        ('${name}', 1, '${players[5]}', '${players[2]}'),
                        ('${name}', 1, '${players[4]}', '${players[3]}'),

                        ('${name}', 2, '${players[1]}', '${players[4]}'),
                        ('${name}', 2, '${players[3]}', '${players[5]}'),
                        ('${name}', 2, '${players[2]}', '${players[0]}'),

                        ('${name}', 3, '${players[1]}', '${players[2]}'),
                        ('${name}', 3, '${players[0]}', '${players[3]}'),
                        ('${name}', 3, '${players[5]}', '${players[4]}'),

                        ('${name}', 4, '${players[1]}', '${players[5]}'),
                        ('${name}', 4, '${players[4]}', '${players[0]}'),
                        ('${name}', 4, '${players[3]}', '${players[2]}'),

                        ('${name}', 5, '${players[1]}', '${players[3]}'),
                        ('${name}', 5, '${players[2]}', '${players[4]}'),
                        ('${name}', 5, '${players[0]}', '${players[5]}')`)
        } else {
            pool.query(`INSERT INTO lab1.schedules VALUES
                    ('${name}', 1, '${players[1]}', '${players[4]}'),
                    ('${name}', 1, '${players[2]}', '${players[3]}'),
                    ('${name}', 1, '${players[0]}', '${players[5]}'),
                    ('${name}', 1, '${players[7]}', '${players[6]}'),

                    ('${name}', 2, '${players[1]}', '${players[3]}'),
                    ('${name}', 2, '${players[4]}', '${players[5]}'),
                    ('${name}', 2, '${players[2]}', '${players[6]}'),
                    ('${name}', 2, '${players[0]}', '${players[7]}'),

                    ('${name}', 3, '${players[1]}', '${players[2]}'),
                    ('${name}', 3, '${players[0]}', '${players[4]}'),
                    ('${name}', 3, '${players[7]}', '${players[3]}'),
                    ('${name}', 3, '${players[6]}', '${players[5]}'),

                    ('${name}', 4, '${players[1]}', '${players[7]}'),
                    ('${name}', 4, '${players[6]}', '${players[0]}'),
                    ('${name}', 4, '${players[5]}', '${players[2]}'),
                    ('${name}', 4, '${players[3]}', '${players[4]}'),

                    ('${name}', 5, '${players[1]}', '${players[5]}'),
                    ('${name}', 5, '${players[3]}', '${players[6]}'),
                    ('${name}', 5, '${players[4]}', '${players[7]}'),
                    ('${name}', 5, '${players[2]}', '${players[0]}'),

                    ('${name}', 6, '${players[1]}', '${players[6]}'),
                    ('${name}', 6, '${players[5]}', '${players[7]}'),
                    ('${name}', 6, '${players[3]}', '${players[0]}'),
                    ('${name}', 6, '${players[4]}', '${players[2]}'),

                    ('${name}', 7, '${players[1]}', '${players[0]}'),
                    ('${name}', 7, '${players[7]}', '${players[2]}'),
                    ('${name}', 7, '${players[6]}', '${players[4]}'),
                    ('${name}', 7, '${players[5]}', '${players[3]}')`)
        }

        return;
    }


async function getTournaments() {
    let tournaments = []
    let query = await(pool.query('SELECT "name" FROM lab1.tournaments'))

    for (let row of query.rows) {
        tournaments.push(row.name)
    }

    return tournaments;
}


async function getRanking(tournament_name: string) {
    let ranking = []
    let query = await(pool.query(`SELECT * FROM lab1.players WHERE tournament_name = '${tournament_name}' ORDER BY player_score DESC`))

    for (let row of query.rows) {
        ranking.push(new Player(tournament_name, row.player_name, row.player_score))
    }
    
    return ranking
}


async function getSchedule(tournament_name: string) {
    let schedule = []
    let query = await(pool.query(`SELECT * FROM lab1.schedules WHERE tournament_name = '${tournament_name}' ORDER BY round`))

    for (let row of query.rows) {
        schedule.push(new Schedule(tournament_name, row.round, row.player1, row.player2, row.result))
    }
    
    return schedule
}


async function canEdit(tournament_name: string, userId: string) {
    let owner = (await (pool.query(`SELECT owner FROM lab1.tournaments WHERE name = '${tournament_name}'`))).rows[0].owner

    if (userId === owner) {
        return true
    } else {
        return false
    }
}


async function updateScore(tournament_name: string, round: string, player1: string, player2: string, result: string) {
    let scoring_type = (await (
        pool.query(`SELECT scoring_type FROM lab1.tournaments WHERE name = '${tournament_name}'`))
        ).rows[0].scoring_type

    let player1_score: number;
    let player2_score: number;

    if (scoring_type === 0) { // 3/1/0 nogomet
        if (result === '1') {
            player1_score = 3
            player2_score = 0
        } else if (result === '2') {
            player1_score = 0
            player2_score = 3
        } else {
            player1_score = 1
            player2_score = 1
        }
    } else if (scoring_type === 1) { // 1/0,5/0 šah
        if (result === '1') {
            player1_score = 1
            player2_score = 0
        } else if (result === '2') {
            player1_score = 0
            player2_score = 1
        } else {
            player1_score = 0.5
            player2_score = 0.5
        }
    } else { // 2/0/1 (košarka)
        if (result === '1') {
            player1_score = 2
            player2_score = 1
        } else if (result === '2') {
            player1_score = 1
            player2_score = 2
        } else {
            player1_score = 0
            player2_score = 0
        }
    }

    // update players with new scores
    pool.query(`UPDATE lab1.players
                SET player_score = (SELECT player_score
                                    FROM lab1.players
                                    WHERE player_name = '${player1}' AND tournament_name = '${tournament_name}') + ${player1_score}
                WHERE player_name = '${player1}'`)

    pool.query(`UPDATE lab1.players
                SET player_score = (SELECT player_score
                                    FROM lab1.players
                                    WHERE player_name = '${player2}' AND tournament_name = '${tournament_name}') + ${player2_score}
                WHERE player_name = '${player2}'`)


    // update schedule with new results
    pool.query(`UPDATE lab1.schedules
                SET result = '${parseInt(result)}'
                WHERE tournament_name = '${tournament_name}' AND
                      round = '${round}' AND
                      player1 = '${player1}' AND
                      player2 = '${player2}'`)

    // update schedule with new results
    pool.query(`UPDATE lab1.schedules
        SET result = '${parseInt(result)}'
        WHERE tournament_name = '${tournament_name}' AND
              round = '${round}' AND
              player1 = '${player2}' AND
              player2 = '${player1}'`)
                
}


export {create_tournament, getTournaments, getRanking, getSchedule, canEdit, updateScore}