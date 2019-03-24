import { LOGIN_POST, LOGOUT_POST } from "../actions/types";

function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length === 2)
    return parseInt(
      parts
        .pop()
        .split(";")
        .shift()
    );
  else return 0;
}

const initialState = {
  item: getCookie("login_state")
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LOGIN_POST: {
      return {
        ...state,
        item: action.payload
      };
    }

    case LOGOUT_POST: {
      return {
        ...state,
        item: action.payload
      };
    }

    default:
      return state;
  }
}
