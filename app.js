import dotenv from "dotenv";
// Load the appropriate environment file based on NODE_ENV
const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";
dotenv.config({ path: envFile });
import path from "node:path";
import express, { Router } from "express";
import session from 'express-session'
import cors from 'cors';
import { checkPosition, startGame, storeUsername } from "./controller/controller.js";

const app = express();

app.use(
  cors({
    origin:true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // If cookies or tokens are used
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
app.use(session({
    secret: 'your-secret-key',  // Replace with a strong secret key
    resave: false,              // Don't save unchanged sessions
    saveUninitialized: true,   // Don't save uninitialized sessions
    cookie: {
      maxAge: 10* 60 *1000,  // Cookie expiration time in milliseconds
      httpOnly: true, // Make cookie inaccessible to JavaScript
      secure: false,  // Should be true in production if using HTTPS
       // Allow cross-origin cookies
    }
  }));
  
app.post('/api/game/:gameId', checkPosition)
app.get('/api/game/:gameId', startGame)
app.post('/api/game/score', storeUsername)

/*app.get('/api/restartGame/:gameId', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Failed to destroy session:', err);
        return res.status(500).send('Failed to logout.');
      }
      const gameId = req.params.gameId
      // Clear the session cookie on the client
      res.clearCookie('connect.sid');
      res.redirect(`/api/game/${gameId}`); // Redirect to the login page
    });
  }); */


  app.get('/api/restartGame/:gameId', (req, res) => {
   
    const gameId =Number(req.params.gameId)
    console.log("restarting game", gameId )
    if(gameId===1){
     req.session.universe11= undefined
     } else {
      console.log()
      req.session.cyberpunkCity= undefined
     }   
     res.redirect(`/api/game/${gameId}`); 
  });



app.listen(4100, () => console.log("app listening on port 4100!"))  