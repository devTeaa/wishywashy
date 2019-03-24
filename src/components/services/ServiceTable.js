import React, { Component } from "react";
import PropTypes from "prop-types";
import numeral from "numeral";

import Loading from "../common/Loading";

class ServiceTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchServices: ""
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    let { searchServices } = this.state;
    let { isLoading, login, serviceList, bindService } = this.props;

    let serviceRegex = new RegExp(`${searchServices}`, "i");

    return (
      <React.Fragment>
        <form className="columns">
          <div className="column">
            <label className="label">Cari berdasarkan nama layanan</label>
            <p className="control has-icons-left">
              <input
                className="input"
                type="text"
                name="searchServices"
                placeholder="..."
                onChange={this.handleChange}
                value={searchServices || ""}
              />
              <span className="icon is-small is-left">
                <i className="fas fa-search" />
              </span>
            </p>
          </div>
        </form>

        <div className={isLoading ? "" : "scrollable-table-div"}>
          <table className={isLoading ? "table has-actions" : "table is-hoverable has-actions"}>
            <thead>
              <tr>
                <th>Layanan</th>
                <th>Satuan</th>
                <th>Harga</th>
                <th>Express</th>
                {login === 1 ? <th>Action</th> : <React.Fragment />}
              </tr>
            </thead>
            <tbody>
              {serviceList.length === 0 ? (
                <tr>
                  <td colSpan="5">{isLoading ? <Loading /> : "No data available"}</td>
                </tr>
              ) : (
                serviceList
                  .filter(service => serviceRegex.test(service.name))
                  .map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td>{item.unit}</td>
                      <td>{numeral(item.price).format("0,0")}</td>
                      <td>{item.express_price !== -1 ? numeral(item.express_price).format("0,0") : "Tidak bisa express"}</td>
                      {login === 1 ? (
                        <td className="has-text-right">
                          <button className="button is-info m-r-1" onClick={() => bindService(item)}>
                            <i className="fas fa-pencil-alt" />
                          </button>
                        </td>
                      ) : (
                        <React.Fragment />
                      )}
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </React.Fragment>
    );
  }
}

ServiceTable.propTypes = {
  // Base
  isLoading: PropTypes.bool.isRequired,
  login: PropTypes.number.isRequired,
  // =========================
  //
  // State
  serviceList: PropTypes.array.isRequired,
  // =========================
  //
  // Func
  bindService: PropTypes.func.isRequired
};

export default ServiceTable;
