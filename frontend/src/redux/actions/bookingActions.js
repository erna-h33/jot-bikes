import axios from 'axios';
import {
  BOOKING_LIST_REQUEST,
  BOOKING_LIST_SUCCESS,
  BOOKING_LIST_FAIL,
} from '../constants/bookingConstants';

export const listBookings = () => async (dispatch) => {
  try {
    dispatch({ type: BOOKING_LIST_REQUEST });

    const { data } = await axios.get('/api/bookings');

    dispatch({
      type: BOOKING_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: BOOKING_LIST_FAIL,
      payload:
        error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};
