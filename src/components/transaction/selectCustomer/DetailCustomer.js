import React from "react";
import PropTypes from "prop-types";
import numeral from "numeral";

const DetailCustomer = props => {
  const {
    // Base
    isLoadingProps,
    // State
    selectedCustomer,
    totalServicesPrice
  } = props;

  return (
    <React.Fragment>
      <div className="field is-horizontal">
        <div className="field-label">
          <label className="label">ID:</label>
        </div>
        <div className="field-body">
          <div className="field">
            <div className={isLoadingProps ? "control is-expanded is-loading" : "control is-expanded"}>
              <input className="input" value={selectedCustomer.customerId || ""} disabled readOnly />
            </div>
          </div>
        </div>
      </div>

      <div className="field is-horizontal">
        <div className="field-label">
          <label className="label">Nama:</label>
        </div>
        <div className="field-body">
          <div className="field">
            <div className={isLoadingProps ? "control is-expanded  is-loading" : "control is-expanded "}>
              <input className="input" value={selectedCustomer.customerName || ""} disabled readOnly />
            </div>
          </div>
        </div>
      </div>

      <div className="field is-horizontal">
        <div className="field-label">
          <label className="label">Alamat:</label>
        </div>
        <div className="field-body">
          <div className="field">
            <div className={isLoadingProps ? "control is-expanded  is-loading" : "control is-expanded "}>
              <input className="input" value={selectedCustomer.customerAddress || ""} disabled readOnly />
            </div>
          </div>
        </div>
      </div>

      <div className="field is-horizontal">
        <div className="field-label">
          <label className="label">No HP:</label>
        </div>
        <div className="field-body">
          <div className="field">
            <div className={isLoadingProps ? "control is-expanded  is-loading" : "control is-expanded "}>
              <input className="input" value={selectedCustomer.customerMobile || ""} disabled readOnly />
            </div>
          </div>
        </div>
      </div>

      <div className="field is-horizontal">
        <div className="field-label">
          <label className="label">Balance:</label>
        </div>
        <div className="field-body">
          <div className="field">
            <div className={isLoadingProps ? "control is-expanded  is-loading" : "control is-expanded "}>
              <input className="input" value={numeral(selectedCustomer.customerBalance).format("0,0") || ""} disabled readOnly />
            </div>
          </div>
        </div>
      </div>
      {totalServicesPrice !== undefined ? (
        <div className="field is-horizontal">
          <div className="field-label">
            <label className="label">Total:</label>
          </div>
          <div className="field-body">
            <div className="field">
              <div className={isLoadingProps ? "control is-expanded  is-loading" : "control is-expanded "}>
                <input className="input" value={numeral(totalServicesPrice).format("0,0") || ""} readOnly />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <React.Fragment />
      )}
    </React.Fragment>
  );
};

DetailCustomer.propTypes = {
  // Selected Customer
  selectedCustomer: PropTypes.object
};

export default DetailCustomer;
