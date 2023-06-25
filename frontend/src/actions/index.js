// **************
// Task Functions
// **************

export const addTask = (object) => {
    return {
        type: "ADD_TASK",
        id: object.id,
        title: object.title,
        description: object.description,
        deadline: object.deadline,
        assignee: object.assignee,
    };
};
export const editTask = (object) => {
    return {
        type: "EDIT_TASK",
        id: object.id,
        title: object.title,
        description: object.description,
        deadline: object.deadline,
        assignee: object.assignee,
        state: object.state,
    };
};

export const changeTaskState = (id, state) => {
    return {
        type: "CHANGE_TASK_STATE",
        id,
        state,
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

export const setToken = (token) => {
    return {
        type: "SET_TOKEN",
        token,
    };
};