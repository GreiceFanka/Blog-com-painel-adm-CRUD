const express = require('express');
const router = express.Router();
const Category = require('./Category');
const slugify = require('slugify');


router.get('/admin/categories/new', (req,res)=>{
    res.render('admin/categories/new');
})

router.post('/categories/save', (req,res) =>{
    let title = req.body.title;
    if(title != undefined){
        Category.create({
            title:title,
            slug:slugify(title)
        }).then(() => {
            res.redirect('/');
        })
    } else {
        res.redirect("/admin/categories/new");
    }
})

router.get('/admin/categories', (req,res)=>{
    Category.findAll().then(categories=>{
        res.render('admin/categories/index',{
            categories:categories
        });
    });
})

module.exports = router;