import React, { Component } from "react";
import axios from "axios";
import moment from "moment";

import servicesUrl, { datetimeFormat } from "../../config";

import Loading from "../common/Loading";
import "bulma-calendar/dist/css/bulma-calendar.min.css";
import bulmaCalendar from "bulma-calendar/dist/js/bulma-calendar.min.js";

import PrintReportTransaction from "./PrintReportTransaction";

class ReportTransaction extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // Base
      isLoadingProps: false,
      // State
      periodType: ["daily", "monthly", "yearly"],
      monthsList: [],
      yearsList: ["2019"],
      selectedPeriodType: "monthly",
      selectedDaily: moment().format("YYYY-MM-DD"),
      selectedMonth: moment().format("MMMM"),
      selectedYear: moment().format("YYYY"),
      selectedFilter: 0,
      dataTransactions: [],
      dataDeposits: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async handleSubmit(e) {
    e.preventDefault();
    this.setState({ isLoadingProps: true, dataTransactions: [], dataDeposits: [] });

    let { selectedPeriodType, selectedDaily, selectedMonth, selectedYear, selectedFilter } = this.state;

    let selectedDateStart, selectedDateEnd;

    if (selectedPeriodType === "daily") {
      selectedDateStart = moment(selectedDaily, "YYYY-MM-DD").format(datetimeFormat);

      selectedDateEnd = `${moment(selectedDateStart, datetimeFormat)
        .add("1", "day")
        .add("-1", "milliseconds")
        .format(datetimeFormat)}`;
    } else if (selectedPeriodType === "monthly") {
      selectedDateStart = moment(`${selectedYear}-${moment(selectedMonth, "MMMM").format("MM")}-01`, "YYYY-MM-DD").format(datetimeFormat);

      selectedDateEnd = `${moment(selectedDateStart, datetimeFormat)
        .add("1", "month")
        .add("-1", "milliseconds")
        .format(datetimeFormat)}`;
    } else if (selectedPeriodType === "yearly") {
      selectedDateStart = moment(`${selectedYear}-${moment(selectedMonth, "MMMM").format("MM")}-01`);

      selectedDateEnd = `${moment(selectedDateStart, datetimeFormat)
        .add("1", "year")
        .add("-1", "milliseconds")
        .format(datetimeFormat)}`;
    }

    let transactionData = await axios
      .post(`${servicesUrl}/reports/transactions`, {
        invoiceDateFrom: selectedDateStart,
        invoiceDateTo: selectedDateEnd,
        invoiceFinishFrom: null,
        invoiceFinishTo: null
      })
      .then(res => res.data);

    // 0 semua
    // 1 sudah lunas
    // 2 belum lunas
    if (selectedFilter === "1") {
      transactionData = transactionData.filter(item => item.isPaid);
    } else if (selectedFilter === "2") {
      transactionData = transactionData.filter(item => !item.isPaid);
    }

    let depositData = await axios
      .post(`${servicesUrl}/reports/deposits`, {
        dateFrom: selectedDateStart,
        dateTo: selectedDateEnd
      })
      .then(res => res.data);

    this.setState({ isLoadingProps: false, dataTransactions: transactionData, dataDeposits: depositData });
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

  async componentDidMount() {
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
        this.handleChange(calendar);
      });
    });

    let monthsList = [];

    for (let i = 1; i <= 12; i++) {
      monthsList.push(moment(i, "MM").format("MMMM"));
    }

    this.setState({ monthsList });
  }

  render() {
    let {
      isLoadingProps,
      periodType,
      monthsList,
      yearsList,
      selectedPeriodType,
      selectedDaily,
      selectedMonth,
      selectedYear,
      selectedFilter,
      dataTransactions,
      dataDeposits
    } = this.state;

    return (
      <React.Fragment>
        <form>
          <div className="field is-horizontal">
            <div className="field-label is-normal">
              <label className="label">Period Type:</label>
            </div>
            <div className="field-body">
              <span className="select">
                <select name="selectedPeriodType" value={selectedPeriodType || ""} onChange={this.handleChange}>
                  {periodType.map(item => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </span>
            </div>
          </div>
          <div className="field is-horizontal">
            <div className={selectedPeriodType === "daily" ? "field-label is-normal" : "hidden"}>
              <label className="label">Date:</label>
            </div>
            <div className={selectedPeriodType === "daily" ? "field-body" : "hidden"}>
              <input
                type="text"
                data-type="date"
                className="input is-narrow"
                name="selectedDaily"
                placeholder="Masukkan tanggal terima..."
                onChange={this.handleChange}
                value={moment(selectedDaily, "YYYY-MM-DD").format("DD MMM YYYY") || ""}
              />
            </div>
            {selectedPeriodType === "daily" ? (
              <React.Fragment />
            ) : (
              <React.Fragment>
                <div className="field-label is-normal">
                  <label className="label">Periode:</label>
                </div>
                <div className="field-body">
                  {selectedPeriodType !== "yearly" ? (
                    <div className="field is-narrow">
                      <span className="select">
                        <select name="selectedMonth" value={selectedMonth || ""} onChange={this.handleChange}>
                          {monthsList.map(item => (
                            <option key={item} value={item}>
                              {item}
                            </option>
                          ))}
                        </select>
                      </span>
                    </div>
                  ) : (
                    <React.Fragment />
                  )}
                  <div className="field is-narrow">
                    <span className="select">
                      <select name="selectedYear" value={selectedYear || ""} onChange={this.handleChange}>
                        {yearsList.map(item => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </span>
                  </div>
                </div>
              </React.Fragment>
            )}
          </div>
          <div className="field is-horizontal">
            <div className="field-label is-normal">
              <label className="label">Filter</label>
            </div>
            <div className="field-body">
              <div className="field is-narrow">
                <span className="select">
                  <select name="selectedFilter" value={selectedFilter} onChange={this.handleChange}>
                    <option value="0">Semua</option>
                    <option value="1">Sudah lunas</option>
                    <option value="2">Belum lunas</option>
                  </select>
                </span>
              </div>
            </div>
          </div>
          <div className="field is-horizontal">
            <div className="field-label" />
            <div className="field-body">
              <button className="button is-primary" onClick={this.handleSubmit}>
                Create Report
              </button>
            </div>
          </div>
        </form>
        <br />
        {dataTransactions.length !== 0 ? (
          <PrintReportTransaction dataTransactions={dataTransactions} dataDeposits={dataDeposits} />
        ) : isLoadingProps ? (
          <Loading />
        ) : (
          <span>No data / Select months</span>
        )}
      </React.Fragment>
    );
  }
}

export default ReportTransaction;
