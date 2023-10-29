import express from 'express';
import {getRanking, getSchedule, canEdit} from '../db/queries'


const router = express.Router()

router.get('/:tournament_name', async function (req, res) { 
    let tournament_name = req.params.tournament_name
    let userId = req.oidc.user?.email

    let ranking = (await getRanking(tournament_name))
    let schedule = (await getSchedule(tournament_name))
    let isOwner = (await canEdit(tournament_name, userId))

    res.render('tournament', {
        tournament_name: tournament_name,
        ranking: ranking,
        schedule: schedule,
        canEdit: isOwner
    }); 
});


export {router as tournamentRouter};

