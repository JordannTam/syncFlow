# Task Management System
# Efficiently manage and track your tasks with our system 

## Description

The Task Management System is a powerful tool designed to foster clear, real-time understanding of task allocation and progress in a collaborative setting. It provides a comprehensive overview of the status of the tasks that each member of the team is working on, significantly reducing the chance of misunderstanding, task duplication, and inefficient use of resources. 

The project aims to simplify the process of task organization and tracking, providing users with an efficient way to manage their workload, prioritize tasks, and collaborate with team members. By doing so, the Task Management System enhances team productivity and collaboration, and ensures smooth progression of projects.

Our system also addresses the issue of unstructured or inefficient communication systems which are often a hurdle in collaborative work environments. It offers an integrated platform for communication, allowing team members to ask questions, share notes, and update task statuses in a centralized, structured way. 

This project embodies a commitment to privacy, and we've made it a top priority in our system. Moreover, our integrated chat feature facilitates seamless communication among team members.

In summary, the Task Management System is not just a task management tool, but a comprehensive solution for effective project management, enabling smoother workflows, increased productivity, and efficient collaboration.

## Getting Started

This project consists of two main parts: the backend, which is implemented using Python, and the frontend, which is built using React.js. The PostgreSQL database is used for data storage.

Follow these steps to set up and start the system:

### Prerequisites

Ensure you have the following installed on your system:

* Python 3.x
* npm (typically installed with Node.js)
* PostgreSQL

### Backend

The backend requires a number of Python packages. These dependencies are listed in the requirements.txt file in the /backend directory.

1. Navigate to the /backend directory.
    ```
    cd backend
    ```
2. Install the necessary Python packages using pip.
    ```
    pip install -r requirements.txt
    ```
3. Start the backend server using uvicorn.
    ```
    uvicorn main:app --reload
    ```
### Frontend

The frontend is built with React.js and can be started using npm.

1. Navigate to the frontend directory (assuming you're in the project root).
    ```
    cd frontend
    ```
2. Install necessary npm packages.
    ```
    npm install
    ```
3. Start the frontend application.
    ```
    npm start
    ```

### Database

This project uses a PostgreSQL database. Make sure you have PostgreSQL installed and properly configured on your system. Update the database configuration details as per your setup in the required files. The database set up is in 'setup.sql'

