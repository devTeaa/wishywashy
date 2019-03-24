import React from "react";
import PropTypes from "prop-types";

import { calculateService, calculateServiceNumber } from "../../formula";

import Loading from "../common/Loading";
import DetailCustomer from "./selectCustomer/DetailCustomer";
import DetailInvoice from "./DetailInvoice";

import "bulma-extensions/bulma-divider/dist/css/bulma-divider.min.css";

const TransactionConfirmation = props => {
  const {
    // Base
    viewMode,
    isLoadingProps,
    isRequestingProps,
    // =========================
    //
    // State
    invoiceId,
    selectedDateReceived,
    selectedDateFinished,
    discountPrice,
    useDeposit,
    isPaid,
    isComplete,
    selectedCustomer,
    selectedServicesList,
    selectedItemDetailList,
    // =========================
    //
    // Func
    submitTransaction,
    handleChangeProps,
    handleSelectProps
  } = props;

  let totalServicesPrice = 0;
  selectedServicesList.forEach(item => {
    // totalServicesPrice += item.serviceQuantity * item.servicePrice + (item.serviceIsExpress ? item.serviceExpress : 0);
    totalServicesPrice += calculateServiceNumber(item.serviceQuantity, item.servicePrice, item.serviceIsExpress, item.serviceExpress);
  });

  return (
    <React.Fragment>
      <div className="is-divider" data-content="Detail Invoice" />
      <DetailInvoice
        // Component class
        componentClass={"columns m-b-2 is-desktop"}
        // Base
        viewMode={viewMode}
        isRequestingProps={isRequestingProps}
        // =========================
        //
        // State
        invoiceId={invoiceId}
        selectedDateReceived={selectedDateReceived}
        selectedDateFinished={selectedDateFinished}
        discountPrice={discountPrice}
        totalServicesPrice={totalServicesPrice}
        useDeposit={useDeposit}
        isPaid={isPaid}
        isComplete={isComplete}
        // =========================
        //
        // Func
        submitTransaction={submitTransaction}
        handleChangeProps={handleChangeProps}
        handleSelectProps={handleSelectProps}
      />

      <div className="is-divider" data-content="Detail Customer dan Detail Item" />
      <div className="columns">
        <div className="column is-three-fifths-tablet is-half-desktop">
          <DetailCustomer selectedCustomer={selectedCustomer} isLoadingProps={isLoadingProps} />
        </div>
        <div className="column">
          <table className="table is-fullwidth is-striped is-hoverable">
            <thead>
              <tr>
                <th>Nama Item</th>
                <th>Qty</th>
              </tr>
            </thead>
            <tbody>
              {isLoadingProps ? (
                <tr>
                  <td colSpan="2">
                    <Loading />
                  </td>
                </tr>
              ) : selectedItemDetailList.length === 0 ? (
                <tr>
                  <td colSpan="2">Tidak ada detail item</td>
                </tr>
              ) : (
                selectedItemDetailList.map((item, index) => (
                  <tr key={index}>
                    <td>{item.itemDetailName}</td>
                    <td>{item.itemDetailQuantity}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="is-divider" data-content="Detail Layanan" />
      <div className="columns">
        <div className="column">
          <table className="table is-fullwidth is-striped is-hoverable">
            <thead>
              <tr>
                <th>Layanan</th>
                <th>Qty</th>
                <th>Unit</th>
                <th>Total</th>
                <th>Express</th>
              </tr>
            </thead>
            <tbody>
              {isLoadingProps ? (
                <tr>
                  <td colSpan="5">
                    <Loading />
                  </td>
                </tr>
              ) : (
                selectedServicesList.map((item, index) => (
                  <tr key={index}>
                    <td>{item.serviceName}</td>
                    <td>{item.serviceQuantity}</td>
                    <td>{item.serviceUnit}</td>
                    <td>{calculateService(item.serviceQuantity, item.serviceUnit, item.servicePrice, item.serviceIsExpress, item.serviceExpress)}</td>
                    <td>{item.serviceIsExpress ? <span className="tag is-primary">Express</span> : ""}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </React.Fragment>
  );
};

TransactionConfirmation.propTypes = {
  // Form view viewMode
  // 0 = isFull
  // 1 = isEdit
  // 2 = isView
  viewMode: PropTypes.number.isRequired,
  // Loading  and Requesting props state
  isLoadingProps: PropTypes.bool.isRequired,
  isRequestingProps: PropTypes.bool.isRequired,
  // Current url invoice id
  invoiceId: PropTypes.string,
  // Invoice Date
  selectedDateReceived: PropTypes.string,
  selectedDateFinished: PropTypes.string,
  // Discount price
  discountPrice: PropTypes.number,
  // Use deposit or cash
  useDeposit: PropTypes.bool.isRequired,
  // If cash is paid or not
  isPaid: PropTypes.bool.isRequired,
  // Update if the transaction is complete
  isComplete: PropTypes.bool.isRequired,
  // Selected customer
  selectedCustomer: PropTypes.object.isRequired,
  // Selected service list
  selectedServicesList: PropTypes.array.isRequired,
  // Selected item detail list
  selectedItemDetailList: PropTypes.array.isRequired,
  // Submit transaction
  submitTransaction: PropTypes.func.isRequired,
  // Form handle change
  handleChangeProps: PropTypes.func.isRequired,
  handleSelectProps: PropTypes.func.isRequired
};

export default TransactionConfirmation;
