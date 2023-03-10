
import 'dotenv/config'; // enviroment
// dotenv.config();
import express from 'express'; // express js
const app = express();

const { APP_PORT } = process.env;

import morgan from 'morgan';
app.use(morgan(":method :url :status :res[content-length] - :response-time ms"));

app.use(express.json()); // body json
app.use(express.urlencoded({ extended: false })); // form-urlencoded

// routes
import routers from './src/routers/index.js';

app.use(routers);
// using public folders
app.use(express.static('public'));

// start server
app.listen(APP_PORT || 8080, () =>{
  console.log(`Server running at port ${APP_PORT}`);
});
