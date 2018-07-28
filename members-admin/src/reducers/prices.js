import { fromJS, List, Map } from 'immutable';

export default function(state = Map(), action) {
  console.log(action);
  if (action.error) return state;

  switch (action.type) {
  case 'INIT PRICES':
    console.log(action.data);
    if (!Array.isArray(action.data)) {
      console.warn(`${action.type} expects array data (got ${typeof action.data})`, action.data);
      return state;
    }
    return fromJS(action.data);
  case 'SET PRICE':
    console.log(action.data);
  }

  return state;
};
