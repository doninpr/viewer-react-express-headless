import { combineReducers } from "redux";
import viewerReducer from './viewerReducer';
import authReducer from './authReducer';
import projects from './projectsReducer';

export default combineReducers({
  viewerReducer,
  authReducer,
  projects,
});
