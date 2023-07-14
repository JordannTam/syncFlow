// **************
// Task Functions
// **************

export const addTask = (object) => {
    return {
        type: "ADD_TASK",
        task_id: object.task_id,
        title: object.title,
        description: object.description,
        deadline: object.deadline,
        assignees: object.assignees,
        progress: "Not Started",
    };
};
export const editTask = (object) => {
    return {
        type: "EDIT_TASK",
        task_id: object.task_id,
        title: object.title,
        description: object.description,
        deadline: object.deadline,
        assignees: object.assignees,
        progress: object.progress,
    };
};

export const changeTaskState = (task_id, progress) => {
    return {
        type: "CHANGE_TASK_STATE",
        task_id,
        progress,
    };
};

export const setTasks = (tasks) => {
    return {
        type: "SET_TASK",
        tasks,
    };
};

// **************
// Login Function
// **************

export const setProfile = (profile) => {
    return {
        type: "SET_PROFILE",
        profile,
    };
};

// **************
// Login Function
// **************

export const login = () => {
    return {
        type: "LOGIN",
    };
};

export const logout = () => {
    return {
        type: "LOGOUT",
    };
};

// ********************
// Connection Functions
// ********************

export const setConnections = (connections) => {
    return {
        type: "SET_CONNECTIONS",
        connections,
    };
};

export const addConnections = (user) => {
    return {
        type: "ADD_CONNECTION",
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
    };
};

export const deleteConnection = (id) => {
    return {
        type: "DELETE_CONNECTION",
        id,
    };
};
