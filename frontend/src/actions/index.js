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
        assignee: object.assignee,
    };
};
export const editTask = (object) => {
    return {
        type: "EDIT_TASK",
        task_id: object.task_id,
        title: object.title,
        description: object.description,
        deadline: object.deadline,
        assignee: object.assignee,
        progress: object.progress,
    };
};

export const changeTaskState = (id, progress) => {
    return {
        type: "CHANGE_TASK_STATE",
        id,
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
