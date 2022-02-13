CREATE TABLE patient(
	patient_id serial,
	patient_email_address varchar PRIMARY KEY,
	patient_username varchar,
	patient_password varchar
);

create table doctor(
	doctor_id serial,
	doctor_email_address varchar PRIMARY KEY,
	doctor_username varchar,
	doctor_password varchar
);

create table admin(
	admin_username varchar,
	admin_email_address varchar PRIMARY KEY,
	admin_password varchar
);

INSERT INTO admin values('Admin','Admin@genius','genius_ankit');

CREATE TYPE status_type AS ENUM ('NOT STARTED', 'IN-PROGRESS', 'COMPLETED');

create table appointment(
	appointment_id serial PRIMARY KEY,
	patient_id integer,
	doctor_id integer,
	appointment_start_time timestamp,
	appointment_end_time timestamp,
	appointment_status status_type
);