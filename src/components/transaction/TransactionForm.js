import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import moment from "moment";

import servicesUrl, { datetimeFormat } from "../../config";
import { ErrorMessage, toggleError, SuccessMessage, toggleSuccess } from "../common/Message";
import { CheckString, CheckNumber } from "../common/Regex";
import { ValidationError } from "../common/Error";

import SelectCustomer from "./selectCustomer/SelectCustomer";
import SelectServices from "./selectServices/SelectServices";
import SelectItems from "./selectItems/SelectItems";
import TransactionConfirmation from "./TransactionConfirmation";

import TransactionSteps from "./TransactionSteps";
import { calculateServiceNumber } from "../../formula";

class TransactionForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Base
      step: this.props.match.params.id ? 3 : 0,
      viewMode: 0,
      // 0 = isFull
      // 1 = isEdit
      // 2 = isView
      invoiceId: this.props.match.params.id || null,
      errorList: [],
      isLoading: false,
      isRequesting: false,
      // =========================
      //
      // 1. Select Customer
      selectedCustomer: {},
      // > customerId,
      // > customerName,
      // > customerAddress,
      // > customerMobile,
      // > customerBalance
      // =========================
      //
      // 2. Select Services
      editIndex: null,
      selectedServicesList: [],
      // > serviceId
      // > serviceName
      // > servicePrice
      // > serviceQuantity
      // > serviceUnit
      // > serviceExpress
      // > serviceIsExpress
      selectedServiceName: null,
      selectedServiceQuantity: null,
      selectedServiceUnit: null,
      selectedServicePrice: null,
      selectedServiceExpress: null,
      selectedServiceIsExpress: false,
      selectedServiceIsActive: false,
      // =========================
      //
      // 3. Select Item Detail
      selectedItemDetailList: [],
      // > itemDetailId
      // > itemDetailName
      // > itemDetailQuantity
      selectedItemDetailId: null,
      selectedItemDetailName: null,
      selectedItemDetailQuantity: null,
      // =========================
      //
      // 4. Confirmation
      selectedDateReceived: null,
      selectedDateFinished: null,
      useDeposit: false,
      isPaid: false,
      isComplete: false,
      discountPrice: null
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.nextStep = this.nextStep.bind(this);
    this.prevStep = this.prevStep.bind(this);

    // Customers
    this.bindCustomer = this.bindCustomer.bind(this);

    // Services
    this.bindService = this.bindService.bind(this);
    this.addService = this.addService.bind(this);
    this.editService = this.editService.bind(this);
    this.deleteService = this.deleteService.bind(this);
    this.clearSelectedService = this.clearSelectedService.bind(this);

    // Items
    this.bindItemDetail = this.bindItemDetail.bind(this);
    this.addItemDetail = this.addItemDetail.bind(this);
    this.deleteItemDetail = this.deleteItemDetail.bind(this);
    this.clearSelectedItemDetail = this.clearSelectedItemDetail.bind(this);

    // Confirmation
    this.submitTransaction = this.submitTransaction.bind(this);
  }
  // =========================
  //
  // #region Lifecycle
  async componentDidMount() {
    // if editing a transaction
    if (this.props.match.params.id !== undefined) {
      this.setState({ isLoading: true });
      try {
        let data = await axios.get(`${servicesUrl}/transactions/${this.props.match.params.id}`).then(res => res.data);

        let {
          selectedDateReceived,
          selectedDateFinished,
          selectedCustomer,
          selectedServicesList,
          selectedItemDetailList,
          discountPrice,
          useDeposit,
          isPaid,
          isComplete,
          viewMode
        } = this.state;

        // Get customerData
        const customerData = await axios.get(`${servicesUrl}/customers/${data.customerId}`).then(res => res.data);

        selectedDateReceived = moment(data.invoiceDate, datetimeFormat).format("YYYY-MM-DD");
        selectedDateFinished = moment(data.invoiceFinished, datetimeFormat).format("YYYY-MM-DD");

        selectedCustomer = {
          customerId: data.customerId,
          customerName: customerData.name,
          customerAddress: customerData.address,
          customerMobile: customerData.mobile,
          customerBalance: customerData.balance
        };

        data.transactionServices.forEach(item => {
          selectedServicesList.push({
            serviceId: item.serviceId,
            serviceName: item.serviceName,
            servicePrice: item.servicePrice,
            serviceQuantity: item.serviceQuantity,
            serviceUnit: item.serviceUnit,
            serviceExpress: item.serviceExpressPrice,
            serviceIsExpress: item.serviceIsExpress,
            serviceIsActive: item.serviceIsActive
          });

          selectedCustomer.customerBalance += calculateServiceNumber(
            item.serviceQuantity,
            item.servicePrice,
            item.serviceIsExpress,
            item.serviceExpress
          );
        });

        data.transactionItems.forEach(item => {
          selectedItemDetailList.push({
            itemDetailId: item.itemId,
            itemDetailName: item.itemName,
            itemDetailQuantity: item.itemQuantity
          });
        });

        discountPrice = data.discountPrice;
        useDeposit = data.useDeposit;
        isPaid = data.isPaid;
        isComplete = data.isComplete;

        // Enable editing if admin
        if (this.props.login === 1) {
          viewMode = 0;
        } else {
          // Disable editing if already complete
          if (isComplete) {
            // if (isComplete || moment().isAfter(moment(selectedDateReceived, "YYYY-MM-DD").add(7, "day"))) {
            viewMode = 2;
          } else {
            viewMode = 1;
          }
        }

        this.setState({
          selectedCustomer,
          selectedServicesList,
          selectedItemDetailList,
          selectedDateReceived,
          selectedDateFinished,
          discountPrice,
          useDeposit,
          isPaid,
          isComplete,
          viewMode
        });
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
    } else {
      let { selectedDateReceived } = this.state;

      selectedDateReceived = moment().format("YYYY-MM-DD");

      this.setState({ selectedDateReceived });
    }
    this.setState({ isLoading: false });
  }
  // #endregion
  // =========================
  //
  // #region Base func
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
    if (e.target.dataset.type === "bool") {
      this.setState({ [e.target.name]: JSON.parse(e.target.value) });

      if (e.target.name === "isPaid" && e.target.value === "false") this.setState({ isComplete: false });
    } else {
      this.setState({ [e.target.name]: e.target.value });
    }
  }

  nextStep() {
    let { selectedCustomer, selectedServicesList, step, selectedDateReceived, selectedDateFinished } = this.state;

    let errorList = [];
    if (step === 0) {
      // Select customer
      if (Object.keys(selectedCustomer).length === 0) errorList.push("Harus memilih 1 pelanggan");
    } else if (step === 1) {
      // Select services
      if (selectedServicesList.length === 0) errorList.push("Harus memilih minimal 1 layanan");

      // if no services using kg, then skip to confirmation
      if (selectedServicesList.filter(item => item.serviceUnit === "kg").length === 0) step++;

      // if selectedCustomer balance is enough to total service price then useDeposit
      // only on viewMode === 0 (insert mode)
      let totalServicesPrice = 0;
      let maxDays = 0;
      selectedServicesList.forEach(item => {
        // // Set service days based on selected service unit
        // maxDays = item.serviceUnit !== "kg" && item.serviceIsExpress !== true ? 3 : 1;

        // If express 1 days else 2 days
        maxDays = item.serviceIsExpress ? 1 : 2;

        totalServicesPrice += calculateServiceNumber(item.serviceQuantity, item.servicePrice, item.serviceIsExpress, item.serviceExpress);
      });

      selectedDateFinished = moment(selectedDateReceived, "YYYY-MM-DD")
        .add(maxDays, "days")
        .format("YYYY-MM-DD");

      let isEnough = selectedCustomer.customerBalance > totalServicesPrice;

      this.setState({ selectedDateReceived, selectedDateFinished, useDeposit: isEnough, isPaid: isEnough });
    }

    if (errorList.length === 0) {
      step++;
      this.setState({ step });
    } else {
      this.setState({ errorList });
      toggleError();
    }
  }

  prevStep() {
    let { step } = this.state;

    if (step === 3) {
      if (this.state.selectedServicesList.filter(item => item.serviceUnit === "kg").length === 0) step--;
    }

    step--;
    this.setState({ step });
  }

  // #endregion
  // =========================
  //
  // #region 1. Select Customer
  bindCustomer(item) {
    this.setState({
      selectedCustomer: {
        customerId: item.id,
        customerName: item.name,
        customerAddress: item.address,
        customerMobile: item.mobile,
        customerBalance: item.balance
      }
    });
  }
  // #endregion
  // =========================
  //
  // #region 2. Select Service
  bindService(item) {
    this.setState({
      selectedServiceId: item.id,
      selectedServiceName: item.name,
      selectedServiceUnit: item.unit,
      selectedServicePrice: item.price,
      selectedServiceExpress: item.express_price,
      selectedServiceIsActive: item.is_active
    });
  }

  addService(e) {
    e.preventDefault();
    try {
      let {
        selectedServiceId,
        selectedServiceName,
        selectedServiceQuantity,
        selectedServicePrice,
        selectedServiceUnit,
        selectedServiceExpress,
        selectedServiceIsExpress,
        selectedServiceIsActive,
        editIndex,
        selectedServicesList
      } = this.state;

      let errorList = [];

      if (
        !CheckString.test(selectedServiceName || "") &&
        !CheckNumber.test(selectedServiceUnit || "") &&
        !CheckNumber.test(selectedServicePrice || "")
      )
        errorList.push("Harus pilih layanan");
      if (!CheckNumber.test(selectedServiceQuantity || "")) errorList.push("Harus isi quantity");

      if (errorList.length > 0) throw new ValidationError(errorList);

      // Update formula.js
      let selectedService = {
        serviceId: selectedServiceId,
        serviceName: selectedServiceName,
        serviceQuantity: selectedServiceUnit === "kg" && selectedServiceQuantity < 3 ? 3 : Math.ceil(selectedServiceQuantity * 2) / 2,
        serviceUnit: selectedServiceUnit,
        servicePrice: selectedServicePrice,
        serviceExpress: selectedServiceExpress,
        serviceIsExpress: selectedServiceIsExpress,
        serviceIsActive: selectedServiceIsActive
      };

      if (editIndex !== null) {
        selectedServicesList[editIndex] = selectedService;
      } else {
        selectedServicesList.push(selectedService);
      }

      this.clearSelectedService();

      this.setState({ selectedServicesList });
    } catch (err) {
      let errorList = [];
      if (err.response) {
        errorList.push(`${err.response.status} ${err.response.statusText}`);
      } else if (err.request) {
        errorList.push("Request Timeout");
      } else if (err instanceof ValidationError) {
        errorList = err.errorList;
      } else {
        console.log(err);
      }

      this.setState({ errorList });
      toggleError();
    }
  }

  editService(index, selectedItem) {
    this.setState({
      selectedServiceId: selectedItem.serviceId,
      selectedServiceName: selectedItem.serviceName,
      selectedServiceQuantity: selectedItem.serviceQuantity,
      selectedServiceUnit: selectedItem.serviceUnit,
      selectedServicePrice: selectedItem.servicePrice,
      selectedServiceExpress: selectedItem.serviceExpress,
      selectedServiceIsExpress: selectedItem.serviceIsExpress,
      selectedServiceIsActive: selectedItem.serviceIsActive,

      editIndex: index
    });
  }

  deleteService(selectedItem) {
    if (window.confirm("Do you really want to delete?")) {
      let { selectedServicesList } = this.state;
      selectedServicesList = selectedServicesList.filter(item => item !== selectedItem);
      this.setState({ selectedServicesList });
    }
  }

  clearSelectedService(e = null) {
    if (e !== null) e.preventDefault();
    this.setState({
      selectedServiceName: null,
      selectedServiceQuantity: null,
      selectedServiceUnit: null,
      selectedServicePrice: null,
      selectedServiceIsExpress: false,

      editIndex: null
    });
  }
  // #endregion
  // =========================
  //
  // #region 3. Select Item
  bindItemDetail(item) {
    this.setState({
      selectedItemDetailId: item.id,
      selectedItemDetailName: item.name
    });
  }
  // =========================
  //

  addItemDetail(e) {
    e.preventDefault();
    try {
      let { selectedItemDetailId, selectedItemDetailName, selectedItemDetailQuantity, selectedItemDetailList } = this.state;

      let errorList = [];

      if (!CheckString.test(selectedItemDetailName || "")) errorList.push("Harus pilih item");
      if (!CheckNumber.test(selectedItemDetailQuantity || "")) errorList.push("Harus isi quantity");

      if (errorList.length > 0) throw new ValidationError(errorList);

      let selectedItemDetail = {
        itemDetailId: selectedItemDetailId,
        itemDetailName: selectedItemDetailName,
        itemDetailQuantity: selectedItemDetailQuantity
      };
      selectedItemDetailList.push(selectedItemDetail);

      this.setState({ selectedItemDetailId: 0, selectedItemDetailList });

      this.clearSelectedItemDetail();
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
  }

  deleteItemDetail(selectedItem) {
    let { selectedItemDetailList } = this.state;
    selectedItemDetailList = selectedItemDetailList.filter(item => item !== selectedItem);
    this.setState({ selectedItemDetailList });
  }

  clearSelectedItemDetail(e = null) {
    if (e !== null) e.preventDefault();
    this.setState({
      selectedItemDetailName: null,
      selectedItemDetailQuantity: null
    });
  }
  // #endregion
  //
  // =========================
  // #region 4. Transaction Confirmation
  async submitTransaction(e) {
    e.preventDefault();
    this.setState({ isRequesting: true });
    try {
      let {
        invoiceId,
        selectedDateReceived,
        selectedDateFinished,
        selectedCustomer,
        selectedServicesList,
        selectedItemDetailList,
        useDeposit,
        isPaid,
        isComplete,
        discountPrice
      } = this.state;

      let invoiceDate = moment(selectedDateReceived, "YYYY-MM-DD")
        .hours(moment().format("HH"))
        .minutes(moment().format("mm"))
        .seconds(moment().format("ss"))
        .milliseconds(moment().format("SSSS"))
        .format(datetimeFormat);

      let invoiceFinished = moment(selectedDateFinished, "YYYY-MM-DD")
        .hours(moment().format("HH"))
        .minutes(moment().format("mm"))
        .seconds(moment().format("ss"))
        .milliseconds(moment().format("SSSS"))
        .format(datetimeFormat);

      let totalServicesPrice = 0;
      selectedServicesList.forEach(item => {
        totalServicesPrice += item.serviceQuantity * (item.servicePrice + (item.serviceIsExpress ? item.serviceExpress : 0));
      });

      let errorList = [];

      if (Object.keys(selectedCustomer).length === 0) errorList.push("Harus pilih customer");
      if (selectedServicesList.length === 0) errorList.push("Harus pilih layanan");
      if (useDeposit && selectedCustomer.customerBalance < totalServicesPrice) errorList.push("Balance customer tidak mencukupi");

      if (
        selectedServicesList.filter(x => x.serviceIsExpress).length > 0 &&
        selectedServicesList.length !== selectedServicesList.filter(x => x.serviceIsExpress).length
      )
        errorList.push("Service biasa dan express tidak boleh dicampur");

      if (errorList.length > 0) throw new ValidationError(errorList);

      let transactionPost = {
        invoiceDate,
        invoiceFinished,
        customerId: selectedCustomer.customerId,
        useDeposit: useDeposit,
        isPaid: isPaid,
        isComplete: isComplete,
        discountPrice: discountPrice === "" ? null : discountPrice,
        transactionServices: selectedServicesList.map(item => ({
          serviceId: item.serviceId,
          serviceQuantity: item.serviceQuantity,
          serviceIsExpress: item.serviceIsExpress
        })),
        transactionItems: selectedItemDetailList.map(item => ({
          itemId: item.itemDetailId,
          itemQuantity: item.itemDetailQuantity
        }))
      };

      if (invoiceId !== null) {
        await axios.put(`${servicesUrl}/transactions/${invoiceId}`, transactionPost).then(res => res.data);
        toggleSuccess("Transaksi berhasil diupdate");
      } else {
        invoiceId = await axios.post(`${servicesUrl}/transactions`, transactionPost).then(res => res.data);
        toggleSuccess("Transaksi berhasil ditambahkan");
      }
      setTimeout(() => {
        this.props.history.push(`/print/invoice/${invoiceId}`);
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
  // #endregion

  render() {
    // #region Destructure State
    const {
      // Base
      step,
      errorList,
      viewMode,
      invoiceId,
      isLoading,
      isRequesting,
      // =========================
      //
      // 1. Select Customer
      // * Selected Customer
      selectedCustomer,
      // =========================
      //
      // 2. Select Services
      editIndex,
      selectedServicesList,
      // * Selected Service
      selectedServiceName,
      selectedServiceQuantity,
      selectedServiceUnit,
      selectedServicePrice,
      selectedServiceExpress,
      selectedServiceIsExpress,
      // =========================
      //
      // 3. Select Item Detail
      selectedItemDetailId,
      selectedItemDetailName,
      selectedItemDetailQuantity,
      selectedItemDetailList,
      // =========================
      //
      // 4. Transaction Confirmation
      selectedDateReceived,
      selectedDateFinished,
      useDeposit,
      isPaid,
      isComplete,
      discountPrice
    } = this.state;
    // #endregion

    const StepButton = props => {
      return props.viewMode !== 2 ? (
        <div className="field is-grouped is-grouped-right">
          <p className="control">
            <span
              className={step > 0 ? "button is-danger" : "is-invisible"}
              onClick={e => {
                e.preventDefault();
                this.prevStep();
              }}>
              Kembali
            </span>
          </p>
          <p className="control">
            <span
              className={step < 3 ? "button is-primary" : "hidden"}
              onClick={e => {
                e.preventDefault();
                this.nextStep();
              }}>
              Konfirmasi
            </span>
          </p>
        </div>
      ) : (
        <React.Fragment />
      );
    };

    return (
      <React.Fragment>
        <SuccessMessage />
        <ErrorMessage errorList={errorList} />
        <TransactionSteps step={step} />
        {!isComplete ? <StepButton viewMode={viewMode} /> : <React.Fragment />}
        {step === 0 ? (
          <SelectCustomer
            // Base
            viewMode={viewMode}
            // =========================
            //
            // State
            selectedCustomer={selectedCustomer}
            // =========================
            //
            // Func
            bindCustomer={this.bindCustomer}
            handleSelectProps={this.handleSelect}
          />
        ) : step === 1 ? (
          <SelectServices
            // Base
            editIndex={editIndex}
            viewMode={viewMode}
            // =========================
            //
            // State
            selectedServiceName={selectedServiceName}
            selectedServiceQuantity={selectedServiceQuantity}
            selectedServicePrice={selectedServicePrice}
            selectedServiceUnit={selectedServiceUnit}
            selectedServiceExpress={selectedServiceExpress}
            selectedServiceIsExpress={selectedServiceIsExpress}
            selectedServicesList={selectedServicesList}
            // =========================
            //
            // Func
            bindService={this.bindService}
            addService={this.addService}
            editService={this.editService}
            deleteService={this.deleteService}
            clearSelectedService={this.clearSelectedService}
            handleChangeProps={this.handleChange}
          />
        ) : step === 2 ? (
          <SelectItems
            // Base
            selectedItemDetailList={selectedItemDetailList}
            // =========================
            //
            // State
            selectedItemDetailId={selectedItemDetailId}
            selectedItemDetailName={selectedItemDetailName}
            selectedItemDetailQuantity={selectedItemDetailQuantity}
            // =========================
            //
            // Func
            bindItemDetail={this.bindItemDetail}
            addItemDetail={this.addItemDetail}
            deleteItemDetail={this.deleteItemDetail}
            handleChangeProps={this.handleChange}
          />
        ) : step === 3 ? (
          <TransactionConfirmation
            // Base
            viewMode={viewMode}
            isLoadingProps={isLoading}
            invoiceId={invoiceId}
            isRequestingProps={isRequesting}
            discountPrice={discountPrice}
            // =========================
            //
            // State
            selectedDateReceived={selectedDateReceived}
            selectedDateFinished={selectedDateFinished}
            selectedCustomer={selectedCustomer}
            selectedServicesList={selectedServicesList}
            selectedItemDetailList={selectedItemDetailList}
            useDeposit={useDeposit}
            isPaid={isPaid}
            isComplete={isComplete}
            // =========================
            //
            // Func
            submitTransaction={this.submitTransaction}
            handleChangeProps={this.handleChange}
            handleSelectProps={this.handleSelect}
          />
        ) : (
          <React.Fragment />
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    login: state.login.item
  };
};

export default connect(mapStateToProps)(TransactionForm);
