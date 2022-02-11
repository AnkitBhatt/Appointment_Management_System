var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');

const passportInitialize = require('../public/javascripts/passport-config')
passportInitialize(passport, 
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
);

const users = [];

/* GET home page. */
router.get('/', checkAuthenticated,function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', checkNotAuthenticated,function(req, res, next) {
  res.render('login');
});

router.post('/login', checkNotAuthenticated,passport.authenticate('local',{
  successRedirect:'/',
  failureRedirect:'/login',
  failureFlash:true
}));

router.get('/register', checkNotAuthenticated,function(req, res, next) {
  res.render('register');
});

router.post('/register', async function(req, res, next) {
  try {
    const hashedPasssword = await bcrypt.hash(req.body.password,10);
    users.push({
      id:Date.now().toString(),
      email: req.body.email,
      name:req.body.username,
      password:hashedPasssword
    });
    res.redirect('/login');
  } catch (error) {
    res.redirect('/register');
  }
});

router.delete('/logout',(req,res,next) => {
  req.logOut();
  res.redirect('/login');
});

function checkAuthenticated(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}

function checkNotAuthenticated(req,res,next){
  if(req.isAuthenticated()){
    return res.redirect('/')
  }
  next()
}

module.exports = router;
