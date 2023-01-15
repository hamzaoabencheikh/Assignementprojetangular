const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cookieParser = require("cookie-parser");
const bodyparser = require("body-parser");
const cors          = require('cors');
const upload        = require('./routes/upload');
const path = require('path');
require('dotenv').config();




mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const database = mongoose.connection
database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})


app.use(express.json());
app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cors({
    credentials: true,
    origin: 'http://localhost:4200'
}));

app.use(express.static(__dirname + '/public'));

const routes = require('./routes/routes');
app.use('/api/file', upload)
app.use('/api', routes)

app.get('/*', function(req, res){
    res.sendFile(path.join(__dirname + '/public/index.html'))
})

const port = process.env.PORT || 3000;
const website   = process.env.WEBSITE || 'http://localhost';

app.listen(process.env.PORT || port,() => console.log(`server is running on ${website}:${port}`));