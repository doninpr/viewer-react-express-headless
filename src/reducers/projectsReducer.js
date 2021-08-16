import { GET_PROJECTS, GET_FILES, SET_PROJECT, SET_SELECTED_FILE } from '../actions/types';
import _ from 'lodash';

const initialState = {
  projects: null,
  selectedProject: null,
  files: {},
  selectedFiles: {},
};

export default function viewer(state = initialState, action) {
  switch(action.type) {
    case GET_PROJECTS:
      return {
        ...state,
        projects: action.props.data,
      }
    case SET_PROJECT:
      return {
        ...state,
        selectedProject: action.props.project,
        files: {},
        selectedFiles: {},
      }
    case SET_SELECTED_FILE:
      return {
        ...state,
        selectedFiles: !!state.selectedFiles[action.props.file.id]
          ? { ..._.omit(state.selectedFiles, action.props.file.id) }
          : {
          ...state.selectedFiles,
          [action.props.file.id]: action.props.file,
        },
      }
    case GET_FILES:
      return {
        ...state,
        files: {
          ...state.files,
          [action.props.parent]: {
            ...state.files[action.props.parent],
            [action.props.file.id]: action.props.file,
          },
        },
      }
    default:
      return state;
  }
}
