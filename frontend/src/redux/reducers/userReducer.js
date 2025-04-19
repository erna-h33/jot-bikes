import {
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_DETAILS_FAIL,
} from '../constants/userConstants';

export const userDetailsReducer = (
  state = { userDetails: null, loading: false, error: null },
  action
) => {
  switch (action.type) {
    case USER_DETAILS_REQUEST:
      return { ...state, loading: true, error: null };
    case USER_DETAILS_SUCCESS:
      return { ...state, loading: false, userDetails: action.payload, error: null };
    case USER_DETAILS_FAIL:
      return { ...state, loading: false, error: action.payload, userDetails: null };
    default:
      return state;
  }
};
