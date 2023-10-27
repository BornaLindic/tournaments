import express from 'express';
import {getTournaments} from '../db/queries'

const router = express.Router()

router.get('/', async function (req, res) {
    let username : string | undefined;
    if (req.oidc.isAuthenticated()) {
      username = req.oidc.user?.name ?? req.oidc.user?.sub;
    }

    let tournaments = (await getTournaments())
    res.render('index', {username, tournaments});
  });


export {router as homeRouter};