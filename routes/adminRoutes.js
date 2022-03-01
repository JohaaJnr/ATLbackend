const express = require('express')
const Router = express.Router()
const bcrypt = require('bcrypt')
const { dirname } = require('path')
const Siteinfo = require('../model/Siteinfo')
const Category = require('../model/Categories')
const Menu = require('../model/Menus')
const Logo = require('../model/Sitelogo')
const Post = require('../model/Posts')
const User = require('../model/User')
const { ensureAuth, ensureGuest } = require('../middleware/auth')

Router.get('/',  (req,res)=>{
    res.render('index')
})

Router.get('/login',  (req,res)=>{
    res.render('login')
})

Router.post('/signin',  (req,res)=>{
    const email = req.body.email
    const pass = req.body.pass
    const hash = User.find({ UserEmail: req.body.email }, (err, result)=>{
        if(err){
            res.json({
                msg: 'Wrong credentials'
            })
        }else{
           const hashedPass = result[0].UserPass
           const match = bcrypt.compareSync(pass, hashedPass);
           if(match){
               res.redirect('/')
           }else{
               res.redirect('/login')
           }
        }
    })
    
   
})

Router.get('/register', (req,res)=>{
    res.render('register')
})

Router.post('/registerUser', (req,res)=>{
    const pass = req.body.pass
    const saltRounds = 10
    const hashed = bcrypt.hashSync(pass, saltRounds);
    const newUser = {
        UserName: req.body.name,
        UserEmail: req.body.email,
        UserPass: hashed

    }
    const userRegister = User.create(newUser)
    res.redirect('/login')
})

Router.get('/posts',  (req,res)=>{
    const category = Category.find({}, (err, result)=>{
        if(err){
            console.error(err)
        }else{
            res.render('posts', { category: result})
        }
    })
})


Router.get('/logo', (req,res)=>{
    const logo = Logo.find({}, (err, result)=>{
        if(err){
            console.error(err)
        }else{
          res.render('logo', { file: result[0].Logo })
        
        }
    })
    
})

Router.get('/title', (req,res)=>{

    const details = Siteinfo.find({}, function(err, result){
       if(err){
           console.error(err)
       }else{
            res.render('title', { title: result[0].SiteName})
       }
    })

})


Router.get('/menus', (req,res)=>{
    const details = Menu.find({}, (err, result)=>{
        if(err){
            console.error(err)
        }else{
            res.render('menus', { menu: result })
        }
    })
   
})

Router.get('/categories', (req,res)=>{
    const details = Category.find({}, (err,result)=>{
        if(err){
            console.error(err)
        }else{
           
            res.render('category', { category: result })
        }
    })
})

Router.get('/profile',  (req,res)=>{
    res.render('profile')
})


Router.post('/upload',  (req,res)=>{
    let logo = req.files.sitelogo
    const id = '621b6fc127b761d936ecde31'
   console.log(logo.name)
    const uploadPath = dirname(require.main.filename) + '/public/uploads/logo/' + logo.name
    const sitelogo = Logo.findByIdAndUpdate(id, { Logo: logo.name }, err=>{
        if(err) throw err;
    })
    logo.mv(uploadPath, function(err) {
        if (err)
          return res.status(500).send(err);
       
        res.redirect('/logo')
      });
    
   
   
})


Router.post('/update_title', (req,res)=>{
    const title = req.body.title;
    const id = '621709929fc03bd1bde8107b'
    const up = Siteinfo.findByIdAndUpdate(id, {SiteName: title}, err=>{
        if(err){
            console.error(err)
        }else{
           res.redirect('/title')
        }
    })
})

Router.post('/addcategory', (req,res)=>{
    const value = req.body.catname;
    const newCat={
        CategoryName: value
    }
    const up = Category.create(newCat)
    res.redirect('/categories')
})

Router.post('/create_menu',  (req,res)=>{
    const menu = req.body.menutitle;
    const newMenu = {
        Menu: menu
    }
    const up = Menu.create(newMenu)
   res.redirect('/menus')
})

Router.post('/new/post', (req,res)=>{
    const featureImg = req.files.img

    const newPost = {
        PostTitle : req.body.title,
        PostCategory : req.body.category,
        PostBody : req.body.postbody,
        FeaturedImage : featureImg.name,
        Tags : req.body.tags
    }
    const post = Post.create(newPost)
    if (post) {
        const uploadPath = dirname(require.main.filename) + '/public/uploads/' + featureImg.name

        featureImg.mv(uploadPath, function (err) {
            if (err) {
                return res.status(500).send(err);
            }
        });
        res.redirect('/posts')
    } else {
        console.log('No Post created')
    }
    


})


Router.get('/logout', (req,res)=>{
    req.logOut();
    res.redirect('/login')
})

module.exports = Router