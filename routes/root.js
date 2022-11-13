const express=require('express');
const router=express.Router();
const path=require('path');

//Te get'ery zwracają pliki html bez styli

 //wzięcie rozszerzenia w nawias sprawi, że w wyszukiwarce nie trzeba go wpisywać
router.get('^/$|index(.html)?', (req, res)=>{
    // '^/$|index.html' to oznacza, że jak wpiszę index.html
    //albo nic po / to res zwróci to samo

    //res.sendFile('./views/index.html', {root: __dirname});
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});
router.get('^/$|new-page(.html)?', (req, res)=>{
    //res.sendFile('./views/new-page.html', {root: __dirname});
    res.sendFile(path.join(__dirname, '..', 'views', 'new-page.html'));
});
router.get('^/$|old-page(.html)?', (req, res)=>{
    //res.sendFile('./views/new-page.html', {root: __dirname});
    res.sendFile(path.join(__dirname, '..', 'views', 'new-page.html'));
});

module.exports=router;