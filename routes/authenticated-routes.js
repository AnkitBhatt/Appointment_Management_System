var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const db = require('../model/db');

const passport_config = require('../public/javascripts/passport-config')
passport_config.initialize(passport, 
  async (email) => {
      const userFromEmail = await db.getPatientFromEmail(email);
      return userFromEmail;
  },
  async (id) => {
    const userFromID = await db.getPatientFromId(id);
    return userFromID;
  }
);

passport_config.initializeDoctor(passport,
  async (email) => {
      const doctorFromEmail = await db.getDoctorFromEmail(email);
      return doctorFromEmail;
  },
  async (id) => {
    const doctorFromID = await db.getDoctorFromId(id);
    return doctorFromID;
  }
);

passport_config.initializeAdmin(passport,
  async (email) => {
    const adminFromEmail = await db.getAdminByEmail(email);
    return adminFromEmail;
  },
  async (username) => {
    const adminFromUserName = await db.getAdminByUserName(username);
    return adminFromUserName;
  }
);

/* GET home page. */
router.get('/', checkAuthenticated,function(req, res, next) {
  res.render('index', { title: 'Express' });
}); 

router.get('/patient', checkAuthenticated,function(req,res,next){
  res.render('patient');
});

router.get('/login', checkNotAuthenticated,function(req, res, next) {
  res.render('login');
});

router.post('/login', checkNotAuthenticated,
  passport.authenticate('local',{
    successRedirect:'/patient',
    failureRedirect:'/login',
    failureFlash:true
  })
);

router.get('/doctor',function(req,res,next){
  res.render('doctor');
});

router.get('/doctor-login',function(req,res,next){
  res.render('doctor-login');
});

router.post('/doctor-login',
  passport.authenticate('local',{
    successRedirect:'/doctor',
    failureRedirect:'/doctor-login',
    failureFlash:true
  })
);

router.get('/admin-login',function(req,res,next){
  res.render('admin-login');
});

router.post('/admin-login',
  passport.authenticate('local',{
    successRedirect:'/admin',
    failureRedirect:'/admin-login',
    failureFlash:true
  })
);

router.get('/admin',async function(req,res,next){
  const resFromPatients = await db.getAllPatients();
  const resFromDoctors = await db.getallDoctors();
  res.render('admin',{Doctors:resFromDoctors,Patients:resFromPatients});
});

router.get('/register', checkNotAuthenticated,function(req, res, next) {
  res.render('register');
});

router.post('/register', checkNotAuthenticated,async function(req, res, next) {
  try {
    const hashedPasssword = await bcrypt.hash(req.body.password,10);

    const resFromCreatePatient = await db.createPatient(req.body.email,req.body.username,hashedPasssword);
    if(resFromCreatePatient !== 0){
      res.redirect('/login');
    }
    res.render('register',{message:"This Email Address already exist"})
  } catch (error) {
    res.redirect('/register');
  }
});

router.post('/create-appointment',async function(req,res,next){
  try{
    
  }catch(error){
    res.redirect('/admin')
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
