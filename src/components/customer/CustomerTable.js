import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import numeral from "numeral";

import servicesUrl, { datetimeFormat } from "../../config";

import Loading from "../common/Loading";
import { IconInfo } from "../../images/BaseIcons";

export default class CustomerTable extends Component {
  constructor() {
    super();

    this.state = {
      // Base
      isLoading: false,
      pagingState: 0,
      pagingMax: 0,
      // =========================
      //
      // States
      searchCustomer: "",
      searchExpiring: false,
      customerList: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);

    this.submitSearch = this.submitSearch.bind(this);
  }

  componentDidMount() {
    this.fetchCustomer();
  }

  async fetchCustomer(search = "", expired = false, pagingCommand = null) {
    this.setState({ isLoading: true, customerList: [] });
    try {
      let { pagingState, pagingMax } = this.state;

      let customerList = [];

      pagingState = pagingCommand === "next" ? pagingState + 1 : pagingCommand === "prev" ? pagingState - 1 : 1;

      if (search === "" && expired === false) {
        let response = await axios.get(`${servicesUrl}/customers/?page=${pagingState}`).then(res => res.data);
        customerList = response.results;

        pagingMax = response.pages;
      } else {
        let expiringDate = "";

        if (expired) {
          expiringDate = moment()
            .add(7, "days")
            .hours(0)
            .minutes(0)
            .seconds(0)
            .milliseconds(0)
            .format(datetimeFormat);
        }

        let response = await axios
          .get(`${servicesUrl}/customers/search?value=${search}&expiration_date=${expiringDate}&page=${pagingState}`)
          .then(res => res.data);

        customerList = response.results;
        pagingMax = response.pages;
      }

      customerList.forEach(item => {
        item.almost_expire = moment().isAfter(moment(item.expiration_date, datetimeFormat).subtract(7, "days")) ? true : false;
      });

      this.setState({ customerList, pagingState, pagingMax });
    } catch (err) {
      console.log(err);
    }
    this.setState({ isLoading: false });
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSelect(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  submitSearch(e) {
    e.preventDefault();
    let { searchCustomer, searchExpiring } = this.state;

    this.fetchCustomer(searchCustomer, JSON.parse(searchExpiring));
  }

  render() {
    let {
      // Base
      isLoading,
      pagingState,
      pagingMax,
      searchCustomer,
      searchExpiring,
      // =========================
      //
      // States
      customerList
    } = this.state;

    return (
      <React.Fragment>
        <form className="columns">
          <div className="column">
            <label className="label">Search by name, alamat, no hp</label>
            <p className="control has-icons-left">
              <input
                className="input"
                type="text"
                name="searchCustomer"
                placeholder="..."
                onChange={this.handleChange}
                value={searchCustomer || ""}
              />
              <span className="icon is-small is-left">
                <i className="fas fa-search" />
              </span>
            </p>
          </div>
          <div className="column is-4">
            <label className="label">Filter tanggal expire</label>
            <span className="select is-expanded">
              <select name="searchExpiring" data-type="bool" value={searchExpiring || ""} onChange={this.handleSelect}>
                <option value="false">Semua</option>
                <option value="true">Segera Expire</option>
              </select>
            </span>
          </div>
          <div className="column is-narrow flex flex-align-end">
            <button className="button is-primary" onClick={e => this.submitSearch(e)}>
              Cari
            </button>
          </div>
        </form>

        <div className={isLoading ? "" : "scrollable-table-div"}>
          <table className={isLoading ? "table is-fullwidth has-actions" : "table is-fullwidth is-hoverable has-actions"}>
            <thead>
              <tr>
                <th>Nama</th>
                <th>Alamat</th>
                <th>No HP</th>
                <th>Saldo</th>
                <th>Tanggal Expire</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {customerList.length === 0 ? (
                <tr>
                  <td colSpan="6" className="has-text-centered">
                    {isLoading ? <Loading /> : "Tidak ada data"}
                  </td>
                </tr>
              ) : (
                customerList.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.address}</td>
                    <td>{item.mobile}</td>
                    <td>{numeral(item.balance).format("0,0")}</td>
                    <td>
                      {item.expiration_date ? (
                        <span className={item.almost_expire ? "tag is-warning" : "tag is-success"}>
                          {moment(item.expiration_date, datetimeFormat).format("DD MMM YYYY")}
                        </span>
                      ) : (
                        <span className="tag is-danger">No Deposit</span>
                      )}
                    </td>
                    <td>
                      <Link to={`/customers/${item.id}`} className="button is-info m-r-1">
                        <IconInfo s="14px" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot>
              <tr>
                <th colSpan="6">
                  <div className="pagination is-right" role="navigation" aria-label="pagination">
                    <span
                      className={customerList.length > 0 && pagingState > 1 ? "pagination-previous" : "pagination-previous invisible"}
                      onClick={() => this.fetchCustomer("", false, "prev")}>
                      Previous page
                    </span>
                    <span
                      className={customerList.length > 0 && pagingState !== pagingMax ? "pagination-next" : "pagination-next invisible"}
                      onClick={() => this.fetchCustomer("", false, "next")}>
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
