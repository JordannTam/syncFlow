const taskReducer = (state = [], action) => {
    switch (action.type) {
        case "ADD_TASK":
            return [...state, task(undefined, action)];
        case "CHANGE_TASK_STATE":
            return state.map((t) => task(t, action));
        case "EDIT_TASK":
            return state.map((t) => task(t, action));
        case "SET_TASK":
            return action.tasks;
        default:
            return state;
    }
};

const task = (state, action) => {
    switch (action.type) {
        case "ADD_TASK":
            return {
                id: action.id,
                title: action.title,
                description: action.description,
                deadline: action.deadline,
                assignee: action.assignee,
                progress: "Not Started",
            };
        case "CHANGE_TASK_STATE":
            if (state.id !== action.id) {
                return state;
            }
            return {
                ...state,
                progress: action.progress,
            };
        case "EDIT_TASK":
            if (state.id !== action.id) {
                return state;
            }
            return {
                title: action.title,
                description: action.description,
                deadline: action.deadline,
                assignee: action.assignee,
                progress: action.progress,
            };
        default:
            return state;
    }
};

export default taskReducer;
