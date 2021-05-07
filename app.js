const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
require('dotenv').config();
const userRoute = require('./routes/user');
const cookieParser = require('cookie-parser');
const app = express();

//midlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => console.log('connected'));

app.use('/api/v1', userRoute);

const port = process.env.PORT || 5000;

app.listen(port, () => `Server running on port ${port} 🔥`);

