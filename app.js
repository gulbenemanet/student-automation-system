const express = require('express');
const app = express();
const ejs = require('ejs');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser')

//Express Options
app.use(cors());
app.use(express.urlencoded({
    'extended': 'true'
}));
app.use(cookieParser());
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use('/public', express.static(path.join(__dirname, 'public')));


const mongoose = require('mongoose')
require('dotenv').config({ path: "./config.env" });

mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })
    .then(() => console.log("DB'ye bağlanldı"))
    .catch(err => console.log("DB'ye bağlanırken hata oluştu: " + err))


app.listen(3000, (err) => {
    if (!err) console.log('Sunucu çalıştırıldı');
    if (err) console.log('Sunucu çalışırken hata');
});
const router = require('./routes/routes');
app.use('/', router);