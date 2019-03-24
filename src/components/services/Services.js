import React, { Component } from "react";
import axios from "axios";
import numeral from "numeral";
import { connect } from "react-redux";

import servicesUrl from "../../config";
import { CheckNumber, CheckNumberAllowZero, CheckString } from "../common/Regex";
import { ValidationError } from "../common/Error";

import { ErrorMessage, toggleError, SuccessMessage, toggleSuccess } from "../common/Message";

import ServiceForm from "./ServiceForm";
import ServiceTable from "./ServiceTable";

class Services extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Base
      isLoading: false,
      isRequesting: false,
      errorList: [],
      // =========================
      //
      // State
      serviceId: null,
      serviceName: null,
      serviceUnit: "kg",
      servicePrice: null,
      serviceExpress: null,
      serviceList: [],
      serviceCannotExpress: false
    };

    this.handleChange = this.handleChange.bind(this);

    this.bindService = this.bindService.bind(this);
    this.submitService = this.submitService.bind(this);
    this.deleteService = this.deleteService.bind(this);
    this.clearService = this.clearService.bind(this);
  }

  componentDidMount() {
    this.fetchServices();
  }

  // #region Base func
  handleChange(e) {
    if (e.target.type === "checkbox") {
      this.setState({ [e.target.name]: e.target.checked });
    } else {
      this.setState({ [e.target.name]: e.target.value });
    }
  }

  bindService(item) {
    let { serviceId, serviceName, serviceUnit, servicePrice, serviceExpress, serviceCannotExpress } = this.state;

    serviceId = item.id;
    serviceName = item.name;
    serviceUnit = item.unit;
    servicePrice = item.price;
    serviceExpress = item.express_price;
    serviceCannotExpress = item.express_price === -1;

    this.setState({ serviceId, serviceName, serviceUnit, servicePrice, serviceExpress, serviceCannotExpress });
  }

  async fetchServices() {
    this.setState({ serviceList: [], isLoading: true });
    try {
      const data = await axios.get(`${servicesUrl}/services`).then(res => res.data);
      this.setState({ serviceList: data });
    } catch (err) {
      console.log(err);
    }
    this.setState({ isLoading: false });
  }

  async submitService(e) {
    e.preventDefault();
    this.setState({ isRequesting: true });
    try {
      let { serviceId, serviceName, serviceUnit, servicePrice, serviceExpress, serviceCannotExpress } = this.state;

      let errorList = [];

      servicePrice = numeral(servicePrice).value();
      serviceExpress = numeral(serviceExpress).value();

      if (!CheckString.test(serviceName || "")) errorList.push("Service harus diisi");
      if (!CheckString.test(serviceUnit || "")) errorList.push("Satuan harus diisi");
      if (!CheckNumber.test(servicePrice || "")) errorList.push("Harga harus diisi");
      if (!CheckNumberAllowZero.test(serviceExpress)) errorList.push("Express harus diisi");

      if (errorList.length > 0) throw new ValidationError(errorList);

      let servicePost = {
        name: serviceName,
        unit: serviceUnit,
        price: servicePrice,
        expressPrice: serviceCannotExpress ? -1 : serviceExpress
      };

      if (serviceId !== null && serviceId !== undefined) {
        await axios.put(`${servicesUrl}/services/${serviceId}`, servicePost);
        toggleSuccess("Service berhasil diubah");
      } else {
        await axios.post(`${servicesUrl}/services`, servicePost);
        toggleSuccess("Service berhasil ditambahkan");
      }

      this.clearService();
      this.fetchServices();
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

  async deleteService(e) {
    e.preventDefault();
    this.setState({ isRequesting: true });
    try {
      if (window.confirm(`Anda yakin ingin menghapus layanan yang dipilih?`)) {
        let { serviceId } = this.state;

        if (serviceId !== undefined || serviceId !== 0) {
          await axios.delete(`${servicesUrl}/services/${serviceId}`);
          toggleSuccess("Service berhasil dihapus");
        } else {
          throw new ErrorMessage("Select service first");
        }

        this.fetchServices();
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

  clearService(e = null) {
    if (e !== null) e.preventDefault();
    this.setState({ serviceId: null, serviceName: null, serviceUnit: null, servicePrice: null, serviceExpress: null });
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
      serviceId,
      serviceName,
      serviceUnit,
      servicePrice,
      serviceExpress,
      serviceCannotExpress,
      serviceList
    } = this.state;

    const { login } = this.props;

    return (
      <React.Fragment>
        <SuccessMessage />
        <ErrorMessage errorList={errorList} />
        {login === 1 ? (
          <div className="flex flex-justify-end m-b-2">
            <p className="control">
              <button
                className={isRequesting ? "button is-primary is-loading m-r-1" : "button is-primary m-r-1"}
                onClick={this.submitService}
                disabled={isRequesting}>
                {serviceId === null ? "Tambah" : "Update"}
              </button>
            </p>
            <p className={serviceId === null ? "hidden" : "control"}>
              <button
                className={isRequesting ? "button is-danger is-loading m-r-1" : "button is-danger m-r-1"}
                onClick={this.deleteService}
                disabled={isRequesting}>
                Delete
              </button>
            </p>
            <p className={serviceId === null ? "hidden" : "control"}>
              <button className={isRequesting ? "button is-loading" : "button"} onClick={this.clearService} disabled={isRequesting}>
                Batal
              </button>
            </p>
          </div>
        ) : (
          <React.Fragment />
        )}
        <div className="columns is-desktop">
          {login === 1 ? (
            <div className="column is-5-widescreen">
              <ServiceForm
                // Base
                isRequesting={isRequesting}
                login={login}
                // =========================
                //
                // State
                serviceId={serviceId}
                serviceName={serviceName}
                serviceUnit={serviceUnit}
                servicePrice={servicePrice}
                serviceExpress={serviceExpress}
                serviceCannotExpress={serviceCannotExpress}
                // =========================
                //
                // Func
                handleChange={this.handleChange}
                submitService={this.submitService}
                deleteService={this.deleteService}
                clearService={this.clearService}
              />
            </div>
          ) : (
            <React.Fragment />
          )}
          <div className="column">
            <ServiceTable isLoading={isLoading} login={login} serviceList={serviceList} bindService={this.bindService} />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    login: state.login.item
  };
};

export default connect(mapStateToProps)(Services);
