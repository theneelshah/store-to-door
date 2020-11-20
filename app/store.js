import { combineReducers, createStore } from "redux";
import foodReducer from "./reducers/foodReducer";

const rootReducer = combineReducers({
  foodReducer: foodReducer,
});

const configureStore = () => createStore(rootReducer);

export default configureStore;
