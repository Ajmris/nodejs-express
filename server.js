const express=require('express');
const app=express();
const path=require('path');
const PORT=process.env.PORT||3001;

//Te get'ery zwracają pliki html bez styli
app.get('^/$|index(.html)?', (req, res)=>{
    // '^/$|index.html' to oznacza, że jak wpiszę index.html
    //albo nic po / to res zwróci to samo
    //res.sendFile('./views/index.html', {root: __dirname});
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});
app.get('/new-page(.html)?', (req, res)=>{
    //res.sendFile('./views/index.html', {root: __dirname});
    //wzięcie rozszerzenia w nawias sprawi, że w wyszukiwarce nie trzeba go wpisywać
    res.sendFile(path.join(__dirname, 'views', 'new-page.html'));
});
app.get('/old-page(.html)?', (req, res)=>{
    res.redirect(301, 'new-page.html');
});
//Route handlers
app.get('/hello(.html)?', (req, res, next)=>{
    console.log('załącznik do odpalenia hello.html');
    next()
},(req, res)=>{
    res.send('Hello World!');
})
// łańcuch uchwytów połączeń
const one = (req, res, next) => {
    console.log('one');
    next();
}
const two = (req, res, next) => {
    console.log('two');
    next();
}
const three = (req, res) => {
    console.log('three');
    res.send('Finished!');
}

app.get('/chain(.html)?', [one, two, three]);

app.get('/*', (req, res)=>{
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});
// nasłóchiwanie
app.listen(PORT, ()=>console.log(`Server running on port: ${PORT}`));