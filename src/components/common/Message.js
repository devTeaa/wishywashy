import React from "react";

import "../../styles/base.css";

// #region ErrorMessage
export function toggleError() {
  document.getElementById("errorMessage").classList.toggle("now-visible");
  setTimeout(() => {
    try {
      document.getElementById("errorMessage").classList.remove("now-visible");
    } catch {}
  }, 2000);
}

export const ErrorMessage = props => {
  let { errorList } = props;

  return (
    <article id="errorMessage" className="message is-danger toggle-invisible">
      <div className="message-header">
        <strong>Error:</strong>
      </div>
      <div className="message-body">
        <ul>
          {errorList.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
      </div>
    </article>
  );
};
// #endregion

// #region SuccessMessage
export function toggleSuccess(message) {
  document.getElementById("successMessage").querySelector(".message-body").innerHTML = `<ul><li>${message}</li></ul>`;
  document.getElementById("successMessage").classList.toggle("now-visible");
  setTimeout(() => {
    try {
      document.getElementById("successMessage").classList.remove("now-visible");
    } catch {}
  }, 2000);
}

export const SuccessMessage = props => {
  return (
    <article id="successMessage" className="message is-success toggle-invisible">
      <div className="message-header">
        <strong>Sukses:</strong>
      </div>
      <div className="message-body" />
    </article>
  );
};
// #endregion
