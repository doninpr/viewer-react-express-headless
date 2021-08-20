import {
  SET_MODEL_COLLECTION,
  SET_MODEL_STRUCTURE,
} from "./types";

export function setModelCollection({ file, collection }) {
  return {
    type: SET_MODEL_COLLECTION,
    props: {
      fileId: file.id,
      collection
    },
  };
}

export function setModelStructure({ file, structure }) {
  return {
    type: SET_MODEL_STRUCTURE,
    props: {
      fileId: file.id,
      structure
    },
  };
}
