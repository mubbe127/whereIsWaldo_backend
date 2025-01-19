import dotenv from "dotenv";
import expressSession from 'express-session';
// Load the appropriate environment file based on NODE_ENV
const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";
dotenv.config({ path: envFile });
import express, { Router } from "express";
import prisma from "./model/prismaClient.js";
import { PrismaSessionStore } from '@quixo3/prisma-session-store';

import cors from 'cors';
import { checkPosition, startGame, storeUsername } from "./controller/controller.js";
import { PrismaClient } from "@prisma/client";

const app = express();

app.use(cors({
  origin: ['https://wereiswaldo-mubbe127.netlify.app', "http://localhost:5173"], // Replace with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // No cookies or credentials 
  secure:true,
  sameSite: "none"
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

app.use(
  expressSession({
    cookie: {
     maxAge: 7 * 24 * 60 * 60 * 1000 // ms
    },
    secret: 'a santa at nasa',
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(
      new PrismaClient(),
      {
        checkPeriod: 2 * 60 * 1000,  //ms
        dbRecordIdIsSessionId: false,
        dbRecordIdFunction: undefined,
      }
    )
  })
);
  
app.post('/api/game/:gameId', checkPosition)
app.get('/api/game/:gameId', startGame)
app.post('/api/score', storeUsername)

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