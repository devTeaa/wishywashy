import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";

import servicesUrl from "../../../config";

import DetailCustomer from "./DetailCustomer";
import SelectCustomerTable from "./SelectCustomerTable";

class SelectCustomer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Base
      isLoading: false,
      //
      // =========================
      // State
      searchCustomer: "",
      customerList: []
    };

    this.fetchCustomer = this.fetchCustomer.bind(this);

    this.handleChange = this.handleChange.bind(this);
  }

  async componentDidMount() {
    this.fetchCustomer();
  }

  async componentDidUpdate(prevProps, prevState) {
    if (this.state.searchCustomer !== prevState.searchCustomer) {
      this.fetchCustomer(this.state.searchCustomer);
    }
  }

  async fetchCustomer(search = "") {
    this.setState({ customerList: [], isLoading: true });
    try {
      const response = await axios
        .get(search === "" ? `${servicesUrl}/customers/?page=1` : `${servicesUrl}/customers/search?value=${search}&page=1`)
        .then(res => res.data);
      this.setState({ customerList: response.results });
    } catch (err) {
      console.log(err);
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

  render() {
    const {
      // Base
      viewMode,
      // State
      selectedCustomer,
      // =========================
      //
      // Func
      bindCustomer
    } = this.props;

    let { searchCustomer, customerList, isLoading } = this.state;

    return (
      <React.Fragment>
        <div className="columns is-desktop">
          <div className={viewMode !== 0 ? "column is-offset-2 is-8 is-desktop" : "column is-two-fifths-desktop"}>
            <DetailCustomer selectedCustomer={selectedCustomer} />
          </div>

          {viewMode === 0 ? (
            <div className="column">
              <div className="field">
                <div className="control has-icons-left">
                  <input
                    className="input"
                    type="text"
                    name="searchCustomer"
                    placeholder="Cari customer dengan nama/alamat/no hp..."
                    onChange={this.handleChange}
                    value={searchCustomer}
                  />
                  <span className="icon is-small is-left">
                    <i className="fa fa-search" />
                  </span>
                </div>
                <SelectCustomerTable isLoading={isLoading} customerList={customerList} bindCustomer={bindCustomer} />
              </div>
            </div>
          ) : (
            <React.Fragment />
          )}
        </div>
      </React.Fragment>
    );
  }
}

SelectCustomer.propTypes = {
  // Form view viewMode
  // 0 = isFull
  // 1 = isEdit
  // 2 = isView
  viewMode: PropTypes.number.isRequired,
  // Selected Service
  selectedCustomer: PropTypes.object,
  // Bind Customer to detail
  bindCustomer: PropTypes.func.isRequired
};

export default SelectCustomer;
