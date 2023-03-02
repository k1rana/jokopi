import express from 'express'; // express js
const app = express();
const PORT = 7071;

// routes
import routers from './src/routers/index.js';
app.use(routers);

// start server
app.listen(PORT, () =>{
    console.log = `Server running at port ${PORT}`;
});