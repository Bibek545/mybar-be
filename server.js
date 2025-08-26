import express from "express";

const app = express();

const PORT = process.env.PORT || 8020;


// db connection 
import { dbConnect } from "./src/config/dbconfig.js";


// middlewares
import cors from "cors"
import morgan from 'morgan';

app.use(cors());
app.use(morgan("dev"));

//parse your json files
app.use(express.json());


// API endpoints
import router from './src/routes/authRoutes.js';
import userRoute from './src/routes/userRoutes.js'
import bookingRouter from "./src/routes/bookingRoutes.js"
import { errorHandle } from './src/middleware/errorHandler.js';
import { responseClient } from "./src/middleware/responseClient.js";

// const PORT = process.env.PORT || 8000
import dotenv from "dotenv";
dotenv.config(); // load .env


app.use("/api/v1/auth", router);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/booking", bookingRouter);

//server status
app.get("/", (req, res) => {
  const message = "mybar server is live";
    responseClient({req,res,message})
});


app.use(errorHandle);
app.use(responseClient);

// connect to db first, then start server
dbConnect()
  .then(() => {
    app.listen(PORT, (error) => {
      error
        ? console.log(error)
        : console.log("Server is ruuning at http://localhost:" + PORT);
    });
  })
  .catch((error) => console.log(error));