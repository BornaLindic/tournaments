import express from 'express';
const router = express.Router()

router.get('/', (req, res) => {
    res.oidc.login({
      returnTo: '/',
      authorizationParams: {      
        screen_hint: "signup",
      },
    });
  });


export {router as signupRouter};