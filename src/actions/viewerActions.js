import { GET_AGGREGATE_PROPERTIES } from './types';

export function getViewerProperties(properties = []) {
  //console.log('action', properties)
  return {
    type: GET_AGGREGATE_PROPERTIES,
    properties,
  }
}
