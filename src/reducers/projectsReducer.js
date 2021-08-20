import {
  GET_PROJECTS,
  GET_FILES,
  SET_PROJECT,
  SET_SELECTED_FILE,
  SET_FILE_VERSIONS,
  SELECT_FILE_VERSION,
  SET_FILE_PHASES,
  SELECT_PHASE,
} from '../actions/types';
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
    case SET_FILE_VERSIONS:
      return {
        ...state,
        selectedFiles: {
            ...state.selectedFiles,
            [action.props.fileId]: {
              ...state.selectedFiles[action.props.fileId],
              versions: action.props.data,
              selectedVersion: 0,
            },
          },
      }
    case SELECT_FILE_VERSION:
      return {
        ...state,
        selectedFiles: {
          ...state.selectedFiles,
          [action.props.fileId]: {
            ...state.selectedFiles[action.props.fileId],
            selectedVersion: action.props.version,
            phases: null,
          },
        },
      }
    case SET_FILE_PHASES:
      return {
        ...state,
        selectedFiles: {
          ...state.selectedFiles,
          [action.props.fileId]: {
            ...state.selectedFiles[action.props.fileId],
            phases: action.props.data,
            selectedPhase: 0,
          },
        },
      }
    case SELECT_PHASE:
      return {
        ...state,
        selectedFiles: {
          ...state.selectedFiles,
          [action.props.fileId]: {
            ...state.selectedFiles[action.props.fileId],
            selectedPhase: action.props.phase,
          },
        },
      }
    default:
      return state;
  }
}
