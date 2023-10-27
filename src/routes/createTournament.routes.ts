import express from 'express';
import { requiresAuth } from 'express-openid-connect';
import {create_tournament} from '../db/queries'

const router = express.Router()

router.get('/', requiresAuth(), function (req, res) {       
    res.render('createTournament'); 
});

router.post('/', requiresAuth(), function (req, res, next) {       
    let players = req.body.players.split(";")
    if (players.length < 4 || players.length > 8) {
        console.log('Tournament must have 4 to 8 players!')
        res.render('createTournament')
        return
    }

    if (new Set(players).size !== players.length) {
        console.log('Players must be unique')
        res.render('createTournament')
        return
    }
    
    create_tournament(
        req.oidc.user?.sid,
        req.body.name,
        req.body.scoring_type,
        players
    )

    res.redirect('/'); 

});

export {router as createTournamentRouter};

