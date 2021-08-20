import { combineReducers } from "redux";
import viewerReducer from './viewerReducer';
import authReducer from './authReducer';
import projects from './projectsReducer';
import models from './modelsReducer';

export default combineReducers({
  viewerReducer,
  models,
  authReducer,
  projects,
});
