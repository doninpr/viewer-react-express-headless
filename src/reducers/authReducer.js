import { GET_AUTH_TOKEN } from '../actions/types';

const initialState = {
  authToken: null,
};

export default function viewer(state = initialState, action) {
  switch(action.type) {
    case GET_AUTH_TOKEN:
      return {
        ...state,
        authToken: action.props.authToken,
      }
    default:
      return state;
  }
}
