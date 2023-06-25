CREATE table profiles (
    id SERIAL PRIMARY KEY,
    email_address VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    date_of_birth DATE
);

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title TExt NOT NULL,
    deadline DATE,
    description TEXT
);

CREATE TABLE task_assignees (
    task_id INTEGER NOT NULL,
    profile_id INTEGER NOT NULL,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE,
    PRIMARY KEY (task_id, profile_id)
);

ALTER table profiles owner to teamendgame;
ALTER table tasks owner to teamendgame;
ALTER table task_assignees owner to teamendgame;
