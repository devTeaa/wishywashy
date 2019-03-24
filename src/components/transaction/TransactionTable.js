import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { connect } from "react-redux";

import "bulma-calendar/dist/css/bulma-calendar.min.css";
import bulmaCalendar from "bulma-calendar/dist/js/bulma-calendar.min.js";
import "bulma-extensions/bulma-checkradio/dist/css/bulma-checkradio.min.css";

import "../../styles/bulma-modifiers.css";

import servicesUrl, { datetimeFormat } from "../../config";
import { SuccessMessage, toggleSuccess } from "../common/Message";

import Loading from "../common/Loading";
import { IconInfo } from "../../images/BaseIcons";
import { ErrorMessage, toggleError } from "../common/Message";

class TransactionTable extends Component {
  constructor() {
    super();

    this.state = {
      // Base
      isLoading: false,
      errorList: [],
      pagingState: 0,
      pagingMax: 0,
      // =========================
      //
      // States
      searchInvoiceId: "",
      searchDateMode: "false",
      searchDateStart: null,
      searchDateEnd: moment().format("YYYY-MM-DD"),
      searchCustomerId: "",
      searchCustomerName: "",
      searchUseDeposit: "",
      searchIsPaid: "",
      searchIsComplete: "",
      transactionList: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleCurrentStatusSelect = this.handleCurrentStatusSelect.bind(this);
    this.handlePaging = this.handlePaging.bind(this);

    this.submitSearch = this.submitSearch.bind(this);
    this.clearForm = this.clearForm.bind(this);
    this.submitUpdateBatch = this.submitUpdateBatch.bind(this);
  }

  componentDidMount() {
    this.fetchTransaction();

    // Bulma calendar options
    const options = {
      displayMode: "dialog",
      showHeader: false,
      showFooter: false,
      dateFormat: "YYYY-MM-DD"
    };
    // Initialize all input of date type.
    const calendars = bulmaCalendar.attach('[type="date"]', options);
    // Loop on each calendar initialized
    calendars.forEach(calendar => {
      // Add listener to date:selected event
      calendar.on("date:selected", () => {
        calendar.target = calendar.element;
        this.handleChange(calendar);
      });
    });
  }

  async fetchTransaction(searchPost = null, pagingCommand = null) {
    this.setState({ isLoading: true, transactionList: [] });
    try {
      let { transactionList, pagingState, pagingMax } = this.state;

      pagingState = pagingCommand === "next" ? pagingState + 1 : pagingCommand === "prev" ? pagingState - 1 : 1;

      let response = [];
      if (searchPost !== null) {
        response = await axios.post(`${servicesUrl}/transactions/search?page=${pagingState}`, searchPost).then(res => res.data);
      } else {
        response = await axios.get(`${servicesUrl}/transactions/?page=${pagingState}`).then(res => res.data);
      }

      transactionList = response.results;
      pagingMax = response.pages;

      transactionList.forEach(item => {
        item.currentStatus = item.isComplete ? 2 : item.isPaid ? 1 : 0;
      });

      this.setState({ transactionList, pagingState, pagingMax });
    } catch (err) {
      let errorList = [];

      if (err.response) {
        errorList.push(`${err.response.status} ${err.response.statusText}`);
      } else if (err.request) {
        errorList.push("Request Timeout");
      }

      this.setState({ errorList });
      toggleError();
    }
    this.setState({ isLoading: false });
  }

  handleChange(e) {
    if (e.target.type === "checkbox") {
      this.setState({ [e.target.name]: e.target.checked });
    } else if (e.target.type === "number") {
      this.setState({ [e.target.name]: parseFloat(e.target.value) });
    } else {
      this.setState({ [e.target.name]: e.target.value });
    }
  }

  handleSelect(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  async handleDelete(invoiceId) {
    if (window.confirm("Do you really want to delete this invoice?")) {
      try {
        await axios.delete(`${servicesUrl}/transactions/${invoiceId}`);
        toggleSuccess("Transaksi berhasil dihapus");
        this.fetchTransaction();
      } catch (err) {
        let errorList = [];

        if (err.response) {
          errorList.push(`${err.response.status} ${err.response.statusText}`);
        } else if (err.request) {
          errorList.push("Request Timeout");
        }

        this.setState({ errorList });
        toggleError();
      }
    }
  }

  handleCurrentStatusSelect(e, index) {
    let { transactionList } = this.state;

    transactionList[index].currentStatus = parseInt(e.target.value);

    transactionList[index].isPaid = false;
    transactionList[index].isComplete = false;
    if (e.target.value === "1") {
      transactionList[index].isPaid = true;
    } else if (e.target.value === "2") {
      transactionList[index].isPaid = true;
      transactionList[index].isComplete = true;
    }

    this.setState({ transactionList });
  }

  handlePaging(command) {
    let searchPost = this.generateSearchPost();

    if (command === "next") {
      this.fetchTransaction(searchPost, "next");
    } else {
      this.fetchTransaction(searchPost, "prev");
    }
  }

  generateSearchPost() {
    let {
      searchInvoiceId,
      searchDateMode,
      searchDateStart,
      searchDateEnd,
      searchCustomerId,
      searchCustomerName,
      searchUseDeposit,
      searchIsPaid,
      searchIsComplete
    } = this.state;

    searchDateStart = searchDateStart ? moment(searchDateStart, "YYYY-MM-DD").format(datetimeFormat) : null;
    searchDateEnd = searchDateEnd
      ? moment(searchDateEnd, "YYYY-MM-DD")
          .add("day", 1)
          .add("milliseconds", -1)
          .format(datetimeFormat)
      : null;

    let searchPost = {
      invoiceId: searchInvoiceId === "" ? null : parseInt(searchInvoiceId),

      invoiceDateStart: searchDateMode === "received" ? searchDateStart : null,
      invoiceDateEnd: searchDateMode === "received" ? searchDateEnd : null,
      invoiceFinishedStart: searchDateMode === "finished" ? searchDateStart : null,
      invoiceFinishedEnd: searchDateMode === "finished" ? searchDateEnd : null,

      customerId: searchCustomerId === "" ? null : parseInt(searchCustomerId),
      customerName: searchCustomerName === "" ? null : searchCustomerName,
      useDeposit: searchUseDeposit === "" ? null : JSON.parse(searchUseDeposit),
      isPaid: searchIsPaid === "" ? null : JSON.parse(searchIsPaid),
      isComplete: searchIsComplete === "" ? null : JSON.parse(searchIsComplete)
    };

    return searchPost;
  }

  submitSearch(e) {
    e.preventDefault();

    let searchPost = this.generateSearchPost();

    this.fetchTransaction(searchPost, "reset");
  }

  clearForm(e) {
    e.preventDefault();
    this.setState({
      searchInvoiceId: null,
      searchDateMode: "received",
      searchDateStart: null,
      searchDateEnd: moment().format("YYYY-MM-DD"),
      searchCustomerId: "",
      searchCustomerName: "",
      searchUseDeposit: "",
      searchIsPaid: "",
      searchIsComplete: ""
    });

    this.fetchTransaction(null, "reset");
  }

  async submitUpdateBatch() {
    let { transactionList } = this.state;
    this.setState({ isLoading: true });

    try {
      let invoiceList = [];

      transactionList.forEach(item => {
        invoiceList.push({ invoiceId: item.invoiceId, isComplete: item.isComplete, isPaid: item.isPaid });
      });

      await axios.post(`${servicesUrl}/transactions/batch`, { invoiceList });
      toggleSuccess("Update secara batch berhasil");
    } catch (err) {
      let errorList = [];

      if (err.response) {
        errorList.push(`${err.response.status} ${err.response.statusText}`);
      } else if (err.request) {
        errorList.push("Request Timeout");
      }

      this.setState({ errorList });
      toggleError();
    }

    this.setState({ isLoading: false });
  }

  render() {
    let {
      // Base
      isLoading,
      errorList,
      pagingState,
      pagingMax,
      // =========================
      //
      // States
      searchInvoiceId,
      searchDateMode,
      searchDateStart,
      searchDateEnd,
      searchCustomerId,
      searchCustomerName,
      searchUseDeposit,
      searchIsPaid,
      searchIsComplete,
      transactionList
    } = this.state;

    const { tableMode, login } = this.props;

    return (
      <React.Fragment>
        <SuccessMessage />
        <ErrorMessage errorList={errorList} />
        <form onSubmit={this.submitSearch}>
          <div className="columns is-desktop">
            <div className="column">
              <label className="label">ID Invoice</label>
              <input
                className="input"
                type="number"
                name="searchInvoiceId"
                placeholder="1023123"
                onChange={this.handleChange}
                value={searchInvoiceId || ""}
              />
            </div>

            <div className="column">
              <label className="label">Jenis Tanggal</label>
              <span className="select is-expanded">
                <select name="searchDateMode" data-type="bool" value={searchDateMode || ""} onChange={this.handleSelect}>
                  <option value="false">Semua</option>
                  <option value="received">Terima</option>
                  <option value="finished">Selesai</option>
                </select>
              </span>
            </div>

            <div className={searchDateMode === "false" ? "hidden" : "column"}>
              <label className="label">Dari Tanggal</label>
              <input
                className="input"
                type="date"
                name="searchDateStart"
                onChange={this.handleChange}
                value={searchDateStart ? moment(searchDateStart, "YYYY-MM-DD").format("DD MMM YYYY") : ""}
                autoComplete="off"
              />
            </div>

            <div className={searchDateMode === "false" ? "hidden" : "column"}>
              <label className="label">Hingga Tanggal</label>
              <input
                className="input"
                type="date"
                name="searchDateEnd"
                onChange={this.handleChange}
                value={moment(searchDateEnd, "YYYY-MM-DD").format("DD MMM YYYY") || ""}
                autoComplete="off"
              />
            </div>

            <div className="column">
              <label className="label">ID customer</label>
              <input
                className="input"
                type="number"
                name="searchCustomerId"
                placeholder="65"
                onChange={this.handleChange}
                value={searchCustomerId || ""}
              />
            </div>

            <div className="column">
              <label className="label">Nama customer</label>
              <input
                className="input"
                type="text"
                name="searchCustomerName"
                placeholder="Budi"
                onChange={this.handleChange}
                value={searchCustomerName || ""}
              />
            </div>
          </div>

          <div className="columns is-desktop">
            <div className="column">
              <label className="label">Jenis Pembayaran</label>
              <span className="select is-expanded">
                <select name="searchUseDeposit" data-type="bool" value={searchUseDeposit || ""} onChange={this.handleSelect}>
                  <option value="">Semua</option>
                  <option value="true">Deposit</option>
                  <option value="false">Cash</option>
                </select>
              </span>
            </div>

            <div className="column">
              <label className="label">Status Pembayaran</label>
              <span className="select is-expanded">
                <select name="searchIsPaid" data-type="bool" value={searchIsPaid || ""} onChange={this.handleSelect}>
                  <option value="">Semua</option>
                  <option value="false">Belum Lunas</option>
                  <option value="true">Sudah Lunas</option>
                </select>
              </span>
            </div>

            <div className="column">
              <label className="label">Sudah diambil?</label>
              <span className="select is-expanded">
                <select name="searchIsComplete" data-type="bool" value={searchIsComplete || ""} onChange={this.handleSelect}>
                  <option value="">Semua</option>
                  <option value="false">Belum</option>
                  <option value="true">Sudah</option>
                </select>
              </span>
            </div>

            <div className="column flex flex-align-end">
              <button className="button is-primary is-fullwidth" onClick={e => this.submitSearch(e)}>
                Cari
              </button>
            </div>
            <div className="column flex flex-align-end">
              <button className="button is-fullwidth" onClick={this.clearForm}>
                Reset filter
              </button>
            </div>
          </div>
        </form>

        {tableMode === 1 ? (
          <div className="flex flex-justify-end m-t-2">
            <button
              className={isLoading ? "button is-loading is-warning" : "button is-warning"}
              onClick={this.submitUpdateBatch}
              disabled={isLoading}>
              Update this table pages
            </button>
          </div>
        ) : (
          <React.Fragment />
        )}
        <div className="scrollable-table-div">
          <table className={isLoading ? "table is-fullwidth has-actions m-t-2" : "table is-fullwidth is-hoverable has-actions m-t-2"}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tanggal Diterima</th>
                <th>Jam</th>
                <th>Nama</th>
                <th>Alamat</th>
                <th>No HP</th>
                <th>Status</th>
                {tableMode === 0 ? <th>Aksi</th> : <React.Fragment />}
              </tr>
            </thead>
            <tbody>
              {transactionList.length === 0 ? (
                <tr>
                  <td colSpan="8" className="has-text-centered">
                    {isLoading ? <Loading /> : "No data available"}
                  </td>
                </tr>
              ) : (
                transactionList.map((item, index) => (
                  <tr key={index}>
                    <td>{item.invoiceId}</td>
                    <td>{`${moment(item.invoiceDate, datetimeFormat).format("DD MMM YYYY")}`}</td>
                    <td>{`${moment(item.createdDate, datetimeFormat).format("HH:mm")}`}</td>
                    <td>{item.customerName}</td>
                    <td>{item.customerAddress}</td>
                    <td>{item.customerMobile}</td>
                    <td>
                      {tableMode === 0 && item.currentStatus === 2 ? (
                        <span className="tag is-success">Telah diambil</span>
                      ) : tableMode === 0 && item.currentStatus === 1 ? (
                        <span className="tag is-warning">Sudah dibayar</span>
                      ) : tableMode === 0 ? (
                        <span className="tag is-danger">Belum bayar</span>
                      ) : (
                        <React.Fragment>
                          <input
                            className={
                              item.currentStatus === 2
                                ? "is-checkradio has-no-border is-success"
                                : item.currentStatus === 1
                                ? "is-checkradio has-no-border is-warning"
                                : "is-checkradio has-no-border is-danger"
                            }
                            type="radio"
                            checked="checked"
                            readOnly={true}
                          />
                          <label />
                          <span className="select is-primary">
                            <select
                              name="currentStatus"
                              value={item.currentStatus}
                              onChange={e => {
                                this.handleCurrentStatusSelect(e, index);
                              }}>
                              {!item.useDeposit ? <option value="0">Belum Lunas</option> : <React.Fragment />}
                              <option value="1">Lunas</option>
                              <option value="2">Sudah Diambil</option>
                            </select>
                          </span>
                        </React.Fragment>
                      )}
                    </td>
                    {tableMode === 0 ? (
                      <td>
                        <Link to={`/transactions/${item.invoiceId}`} className="button is-info m-r-1">
                          <IconInfo s="14px" />
                        </Link>
                        {login === 1 ? (
                          <button className="button is-danger" onClick={() => this.handleDelete(item.invoiceId)}>
                            <i className="fa fa-times" />
                          </button>
                        ) : (
                          <React.Fragment />
                        )}
                      </td>
                    ) : (
                      <React.Fragment />
                    )}
                  </tr>
                ))
              )}
            </tbody>
            <tfoot>
              <tr>
                <th colSpan="8">
                  <div className="pagination is-right" role="navigation" aria-label="pagination">
                    <span
                      className={transactionList.length > 0 && pagingState > 1 ? "pagination-previous" : "pagination-previous invisible"}
                      onClick={() => this.handlePaging("prev")}>
                      Previous page
                    </span>
                    <span
                      className={transactionList.length > 0 && pagingState !== pagingMax ? "pagination-next" : "pagination-next invisible"}
                      onClick={() => this.handlePaging("next")}>
                      Next page
                    </span>
                  </div>
                </th>
              </tr>
            </tfoot>
          </table>
        </div>
      </React.Fragment>
    );
  }
}

TransactionTable.propTypes = {
  // Table mode
  // 0 = regular search and view details
  // 1 = edit isPaid and isComplete in batch
  tableMode: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

const mapStateToProps = state => {
  return {
    login: state.login.item
  };
};

export default connect(mapStateToProps)(TransactionTable);
