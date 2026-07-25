import express from "express";
import dotenv from "dotenv"
import cors from "cors";

import notesRouter from "./routes/notesRouter.js";
import authRoutes from "./routes/authRoutes.js";
import { connectDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

//middleware
// order of the middleware are so important
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());
app.use(rateLimiter);


app.use("/api/notes", notesRouter);
app.use("/api/auth", authRoutes);
// initially the DB should get connected then the port should start listening to requests or what is the use of 1st listen and them connecting to DB.
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server started on PORT:",PORT);
  });
});
