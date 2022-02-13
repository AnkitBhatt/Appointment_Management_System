const dbClient = require('./db-connection');

const createPatient = async (email,username,encryptedPassword) => {
  try{
    const resFirst = await dbClient.query(`
      SELECT * FROM patient WHERE patient_email_address = '${email}'
    `);
    if(resFirst.rows.length === 0){
      const res = await dbClient.query(`
        INSERT INTO patient(
          patient_email_address, 
          patient_username, 
          patient_password
        )
        VALUES(
          '${email}',
          '${username}',
          '${encryptedPassword}'
        )
      `);
      return res.rows[0];
    }
    else{
      return 0;
    }
  }catch(e){
    console.log(e.stack);
    throw new Error(e.stack());
  }
};

const getPatientFromEmail = async (email) => {
  try{
    const res = await dbClient.query(`
      SELECT * FROM patient where patient_email_address = '${email}'
    `);
    return res.rows[0];
  }catch(e){
    throw new Error(e.stack());
  }
};

const getPatientFromId = async (id) => {
  try{
    const res = await dbClient.query(`
      SELECT * FROM patient where patient_id = '${id}'
    `);
    return res.rows[0];
  }catch(e){
    throw new Error(e.stack());
  }
};

const getDoctorFromEmail = async (email) => {
  try{
    const res = await dbClient.query(`
      SELECT * FROM doctor where doctor_email_address = '${email}'
    `);
    return res.rows[0];
  }catch(e){
    throw new Error(e.stack());
  }
};

const getDoctorFromId = async (id) => {
  try{
    const res = await dbClient.query(`
      SELECT * FROM doctor where doctor_id = '${id}'
    `);
    return res.rows[0];
  }catch(e){
    throw new Error(e.stack());
  }
};

const getAdminByEmail = async (email) => {
  try{
    const res = await dbClient.query(`
      SELECT * FROM admin where admin_email_address = '${email}'
    `);
    return res.rows[0];
  }catch(e){
    throw new Error(e.stack());
  }
};

const getAdminByUserName = async (user) => {
  try{
    const res = await dbClient.query(`
      SELECT * FROM admin where admin_username = '${user}'
    `);
    return res.rows[0];
  }catch(e){
    throw new Error(e.stack());
  }
};

const getAllPatients = async () => {
  try{
    const res = await dbClient.query(`
      SELECT 
        patient_id as "ID",
        patient_email_address as "Email Address",
        patient_username as "Username"
      FROM patient
    `);
    return res.rows;
  }catch(e){
    throw new Error(e.stack());
  }
};

const getallDoctors = async () => {
  try{
    const res = await dbClient.query(`
      SELECT 
        doctor_id as "ID",
        doctor_email_address as "Email Address",
        doctor_username as "Username"
      FROM doctor
    `);
    return res.rows;
  }catch(e){
    throw new Error(e.stack());
  }
};

module.exports = {
  createPatient,
  getPatientFromEmail,
  getPatientFromId,
  getDoctorFromEmail,
  getDoctorFromId,
  getAdminByEmail,
  getAdminByUserName,
  getAllPatients,
  getallDoctors
};