require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const expressValidator = require('express-validator');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
const cookieParser = require('cookie-parser');
const session = require("express-session");
const app = express();

//midlewares
app.use(session({
    secret: 'asdf;lkjh3lkjh235l23h5l235kjh',
    resave: true,
    saveUninitialized: false
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(expressValidator());

mongoose.connect(process.env.MONGO_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => console.log('connected'));



app.get('/', (req, res) => {
    res.send('home page');
})
//applying route middleware
app.use('/api', userRoute);
app.use('/api', authRoute);


const port = process.env.PORT || 5000;
app.listen(port, () => `Server running on port ${port} 🔥`);



