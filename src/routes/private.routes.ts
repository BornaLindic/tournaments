import express from 'express';
import { requiresAuth } from 'express-openid-connect'; 

const router = express.Router()

router.get('/', requiresAuth(), function (req, res) {       
    const user = JSON.stringify(req.oidc.user);      
    res.render('private', {user}); 
});

export {router as privateRouter};

