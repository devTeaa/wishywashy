import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import moment from "moment";
import numeral from "numeral";

import "bulma-calendar/dist/css/bulma-calendar.min.css";
import bulmaCalendar from "bulma-calendar/dist/js/bulma-calendar.min.js";
import "bulma-extensions/bulma-switch/dist/css/bulma-switch.min.css";

class DetailInvoice extends Component {
  componentDidMount() {
    // Bulma calendar options
    const options = {
      displayMode: "dialog",
      showHeader: false,
      showFooter: false,
      dateFormat: "YYYY-MM-DD"
    };
    // Initialize all input of date type.
    const calendars = bulmaCalendar.attach('[data-type="date"]', options);
    // Loop on each calendar initialized
    calendars.forEach(calendar => {
      // Add listener to date:selected event
      calendar.on("date:selected", date => {
        calendar.target = calendar.element;
        this.props.handleChangeProps(calendar);
      });
    });
  }

  render() {
    let {
      // Component class
      componentClass,
      // =========================
      //
      // Base
      viewMode,
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
      totalServicesPrice,
      // =========================
      //
      // Func
      submitTransaction,
      handleChangeProps,
      handleSelectProps
    } = this.props;

    return (
      <form onSubmit={e => submitTransaction(e)}>
        <div className={componentClass}>
          <div className="column is-4-desktop">
            <label className="label">No Invoice</label>
            <div className="columns is-desktop">
              <div className="column">
                <input type="text" className="input" name="idInvoice" value="WW18112810036" disabled />
              </div>
              <div className="column">
                <input type="text" className="input" name="idInvoiceShort" value={invoiceId || ""} disabled />
              </div>
            </div>
          </div>

          <div className="column columns is-desktop">
            <div className="column">
              <label className="label">Tanggal Terima</label>
              <input
                type="text"
                data-type="date"
                className="input"
                name="selectedDateReceived"
                placeholder="Masukkan tanggal terima..."
                onChange={handleChangeProps}
                value={moment(selectedDateReceived, "YYYY-MM-DD").format("DD MMM YYYY") || ""}
                disabled
                readOnly
              />
            </div>
            <div className="column">
              <label className="label">Tanggal Selesai</label>
              <input
                id="selectedDateFinished"
                type="text"
                data-type="date"
                className="input"
                name="selectedDateFinished"
                placeholder="Masukkan tanggal selesai..."
                onChange={handleChangeProps}
                value={selectedDateFinished !== null ? moment(selectedDateFinished, "YYYY-MM-DD").format("DD MMM YYYY") : ""}
                disabled={viewMode === 2}
                readOnly={viewMode === 2}
              />
            </div>
            <div className="column">
              {invoiceId !== null ? (
                <React.Fragment>
                  <label className="label">Status</label>
                  <p className="control">
                    <label className="checkbox">
                      <input
                        className="switch is-rounded"
                        id="isComplete"
                        name="isComplete"
                        type="checkbox"
                        checked={isComplete}
                        onChange={handleChangeProps}
                        disabled={isComplete === true || !isPaid}
                        readOnly={isComplete === true || !isPaid}
                      />
                      <label htmlFor="isComplete">Sudah diambil?</label>
                    </label>
                  </p>
                </React.Fragment>
              ) : (
                <React.Fragment />
              )}
            </div>
          </div>
        </div>

        <div className={componentClass}>
          <div className="column is-4-desktop">
            <label className="label">Jenis pembayaran</label>
            <div className="columns is-desktop">
              <div className="column">
                <input type="text" className="input" value={useDeposit ? "Deposit" : "Cash"} readOnly disabled />
              </div>
              <div className={useDeposit ? "hidden" : "column"}>
                <div className="select is-expanded">
                  <select
                    name="isPaid"
                    data-type="bool"
                    value={isPaid}
                    onChange={handleSelectProps}
                    disabled={viewMode === 2}
                    readOnly={viewMode === 2}>
                    <option value="false">Belum Lunas</option>
                    <option value="true">Lunas</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="column columns is-desktop">
            <div className="column">
              <label className="label">Total Layanan:</label>
              <input
                type="text"
                className="input"
                value={numeral(totalServicesPrice - (totalServicesPrice * (discountPrice || 0)) / 100).format("0,0")}
                readOnly
                disabled
              />
            </div>
            <div className="column">
              <label className="label">Diskon:</label>
              <div className="field has-addons">
                <p className="control is-expanded">
                  <input
                    type="number"
                    className="input"
                    name="discountPrice"
                    placeholder="10..."
                    onChange={handleChangeProps}
                    value={discountPrice || ""}
                    disabled={viewMode !== 0}
                    readOnly={viewMode !== 0}
                  />
                </p>
                <p className="control">
                  <span className="button is-static">%</span>
                </p>
              </div>
            </div>
            <div className="column flex flex-align-end">
              <button
                className={
                  isRequestingProps
                    ? "button is-primary is-fullwidth is-loading"
                    : viewMode === 2
                    ? "button is-fullwidth"
                    : "button is-primary is-fullwidth"
                }
                onClick={e => {
                  submitTransaction(e);
                }}
                disabled={isRequestingProps || viewMode === 2}>
                {invoiceId === null ? "Submit Transaksi" : "Update Transaksi"}
              </button>
              {invoiceId !== null ? (
                <Link className={invoiceId !== undefined ? "m-l-1 button is-warning is-fullwidth" : "hidden"} to={`/print/invoice/${invoiceId}`}>
                  Print Invoice
                </Link>
              ) : (
                <React.Fragment />
              )}
            </div>
          </div>
        </div>
      </form>
    );
  }
}

DetailInvoice.propTypes = {
  // css Class name
  componentClass: PropTypes.string.isRequired,
  // Form view viewMode
  // 0 = isFull
  // 1 = isEdit
  // 2 = isView
  viewMode: PropTypes.number.isRequired,
  // Requesting props state
  isRequestingProps: PropTypes.bool.isRequired,
  // Current url invoice id
  invoiceId: PropTypes.string,
  // Invoice Date
  selectedDateReceived: PropTypes.string,
  selectedDateFinished: PropTypes.string,
  // Discount price
  discountPrice: PropTypes.number,
  // Total transaction price
  totalServicesPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  // Use deposit or cash
  useDeposit: PropTypes.bool.isRequired,
  // If cash is paid or not
  isPaid: PropTypes.bool.isRequired,
  // Update if the transaction is complete
  isComplete: PropTypes.bool.isRequired,
  // Submit transaction
  submitTransaction: PropTypes.func,
  // Form handle change
  handleChangeProps: PropTypes.func.isRequired,
  handleSelectProps: PropTypes.func.isRequired
};

export default DetailInvoice;
