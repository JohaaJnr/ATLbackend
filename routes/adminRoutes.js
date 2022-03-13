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

Router.get('/', ensureAuth, (req,res)=>{
   const postCount = Post.countDocuments({})
    const categoryCount = Category.countDocuments({})
    const menusCount = Menu.countDocuments({})
    const logo = Logo.find({})
    Promise.all([postCount, categoryCount, menusCount]).then(result=>{
       
        res.render('index', { post: result[0], category: result[1], menu: result[2]})
    }).catch(err=>{
        console.error(err)
    })
   
})

Router.get('/login', ensureGuest, (req,res)=>{
    res.render('login')
})

Router.post('/signin',  (req,res)=>{
    const email = req.body.email
    const pass = req.body.pass
     User.find({ UserEmail: email }, (err, result)=>{
        if(err){
           console.error(err)
        }
        
        if(result == null){
            console.log('User Does not exist')
            res.redirect('/login')
        }
        if(result){
            
            if(result[0].UserEmail == email){
                const hashedPass = result[0].UserPass
                const match = bcrypt.compareSync(pass, hashedPass);
                if(match){
                    req.session.username = result[0].UserName
                   
                    res.redirect('/')
                }else{
                    res.redirect('/login')
                }
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

Router.get('/posts', ensureAuth, (req,res)=>{
   const category =  Category.find({})
    const posts =  Post.find({})
    Promise.all([category, posts]).then(result => {
        
       res.render('posts', { cat: result[0], post: result[1]})
     }).catch(err => {
  //handle your error here
       console.log(`Error : ${err}`);
     })
  
})


Router.get('/logo', ensureAuth, (req,res)=>{
    const logo = Logo.find({}, (err, result)=>{
        if(err){
            console.error(err)
        }else{
          res.render('logo', { file: result[0].Logo })
            
        }
    })
    
})

Router.get('/title', ensureAuth, (req,res)=>{

    const details = Siteinfo.find({}, function(err, result){
       if(err){
           console.error(err)
       }else{
            res.render('title', { title: result[0].SiteName})
       }
    })

})


Router.get('/menus', ensureAuth, (req,res)=>{
    const details = Menu.find({}, (err, result)=>{
        if(err){
            console.error(err)
        }else{
            res.render('menus', { menu: result })
        }
    })
   
})

Router.get('/categories', ensureAuth, (req,res)=>{
    const details = Category.find({}, (err,result)=>{
        if(err){
            console.error(err)
        }else{
           
            res.render('category', { category: result })
        }
    })
})

Router.get('/profile', ensureAuth, (req,res)=>{
    res.render('profile')
})


Router.post('/upload', ensureAuth, (req,res)=>{
    let logo = req.files.sitelogo
   global.sideLogo = logo.name
  
    const id = '621b6fc127b761d936ecde31'
   
    const uploadPath = dirname(require.main.filename) + '/public/uploads/logo/' + logo.name
    const sitelogo = Logo.findByIdAndUpdate(id, { Logo: logo.name }, err=>{
        if(err) throw err;
        
    })
    
    logo.mv(uploadPath, function(err) {
        if (err) return res.status(500).send(err);
      
        res.redirect('/logo')
      });
    
   
   
})


Router.post('/update_title', ensureAuth, (req,res)=>{
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

Router.post('/addcategory', ensureAuth, (req,res)=>{
    const value = req.body.catname;
    const newCat={
        CategoryName: value
    }
    const up = Category.create(newCat)
    res.redirect('/categories')
})

Router.post('/create_menu', ensureAuth, (req,res)=>{
    const menu = req.body.menutitle;
    const newMenu = {
        Menu: menu
    }
    const up = Menu.create(newMenu)
   res.redirect('/menus')
})

Router.post('/new/post', ensureAuth, (req,res)=>{
    const featureImg = req.files.img

    const newPost = {
        PostTitle : req.body.title,
        PostCategory : req.body.category,
        PostBody : req.body.postbody,
        FeaturedImage : `http://localhost:5000/uploads/${featureImg.name}`,
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
    req.session.destroy();
    res.redirect('/login')
})

module.exports = Router