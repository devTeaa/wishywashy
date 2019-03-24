import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import numeral from "numeral";

import servicesUrl, { datetimeFormat } from "../../config";
import { CheckString } from "../common/Regex";
import { ValidationError, MessageError } from "../common/Error";
import { ErrorMessage, toggleError, SuccessMessage, toggleSuccess } from "../common/Message";

class CustomerForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Base
      depositList: [],
      isLoading: false,
      isRequesting: false,
      errorList: [],
      // =========================
      //
      // State
      customerName: null,
      customerAddress: null,
      customerCity: "Jakarta",
      customerMobile: null,
      customerDepositAmount: 0,
      customerHistory: [],
      selectedDepositId: null,
      selectedDepositName: null,
      selectedDepositPrice: null,
      selectedDepositAmount: null
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);

    this.submitCustomer = this.submitCustomer.bind(this);
    this.deleteCustomer = this.deleteCustomer.bind(this);
  }

  // #region Lifecycle
  async componentDidMount() {
    this.setState({ isLoading: true });

    if (this.props.match.params.id !== undefined) {
      const customer = await axios.get(`${servicesUrl}/customers/${this.props.match.params.id}`).then(res => res.data);
      this.setState({
        customerName: customer.name,
        customerAddress: customer.address,
        customerCity: customer.city,
        customerMobile: customer.mobile,
        customerDepositAmount: customer.balance,
        customerHistory: customer.history
      });
    }

    let { depositList } = this.state;

    depositList.push({
      depositId: 0,
      depositName: "-Pilih paket--",
      depositPrice: 0,
      depositAmount: 0
    });

    const deposits = await axios.get(`${servicesUrl}/deposits`).then(res => res.data);
    deposits.forEach(item => {
      depositList.push({
        depositId: item.id,
        depositName: item.name,
        depositPrice: item.price,
        depositAmount: item.amount
      });
    });

    this.setState({ isLoading: false, depositList });
  }
  // #endregion

  // #region Base func
  handleChange(e) {
    if (e.target.type === "checkbox") {
      this.setState({ [e.target.name]: e.target.checked });
    } else {
      this.setState({ [e.target.name]: e.target.value });
    }
  }

  handleSelect(e) {
    this.setState({ [e.target.name]: e.target.value });
    if (e.target.name === "selectedDepositName" && e.target.value !== "") {
      let { selectedDepositId, selectedDepositPrice, selectedDepositAmount, depositList, customerDepositAmount } = this.state;

      customerDepositAmount -= selectedDepositAmount;

      let selectedDeposit = depositList[e.target.options.selectedIndex];
      selectedDepositId = selectedDeposit.depositId;
      selectedDepositPrice = selectedDeposit.depositPrice;
      selectedDepositAmount = selectedDeposit.depositAmount;
      customerDepositAmount += selectedDeposit.depositAmount;

      this.setState({ selectedDepositId, selectedDepositPrice, selectedDepositAmount, customerDepositAmount });
    }
  }

  async submitCustomer(e) {
    e.preventDefault();
    this.setState({ isRequesting: true });
    try {
      let { customerName, customerAddress, customerCity, customerMobile, selectedDepositId } = this.state;

      let errorList = [];

      if (!CheckString.test(customerName || "")) errorList.push("Nama harus diisi");
      if (!CheckString.test(customerAddress || "")) errorList.push("Alamat harus diisi");

      if (errorList.length > 0) throw new ValidationError(errorList);

      let customerPost = {
        id: this.props.match.params.id,
        name: customerName,
        address: customerAddress,
        city: customerCity,
        mobile: customerMobile,
        depositId: selectedDepositId
      };

      if (this.props.match.params.id !== undefined) {
        await axios.put(`${servicesUrl}/customers/${this.props.match.params.id}`, customerPost);
        toggleSuccess("Customer berhasil diubah");
      } else {
        await axios.post(`${servicesUrl}/customers`, customerPost);
        toggleSuccess("Customer berhasil ditambahkan");
      }
      setTimeout(() => {
        this.props.history.push("/customers");
      }, 2000);
    } catch (err) {
      let errorList = [];

      if (err.response) {
        errorList.push(`${err.response.status} ${err.response.statusText}`);
      } else if (err.request) {
        errorList.push("Request Timeout");
      } else if (err instanceof ValidationError) {
        errorList = err.errorList;
      }

      this.setState({ errorList });
      toggleError();
      this.setState({ isRequesting: false });
    }
  }

  async deleteCustomer(e) {
    e.preventDefault();
    this.setState({ isRequesting: true });
    try {
      if (!window.confirm("Konfirmasi hapus customer?")) throw MessageError("Batal hapus customer");

      if (this.props.match.params.id !== null && this.props.match.params.id !== undefined) {
        await axios.delete(`${servicesUrl}/customers/${this.props.match.params.id}`);
        toggleSuccess("Customer berhasil dihapus");
        setTimeout(() => {
          this.props.history.push("/customers");
        }, 2000);
      }
    } catch (err) {
      let { errorList } = this.state;

      if (err.response) {
        errorList.push(`${err.response.status} ${err.response.statusText}`);
      } else if (err.request) {
        errorList.push("Request Timeout");
      } else if (err instanceof MessageError) {
        errorList.push(err.message);
      }

      this.setState({ errorList });
      toggleError();
    }
    this.setState({ isRequesting: false });
  }

  // #endregion

  render() {
    let {
      // Base
      depositList,
      isLoading,
      isRequesting,
      errorList,
      // =========================
      //
      // State
      customerName,
      customerAddress,
      customerCity,
      customerMobile,
      customerDepositAmount,
      customerHistory,
      selectedDepositName,
      selectedDepositPrice,
      selectedDepositAmount
    } = this.state;

    const depositOption = depositList.map((item, index) => (
      <option key={index} value={item.depositName}>
        {item.depositName}
      </option>
    ));

    return (
      <React.Fragment>
        <SuccessMessage />
        <ErrorMessage errorList={errorList} />
        <form>
          <div className="columns flex flex-justify-end">
            <button
              className={isRequesting ? "button is-primary m-r-1 is-loading" : "button is-primary m-r-1"}
              onClick={e => this.submitCustomer(e)}
              disabled={isRequesting}>
              {this.props.match.params.id === undefined ? "Tambah" : "Update"}
            </button>
            <p className={this.props.match.params.id !== null && this.props.match.params.id !== undefined ? "control" : "hidden"}>
              <button
                className={isRequesting ? "button is-danger m-r-1 is-loading" : "button is-danger m-r-1"}
                onClick={e => this.deleteCustomer(e)}
                disabled={isRequesting}>
                Delete
              </button>
            </p>
            <Link to={"/customers"} className={isRequesting ? "button is-loading" : "button"}>
              Batal
            </Link>
          </div>
          <div className="columns is-desktop">
            <div className="column">
              <div className="field">
                <label className="label">Nama</label>
                <div className={isLoading ? "control is-loading" : "control"}>
                  <input
                    className="input"
                    name="customerName"
                    type="text"
                    placeholder="Masukkan nama..."
                    value={customerName || ""}
                    onChange={this.handleChange}
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Alamat</label>
                <div className={isLoading ? "control is-loading" : "control"}>
                  <input
                    className="input"
                    name="customerAddress"
                    type="text"
                    placeholder="Masukkan alamat..."
                    value={customerAddress || ""}
                    onChange={this.handleChange}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="field">
                <label className="label">Kota</label>
                <div className={isLoading ? "control is-loading" : "control"}>
                  <input
                    className="input"
                    type="text"
                    name="customerCity"
                    placeholder="Masukkan kota..."
                    value={customerCity || ""}
                    onChange={this.handleChange}
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">No HP</label>
                <div className={isLoading ? "control is-loading" : "control"}>
                  <input
                    className="input"
                    type="text"
                    name="customerMobile"
                    placeholder="0812, +6221987"
                    value={customerMobile || ""}
                    onChange={this.handleChange}
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            <div className="column">
              <div className="field columns">
                <div className="field column">
                  <label className="label">Jenis Paket</label>
                  <div className="field">
                    <span className={isLoading ? "select is-expanded is-loading" : "select is-expanded"}>
                      <select name="selectedDepositName" value={selectedDepositName || ""} onChange={this.handleSelect} disabled={isLoading}>
                        {depositOption}
                      </select>
                    </span>
                  </div>
                </div>
                <div className="field column">
                  <label className="label">Harga Paket</label>
                  <div className="field has-addons">
                    <p className="control">
                      <span className="button is-static">Rp</span>
                    </p>
                    <p className="control">
                      <input type="text" className="input" value={numeral(selectedDepositPrice).format("0,0") || ""} readOnly />
                    </p>
                  </div>
                </div>
                <div className="field column">
                  <label className="label">Saldo Paket</label>
                  <div className="field has-addons">
                    <p className="control">
                      <span className="button is-static">+</span>
                    </p>
                    <p className="control">
                      <input type="text" className="input" value={numeral(selectedDepositAmount).format("0,0") || ""} readOnly />
                    </p>
                  </div>
                </div>
              </div>
              <div className="field">
                <label className="label">Saldo Akhir</label>
                <div className="field">
                  <input type="text" className="input" value={numeral(customerDepositAmount).format("0,0") || 0} readOnly />
                </div>
              </div>
              <div className="field">
                <table className="table is-fullwidth">
                  <thead>
                    <tr>
                      <th>Tanggal Expired</th>
                      <th>Balance Expired</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customerHistory.map(item => (
                      <tr key={item.expirationDate}>
                        <td>{moment(item.expirationDate, datetimeFormat).format("DD MMM YYYY")}</td>
                        <td>{numeral(item.expirationBalance).format("0,0")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </form>
      </React.Fragment>
    );
  }
}

export default CustomerForm;
