import express from 'express';
import {canEdit, getSchedule, updateScore} from '../db/queries'

const router = express.Router()

router.get('/:tournament_name', async function (req, res) { 
    let tournament_name = req.params.tournament_name
    let userId = req.oidc.user?.sid

    if (! (await canEdit(tournament_name, userId))) {
        res.redirect(`/tournament/${tournament_name}`)
        return
    }

    let schedule = (await getSchedule(tournament_name))

    let rounds = new Set<number>()
    let players = new Set<string>()

    for (let s of schedule) {
        rounds.add(s.round)
        players.add(s.player1)
        players.add(s.player2)
    }
    players.delete('free round')

    res.render('edit', {
        tournament_name: tournament_name,
        rounds: rounds.size,
        players: Array.from(players)
    }); 
});


router.post('/:tournament_name', async function (req, res) { 
    let tournament_name = req.params.tournament_name
    let userId = req.oidc.user?.sid

    if (! (await canEdit(tournament_name, userId))) {
        res.redirect(`/tournament/${tournament_name}`)
        return
    }

    if (req.body.player1 == req.body.player2) {
        console.log('Players must be unique!')
        res.redirect(`/edit/${tournament_name}`)
        return
    }

    updateScore(tournament_name, req.body.round, req.body.player1, req.body.player2, req.body.result)

    res.redirect(`/tournament/${tournament_name}`); 
});

export {router as editRouter};

