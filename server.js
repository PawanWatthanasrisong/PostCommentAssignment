//Import Express
const express = require('express');
const apiRouter = require('./server/api');
const app = express();
const bodyParser = require('body-parser');

//Dedicate PORT 4000
const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());

app.use('/api', apiRouter);

//Listen to PORT 4000
app.listen(PORT, () => {
    console.log(`Server ${PORT} is running`);
});

