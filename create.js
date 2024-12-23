import prisma from "./model/prismaClient.js";
import dotenv from "dotenv";
// Load the appropriate environment file based on NODE_ENV
const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";
dotenv.config({ path: envFile });

await prisma.game.createMany({

    data: [
        {name: "Universe11"},
        {name: "Cyberpunk City"}
    ]
        
    
})