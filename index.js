import 'dotenv/config'; // enviroment

import cors from 'cors';
// dotenv.config();
import express from 'express'; // express js
import mongoose from 'mongoose';
import morgan from 'morgan';

// routes
import routers from './src/routers/index.js';

const app = express();

const { APP_PORT } = process.env;

app.use(
  cors({
    origin: "*",
  })
);

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);

app.use(express.json()); // body json
app.use(express.urlencoded({ extended: false })); // form-urlencoded

app.use(routers);
// using public folders
app.use(express.static("public"));

// start server with mongoose (mongodb module)
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@${process.env.MONGODB_HOST}/${process.env.MONGODB_NAME}?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("Mongo DB Connected");
    app.listen(APP_PORT, () => {
      console.log(`Server is running at port ${APP_PORT}`);
    });
  })
  .catch((err) => console.log(err));
