import { GET_AGGREGATE_PROPERTIES } from '../actions/types';

const initialState = {
  properties: []
};

export default function viewer(state = initialState, action) {
  switch(action.type) {
    case GET_AGGREGATE_PROPERTIES:
      const { properties } = action;
      return {
        ...state,
        properties,
      }
    default:
      return state;
  }
}
