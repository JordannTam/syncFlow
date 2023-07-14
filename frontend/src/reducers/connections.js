const connectionsReducer = (state = [], action) => {
    switch (action.type) {
        case "ADD_CONNECTION":
            return [...state, connection(undefined, action)];
        case "SET_CONNECTIONS":
            return action.connections;
        default:
            return state;
    }
};

const connection = (state, action) => {
    switch (action.type) {
        case "ADD_CONNECTION":
            return {
                id: action.id,
                first_name: action.first_name,
                last_name: action.last_name,
            };
        default:
            return state;
    }
};

export default connectionsReducer;
