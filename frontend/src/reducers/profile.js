const profileReducer = (state = {}, action) => {
    switch (action.type) {
        //     case "ADD_PROFILE":
        //         return [...state, profile(undefined, action)];
        //     case "CHANGE_PROFILE_STATE":
        //         return state.map((t) => profile(t, action));
        //     case "EDIT_PROFILE":
        //         return state.map((t) => profile(t, action));
        case "SET_PROFILE":
            return action.profile;
        default:
            return state;
    }
};

// const profile = (state, action) => {
//     switch (action.type) {
//         case "ADD_PROFILE":
//             return {
//                 id: action.id,
//                 title: action.title,
//                 description: action.description,
//                 deadline: action.deadline,
//                 assignee: action.assignee,
//                 state: "Not Started",
//             };
//         case "CHANGE_PROFILE_STATE":
//             if (state.id !== action.id) {
//                 return state;
//             }
//             return {
//                 ...state,
//                 state: action.state,
//             };
//         case "EDIT_PROFILE":
//             if (state.id !== action.id) {
//                 return state;
//             }
//             return {
//                 title: action.title,
//                 description: action.description,
//                 deadline: action.deadline,
//                 assignee: action.assignee,
//                 state: action.state,
//             };

//         default:
//             return state;
//     }
// };

export default profileReducer;
