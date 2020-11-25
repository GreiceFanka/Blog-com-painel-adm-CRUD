const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database/database');
const categoriesController = require('./categories/categoriesController');
const articlesController = require('./articles/articlesController');
const Article = require('./articles/Article');
const Category = require('./categories/Category');

//View engine
app.set('view engine','ejs');

//static
app.use(express.static('public'));

//Body parser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//Database Authenticate
connection.authenticate().then(()=>{
    console.log("Conexão realizada com sucesso!");
}).catch((error)=>{
    console.log(error);
})

app.use('/',categoriesController);
app.use('/',articlesController);

app.get('/', (req,res) =>{
    res.render("index");
})

app.listen(3002,()=>{
    console.log("O SERVIDOR ESTÁ RODANDO!");
})