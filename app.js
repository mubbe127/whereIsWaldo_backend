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
import { checkPosition } from "./controller/controller.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // If cookies or tokens are used
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(session({
    secret: 'your-secret-key', // Replace with a strong secret key
    resave: false, // Prevents session from being saved back to the store if it hasn't been modified
    saveUninitialized: false, // Prevents saving uninitialized sessions
    cookie: {
      maxAge: 60000, // 1 minute (in milliseconds)
    }
  }));
  
app.post('/api/game', checkPosition)
app.listen(4100, () => console.log("app listening on port 4100!"))