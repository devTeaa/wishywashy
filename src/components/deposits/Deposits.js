import React, { Component } from "react";
import axios from "axios";
import numeral from "numeral";

import servicesUrl from "../../config";
import { CheckNumber, CheckString } from "../common/Regex";
import { ValidationError } from "../common/Error";

import { ErrorMessage, toggleError, SuccessMessage, toggleSuccess } from "../common/Message";

import DepositForm from "./DepositForm";
import DepositTable from "./DepositTable";

class Deposits extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Base
      isLoading: false,
      isRequesting: false,
      errorList: [],
      // =========================
      // State
      depositId: 0,
      depositName: null,
      depositPrice: null,
      depositAmount: null,
      depositDuration: null,
      depositList: []
    };

    this.handleChange = this.handleChange.bind(this);

    this.bindDeposit = this.bindDeposit.bind(this);

    this.submitDeposit = this.submitDeposit.bind(this);
    this.deleteDeposit = this.deleteDeposit.bind(this);
    this.clearDeposits = this.clearDeposits.bind(this);
  }

  componentDidMount() {
    this.fetchDeposits();
  }

  // #region Base func
  handleChange(e) {
    if (e.target.type === "checkbox") {
      this.setState({ [e.target.name]: e.target.checked });
    } else {
      this.setState({ [e.target.name]: e.target.value });
    }
  }

  async fetchDeposits() {
    this.setState({ depositList: [], isLoading: true });
    try {
      const data = await axios.get(`${servicesUrl}/deposits`).then(res => res.data);
      this.setState({ depositList: data });
    } catch (err) {
      console.log(err);
    }
    this.setState({ isLoading: false });
  }

  bindDeposit(item) {
    let { depositId, depositName, depositPrice, depositAmount, depositDuration } = this.state;
    depositId = item.id;
    depositName = item.name;
    depositPrice = item.price;
    depositAmount = item.amount;
    depositDuration = item.duration;

    this.setState({ depositId, depositName, depositPrice, depositAmount, depositDuration });
  }

  async submitDeposit(e) {
    e.preventDefault();
    this.setState({ isRequesting: true });
    try {
      let { depositId, depositName, depositPrice, depositAmount, depositDuration } = this.state;

      let errorList = [];

      depositPrice = numeral(depositPrice).value();
      depositAmount = numeral(depositAmount).value();

      if (!CheckString.test(depositName || "")) errorList.push("Deposit harus diisi");
      if (!CheckNumber.test(depositPrice || "")) errorList.push("Harga harus diisi");
      if (!CheckNumber.test(depositAmount || "")) errorList.push("Nilai harus diisi");
      if (!CheckNumber.test(depositDuration || "")) errorList.push("Durasi deposit harus diisi");

      if (errorList.length > 0) throw new ValidationError(errorList);

      let depositPost = {
        name: depositName,
        price: depositPrice,
        amount: depositAmount,
        duration: depositDuration
      };

      if (depositId !== 0 && depositId !== undefined) {
        await axios.put(`${servicesUrl}/deposits/${depositId}`, depositPost);
        toggleSuccess("Deposit berhasil diubah");
      } else {
        await axios.post(`${servicesUrl}/deposits`, depositPost);
        toggleSuccess("Deposit berhasil ditambahkan");
      }

      this.clearDeposits();
      this.fetchDeposits();
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
    }
    this.setState({ isRequesting: false });
  }

  async deleteDeposit(e) {
    e.preventDefault();
    this.setState({ isRequesting: true });
    try {
      if (window.confirm(`Anda yakin ingin menghapus deposit yang dipilih?`)) {
        let { depositId } = this.state;
        if (depositId !== undefined || depositId !== 0) {
          await axios.delete(`${servicesUrl}/deposits/${depositId}`);
          toggleSuccess("Deposit berhasil ditambahkan");
        } else {
          throw new ErrorMessage("Select deposit first");
        }

        this.fetchDeposits();
      }
    } catch (err) {
      let { errorList } = this.state;

      if (err.response) {
        errorList.push(`${err.response.status} ${err.response.statusText}`);
      } else if (err.request) {
        errorList.push("Request Timeout");
      } else if (err instanceof ValidationError) {
        errorList = err.errorList;
      }

      this.setState({ errorList });
      toggleError();
    }
    this.setState({ isRequesting: false });
  }

  clearDeposits(e = null) {
    if (e !== null) e.preventDefault();
    this.setState({ depositId: 0, depositName: "", depositPrice: 0, depositAmount: 0 });
  }
  // #endregion

  render() {
    let {
      // Base
      isLoading,
      isRequesting,
      errorList,
      // =========================
      //
      // State
      depositId,
      depositName,
      depositPrice,
      depositAmount,
      depositDuration,
      depositList
    } = this.state;

    return (
      <React.Fragment>
        <SuccessMessage />
        <ErrorMessage errorList={errorList} />
        <div className="flex flex-justify-end m-b-2">
          <p className="control">
            <button
              className={isRequesting ? "button is-primary is-loading m-r-1" : "button is-primary m-r-1"}
              onClick={this.submitDeposit}
              disabled={isRequesting}>
              {depositId === 0 ? "Tambah" : "Update"}
            </button>
          </p>
          <p className={depositId === 0 ? "hidden" : "control"}>
            <button
              className={isRequesting ? "button is-danger is-loading m-r-1" : "button is-danger m-r-1"}
              onClick={this.deleteDeposit}
              disabled={isRequesting}>
              Delete
            </button>
          </p>
          <p className={depositId === 0 ? "hidden" : "control"}>
            <button className={isRequesting ? "button is-loading" : "button"} onClick={this.clearDeposits} disabled={isRequesting}>
              Batal
            </button>
          </p>
        </div>
        <div className="columns is-desktop">
          <div className="column">
            <DepositForm
              // State
              depositName={depositName}
              depositPrice={depositPrice}
              depositAmount={depositAmount}
              depositDuration={depositDuration}
              // =========================
              //
              // Func
              handleChange={this.handleChange}
              submitDeposit={this.submitDeposit}
            />
          </div>
          <div className="column">
            <DepositTable isLoading={isLoading} depositList={depositList} bindDeposit={this.bindDeposit} />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Deposits;
