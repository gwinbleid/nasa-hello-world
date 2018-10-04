import {ADD_INFO} from './actions';

export interface IAppState {
  past: string;
  future: string;
  searchItems: string;
  productsPerPage: number;
  currentPage: number;
  data: Array<any>;
}

export const INITIAL_STATE: IAppState = {
  past: '',
  future: '',
  searchItems: '',
  productsPerPage: 4,
  currentPage: 1,
  data: []
};

function add_data(state, action) {
  return state = action.payload;
}
export function rootReducer(state: IAppState = INITIAL_STATE, action): IAppState {
  switch (action.type) {
    case ADD_INFO: return add_data(state, action);
  }
  return state;
}
