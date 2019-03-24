import React from "react";
import "../../styles/error-page.css";

const ErrorPage = props => {
  let { errorCode } = props;
  return (
    <div className="error-page">
      {errorCode === 401 ? (
        <React.Fragment>
          <h1 className="title is-1">401</h1>
          <h1>User not authenticated to view this page</h1>
        </React.Fragment>
      ) : errorCode === 404 ? (
        <React.Fragment>
          <h1 className="title is-1">404</h1>
          <h1 className="subtitle">Not found</h1>
        </React.Fragment>
      ) : (
        <h1>Internal server error</h1>
      )}
    </div>
  );
};

export default ErrorPage;
