import express from "express";
import dotenv from "dotenv"
import cors from "cors";
import path from "path";

import notesRouter from "./routes/notesRouter.js";
import authRoutes from "./routes/authRoutes.js";
import { connectDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve()



//middleware
// order of the middleware are so important
if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: "http://localhost:5173",
    })
  );
}

app.use(express.json());
app.use(rateLimiter);


app.use("/api/notes", notesRouter);
app.use("/api/auth", authRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname,"../frontend/dist")))

  app.get("*",(req,res) => {
    res.sendFile(path.join(__dirname,"../frontend/dist", "index.html"))
  });
}

// initially the DB should get connected then the port should start listening to requests or what is the use of 1st listen and them connecting to DB.
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server started on PORT:",PORT);
  });
});
