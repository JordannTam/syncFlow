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
    creator_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    deadline DATE,
    initial_date DATE,
    progress TEXT NOT NULL,
    description TEXT,
    FOREIGN Key (creator_id) REFERENCES profiles(id) ON DELETE CASCADE
);

CREATE TABLE task_assignees (
    task_id INTEGER NOT NULL,
    profile_id INTEGER NOT NULL,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE,
    PRIMARY KEY (task_id, profile_id)
);

CREATE TABLE connections (
    id1 INTEGER NOT NULL,
    id2 INTEGER NOT NULL,
    PRIMARY KEY (id1, id2),
    FOREIGN KEY (id1) REFERENCES profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (id2) REFERENCES profiles(id) ON DELETE CASCADE
);

CREATE TABLE connection_requests (
    id1 INTEGER NOT NULL,
    id2 INTEGER NOT NULL,
    PRIMARY KEY (id1, id2),
    FOREIGN KEY (id1) REFERENCES profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (id2) REFERENCES profiles(id) ON DELETE CASCADE
);

ALTER table profiles owner to teamendgame;
ALTER table tasks owner to teamendgame;
ALTER table task_assignees owner to teamendgame;
ALTER table connections owner to teamendgame;
ALTER table connection_requests owner to teamendgame;