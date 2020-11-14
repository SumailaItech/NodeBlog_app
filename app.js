const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const session = require('express-session');
const flash = require('connect-flash');
const messages = require('express-messages');


const url ='mongodb+srv://sumaila:Littleman@50@cluster0.bg5k4.mongodb.net/nodeApp?retryWrites=true&w=majority';
mongoose.connect(url, {useNewUrlParser: true});
let db = mongoose.Connection;
const port = 3000;

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Bring model in 

let Post = require('./models/posts');


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

// sseion section
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  }));

  app.use(require('connect-flash')());
  app.use(function(req,res,next){
    res.locals.messages = require('express-messages')(req, res);
    next();
  });
  

// Home route
app.get('/', (req, res, next) => {
   Post.find({}, (error, posts)=>{
       if(error){
           console.log(error);
       }else{
        res.render('index',
        {
            title:'Home',
            posts:posts
        });
       }
   });
  
});

// single post

app.get('/post/:id',(req, res, next)=>{
    Post.findById(req.params.id, (err, post)=>{
        if(err){
            console.log(err);
            next();
        }else{
            res.render('post',{
                title:post.title,
                post:post,
            });
        }
    })
})

// Add post route
app.get('/posts/add', (req, res, next) => {
    res.render('add',{
        title:'Add post',
    });
});

// Adding Post to the database
app.post('/posts/add', (req, res, next)=>{
    let post = new Post();
    post.title = req.body.title;
    post.author = req.body.author;
    post.body = req.body.body;

    post.save(err=>{
        if(err){
            console.log(err);
            return;
        }else{
            res.redirect('/');
        }
    })
    return;
});


// fetching post for editing
app.get('/post/edit/:id',(req, res, next)=>{
    Post.findById(req.params.id, (err, post)=>{
        if(err){
            console.log(err);
            return;
        }else{
            res.render('edit_post',{
                title:'Edit Post',
                post:post,
            });
        }
    })
})

// updating a post
app.post('/posts/edit/:id', (req, res, next)=>{
    let post = {};
    post.title = req.body.title;
    post.author = req.body.author;
    post.body = req.body.body;
 
     let query ={_id:req.params.id };

    Post.update(query, post, err=>{
        if(err){
            console.log(err);
            return;
        }else{
            res.redirect('/');
        }
    })
    return;
});

app.delete('/post/:id',(req, res, next)=>{
    let query ={_id:req.params.id};
    Post.remove(query, (err)=>{
        if(err){
            console.log(err);
        }else{
            res.send('Success');  
        }
    });
});

app.listen(port, ()=>{
    console.log(`App is started on ${port}`);
})