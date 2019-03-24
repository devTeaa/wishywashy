import React from "react";
import "../../styles/error-page.css";
import ErrorPage from "./ErrorPage";

const NotFound = () => {
  return <ErrorPage errorCode={404} />;
};

export default NotFound;
