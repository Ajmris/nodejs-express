require('dotenv').config();
const express=require('express');
const app=express();
const path=require('path');
const cors=require('cors');
const corsOptions=require('./config/corsOptions');
const {logger}=require('./middleware/logEvents');
const errorHandler=require('./middleware/errorHandler');
const verifyJWT=require('./middleware/verifyJWT');
const cookieParser=require('cookie-parser');
const mongoose=require('mongoose');
const connectBD=require('./config/dbConn');
const PORT=process.env.PORT || 3001;

// Połączenie z MongoDB
connectBD();
// custom middleware logger
app.use(logger);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

//ten fragment kodu, dodanie public oraz umiesczenie w nim folderów
// css i img sprawi, że pliki z widoków będą ostylowane.
app.use(express.urlencoded({extended: false}));

// built-in middleware for json 
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

//serwowanie plików statycznych
app.use('/', express.static(path.join(__dirname, '/public')));

// routes
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));
app.use(verifyJWT);
app.use('/employees', require('./routes/api/employees'));

app.all('*', (req, res)=>{
    res.status(404);
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    }else if(req.accepts('json')) {
        res.json({ "error": "404 Not Found!" });
    }else{
        res.type('txt').send("404 Not Found!");
    }
});

app.use(errorHandler);
// nasłóchiwanie
mongoose.connection.once('open', ()=>{
    console.log('Connect to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})