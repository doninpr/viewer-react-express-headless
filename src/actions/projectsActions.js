import {
  GET_PROJECTS,
  GET_FILES,
  SET_PROJECT,
  SET_SELECTED_FILE,
  SET_FILE_VERSIONS,
  SELECT_FILE_VERSION,
  SET_FILE_PHASES,
  SELECT_PHASE,
} from './types';

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

export function setFileVersions({ fileId, data }) {
  return {
    type: SET_FILE_VERSIONS,
    props: {
      fileId,
      data
    },
  };
}

export function selectFileVersion({ fileId, version }) {
  return {
    type: SELECT_FILE_VERSION,
    props: {
      fileId,
      version
    },
  };
}

export function setFilePhases({ fileId, data }) {
  return {
    type: SET_FILE_PHASES,
    props: {
      fileId,
      data
    },
  };
}

export function selectPhase({ fileId, phase }) {
  return {
    type: SELECT_PHASE,
    props: {
      fileId,
      phase
    },
  };
}
