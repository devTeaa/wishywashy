import React from "react";
import PropTypes from "prop-types";
import numeral from "numeral";

import "cool-checkboxes-for-bulma.io/dist/css/bulma-radio-checkbox.min.css";

const ServiceForm = props => {
  let {
    // Base
    login,
    // =========================
    //
    // State
    serviceName,
    serviceUnit,
    servicePrice,
    serviceExpress,
    serviceCannotExpress,
    // =========================
    //
    // Func
    handleChange,
    submitService
  } = props;

  return (
    <form onSubmit={submitService}>
      <button className="hidden" onClick={submitService} />
      <div className="field is-horizontal">
        <div className="field-label is-normal">
          <label className="label">Nama</label>
        </div>
        <div className="field-body">
          <div className="field is-narrow">
            <input
              type="text"
              className="input"
              name="serviceName"
              placeholder="Kiloan, spray..."
              onChange={handleChange}
              value={serviceName || ""}
              readOnly={login !== 1}
              disabled={login !== 1}
            />
          </div>
        </div>
      </div>
      <div className="field is-horizontal">
        <div className="field-label is-normal">
          <label className="label">Satuan</label>
        </div>
        <div className="field-body">
          <div className="field">
            <span className="select">
              <select name="serviceUnit" onChange={handleChange} value={serviceUnit || ""} readOnly={login !== 1} disabled={login !== 1}>
                <option value="kg">kg</option>
                <option value="pcs">pcs</option>
                <option value="meter">meter</option>
              </select>
            </span>
          </div>
        </div>
      </div>
      <div className="field is-horizontal">
        <div className="field-label is-normal">
          <label className="label">Harga @</label>
        </div>
        <div className="field-body">
          <div className="field">
            <input
              type="text"
              className="input"
              name="servicePrice"
              placeholder="10.000..."
              onChange={handleChange}
              value={servicePrice ? numeral(servicePrice).format("0,0") : ""}
              readOnly={login !== 1}
              disabled={login !== 1}
            />
          </div>
          {serviceCannotExpress ? (
            <React.Fragment />
          ) : (
            <div className="field has-addons">
              <p className="control">
                <span className="button is-static">Express + </span>
              </p>
              <p className="control is-expanded">
                <input
                  type="text"
                  className="input"
                  name="serviceExpress"
                  placeholder="10.000..."
                  onChange={handleChange}
                  value={serviceExpress ? numeral(serviceExpress).format("0,0") : ""}
                  readOnly={login !== 1}
                  disabled={login !== 1}
                />
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="field is-horizontal">
        <div className="field-label is-normal" />
        <div className="field-body">
          <div className="field">
            <div className="control">
              <label className="checkbox">
                <input
                  id="serviceCannotExpress"
                  name="serviceCannotExpress"
                  type="checkbox"
                  className="switch is-rounded"
                  onChange={handleChange}
                  checked={serviceCannotExpress}
                />
                <label htmlFor="serviceCannotExpress">Tidak bisa express</label>
              </label>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

ServiceForm.propTypes = {
  // Base
  login: PropTypes.number.isRequired,
  // =========================
  //
  // State
  serviceName: PropTypes.string,
  serviceUnit: PropTypes.string,
  servicePrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  serviceExpress: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  serviceCannotExpress: PropTypes.bool,
  // =========================
  //
  // Func
  handleChange: PropTypes.func.isRequired,
  submitService: PropTypes.func.isRequired
};

export default ServiceForm;
