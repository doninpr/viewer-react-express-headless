import { GET_PROJECTS, GET_FILES, SET_PROJECT, SET_SELECTED_FILE } from './types';

export function getProjects({ data }) {
  return {
    type: GET_PROJECTS,
    props: {
      data
    },
  }
}

export function getFiles({ parent, file }) {
  return {
    type: GET_FILES,
    props: {
      parent,
      file
    },
  }
}

export function setProject(project) {
  return {
    type: SET_PROJECT,
    props: {
      project
    },
  };
}

export function setSelectedFile(file) {
  return {
    type: SET_SELECTED_FILE,
    props: {
      file
    },
  };
}
