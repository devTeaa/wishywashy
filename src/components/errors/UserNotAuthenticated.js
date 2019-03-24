import React from "react";
import "../../styles/error-page.css";
import ErrorPage from "./ErrorPage";

const UserNotAuthenticated = () => {
  return <ErrorPage errorCode={401} />;
};

export default UserNotAuthenticated;
