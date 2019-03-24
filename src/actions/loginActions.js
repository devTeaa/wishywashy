import { LOGIN_POST, LOGOUT_POST } from "./types";

function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length === 2)
    return parts
      .pop()
      .split(";")
      .shift();
}

export const setLogin = () => async dispatch => {
  if (getCookie("login_state") === "1" || getCookie("login_state") === "2") {
    dispatch({
      type: LOGIN_POST,
      payload: parseInt(getCookie("login_state"))
    });
  }
};

export const fetchLogin = loginData => async dispatch => {
  await new Promise(resolve => {
    setTimeout(() => resolve(), 1000);
  });

  let { username, password } = loginData;
  if (username === "admin" && password === "admin123") {
    document.cookie = `login_state=1; max-age=${60 * 60 * 24 * 7};samesite`;

    dispatch({
      type: LOGIN_POST,
      payload: 1
    });
  } else if (username === "staff" && password === "staff123") {
    document.cookie = `login_state=2; max-age=${60 * 60 * 24 * 7};samesite`;

    dispatch({
      type: LOGIN_POST,
      payload: 2
    });
  } else {
    dispatch({
      type: LOGIN_POST,
      payload: 0
    });
  }
  // fetch("https://jsonplaceholder.typicode.com/posts")
  //   .then(res => res.json())
  //   .then(posts =>
  //     dispatch({
  //       type: FETCH_POSTS,
  //       payload: posts
  //     })
  //   );
};

export const fetchLogout = () => dispatch => {
  document.cookie = "login_state=; expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/";
  dispatch({
    type: LOGOUT_POST,
    payload: 0
  });
  // fetch("https://jsonplaceholder.typicode.com/posts")
  //   .then(res => res.json())
  //   .then(posts =>
  //     dispatch({
  //       type: FETCH_POSTS,
  //       payload: posts
  //     })
  //   );
};

// export const fetchPost = postData => dispatch => {
//   fetch("https://jsonplaceholder.typicode.com/posts", {
//     method: "POST",
//     headers: {
//       "content-type": "application/json"
//     },
//     body: JSON.stringify(postData)
//   })
//     .then(res => res.json())
//     .then(post =>
//       dispatch({
//         type: NEW_POST,
//         payload: post
//       })
//     );
// };
