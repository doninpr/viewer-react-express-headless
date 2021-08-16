import { GET_AUTH_TOKEN } from './types';

export function getAuthToken({ authToken }) {
  return {
    type: GET_AUTH_TOKEN,
    props: {
      authToken
    },
  }
}
