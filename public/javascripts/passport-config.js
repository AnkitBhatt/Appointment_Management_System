const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt');

function initialize (passport, getUserByEmail, getUserById) {
  const authenticatePatient = async (email,password,done) => {
    const user = await getUserByEmail(email);

    if(user == null){
      return done(null, false, {message:'No user with that email'})
    }

    try {
      if( await bcrypt.compare(password,user.patient_password)){
        return done(null,user)
      }
      else{
        return done(null, false, {message:'Password is incorrect'})
      }
    } catch (error) {
      return done(error);
    }
  }; 

  passport.use(new LocalStrategy({usernameField:'email'},authenticatePatient));
  passport.serializeUser((user,done) => done(null, user.patient_id));
  passport.deserializeUser((patient_id, done) => {
    return done(null, getUserById(patient_id))
  });
};

function initializeDoctor (passport, getDoctorByEmail, getDoctorById) {
  const authenticateDoctor = async (email,password,done) => {
    const user = await getDoctorByEmail(email);

    if(user == null){
      return done(null, false, {message:'No user with that email'})
    }

    try {
      if(password === user.doctor_password){
        return done(null,user)
      }
      else{
        return done(null, false, {message:'Password is incorrect'})
      }
    } catch (error) {
      return done(error);
    }
  }; 

  passport.use(new LocalStrategy({usernameField:'email'},authenticateDoctor));
  passport.serializeUser((user,done) => done(null, user.doctor_id));
  passport.deserializeUser((doctor_id, done) => {
    return done(null, getDoctorById(doctor_id))
  });
};

function initializeAdmin (passport, getAdminByEmail, getAdminByUsername) {
  const authenticateAdmin = async (email,password,done) => {
    const user = await getAdminByEmail(email);
    
    if(user == null){
      return done(null, false, {message:'No user with that email'})
    }

    try {
      if(password === user.admin_password){
        return done(null,user)
      }
      else{
        return done(null, false, {message:'Password is incorrect'})
      }
    } catch (error) {
      return done(error);
    }
  }; 

  passport.use(new LocalStrategy({usernameField:'email'},authenticateAdmin));
  passport.serializeUser((user,done) => done(null, user.admin_username));
  passport.deserializeUser((admin_username, done) => {
    return done(null, getAdminByUsername(admin_username))
  });
};

module.exports = {
  initialize,
  initializeDoctor,
  initializeAdmin
};