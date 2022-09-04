const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const bodyParser = require('body-parser');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true} ).then(() => console.log('DB connected')).catch(err => console.log(err));

app.use('/api', authRoutes);
app.use('/api', userRoutes);

app.get('/', (req, res) => {
    res.json("Welcome localhost://8000")
});

app.listen(8000, () => {
    console.log('Server is running on port 8000')
});