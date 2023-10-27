import express from 'express';
import fs from 'fs';
import path from 'path'
import https from 'https';
import { auth } from 'express-openid-connect'; 
import dotenv from 'dotenv';

//uvoz modula s definiranom funkcionalnosti ruta
import {homeRouter} from './routes/home.routes';
import {privateRouter} from './routes/private.routes';
import {signupRouter} from './routes/signup.routes';
import {createTournamentRouter} from './routes/createTournament.routes';
import {tournamentRouter} from './routes/tournament.routes';
import {editRouter} from './routes/edit.routes';

dotenv.config()

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'pug');
app.use(express.json());
app.use(express.urlencoded({extended: true}));
const port = 4080;

const config = { 
  authRequired : false,
  idpLogout : true, //login not only from the app, but also from identity provider
  secret: process.env.SECRET,
  baseURL: `https://localhost:${port}`,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: 'https://dev-qy38gvhp02pzbu3s.us.auth0.com',
  clientSecret: process.env.CLIENT_SECRET,
  authorizationParams: {
    response_type: 'code' ,
    //scope: "openid profile email"   
   },
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

//definicija ruta
app.use('/', homeRouter);
app.use('/private', privateRouter);
app.use('/sign-up', signupRouter);
app.use('/createTournament', createTournamentRouter);
app.use('/tournament', tournamentRouter);
app.use('/edit', editRouter);

https.createServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
  }, app)
  .listen(port, function () {
    console.log(`Server running at https://localhost:${port}/`);
  });