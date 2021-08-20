import {
  SET_MODEL_COLLECTION,
  SET_MODEL_STRUCTURE,
} from '../actions/types';

const initialState = {
  collections: {},
};

export default function viewer(state = initialState, action) {
  switch(action.type) {
    case SET_MODEL_COLLECTION:
      return {
        ...state,
        collections: {
          ...state.collections,
          [action.props.fileId]: {
            fileId: action.props.fileId,
            collection: action.props.collection,
          },
        }
      }
    case SET_MODEL_STRUCTURE:
      return {
        ...state,
        structure: {
          ...state.structure,
          [action.props.fileId]: {
            fileId: action.props.fileId,
            structure: action.props.structure,
          },
        }
      }
    default:
      return state;
  }
}
