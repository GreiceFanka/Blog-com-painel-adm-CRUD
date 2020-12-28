const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const connection = require('./database/database');

const categoriesController = require('./categories/categoriesController');
const articlesController = require('./articles/articlesController');
const usersController = require('./users/UsersController');

const Article = require('./articles/Article');
const Category = require('./categories/Category');
const User =require('./users/User');


//View engine
app.set('view engine','ejs');

//sessions
app.use(session({
    secret: "A22eft56@nhG7",
    cookie: {maxAge:30000000}
}))


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
app.use('/',usersController);

app.get('/', (req,res) =>{
    Article.findAll({
        order:[
            ['id','DESC']
        ],
        limit:4
    }).then(articles =>{
        Category.findAll().then(categories =>{
            res.render("index",{articles:articles, categories:categories});
        })    
    })
})

app.get('/:slug',(req,res) =>{
    let slug = req.params.slug;
    Article.findOne({
        where:{
            slug:slug
        }
    }).then(article =>{
        if(article != undefined){
            Category.findAll().then(categories =>{
                res.render("article",{article:article, categories:categories});
            })
        }else{
            res.redirect("/");
        }
    }).catch(error =>{
        res.redirect("/");
    })
})

app.get('/category/:slug', (req,res) =>{
    let slug = req.params.slug;
    Category.findOne({
        where:{
            slug:slug
        },
        include:[{model:Article}]
    }).then(category =>{
        if(category != undefined){
            Category.findAll().then(categories =>{
                res.render("index",{articles: category.articles, categories:categories});
            })
        }else{
            res.redirect('/');
        }
    }).catch(error =>{
        res.redirect('/');
    })
})

app.listen(3002,()=>{
    console.log("O SERVIDOR ESTÁ RODANDO!");
})