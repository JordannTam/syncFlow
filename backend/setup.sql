CREATE table profiles (
    id SERIAL PRIMARY KEY,
    email_address VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    date_of_birth DATE
);

ALTER table profiles owner to teamendgame;