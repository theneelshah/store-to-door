import { combineReducers, createStore } from "redux";
import activeReducer from "./reducers/activeReducer";
import foodReducer from "./reducers/foodReducer";

const rootReducer = combineReducers({
  foodReducer: foodReducer,
  activeReducer: activeReducer,
});

const configureStore = () => createStore(rootReducer);

export default configureStore;
