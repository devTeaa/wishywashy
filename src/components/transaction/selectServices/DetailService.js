import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import numeral from "numeral";

import servicesUrl from "../../../config";
import { calculateService } from "../../../formula";

import "bulma-extensions/bulma-switch/dist/css/bulma-switch.min.css";

import DropdownSearch from "../../common/DropdownSearch";

class DetailService extends Component {
  constructor(props) {
    super(props);

    this.state = {
      serviceList: []
    };

    this.handleSelect = this.handleSelect.bind(this);
  }

  async componentDidMount() {
    let { serviceList } = this.state;
    const data = await axios.get(`${servicesUrl}/services`).then(res => res.data);
    data.forEach(item => {
      serviceList.push(item);
    });
    this.setState({ serviceList });
  }

  handleSelect(e) {
    this.setState({ [e.dataset.name]: e.dataset.value });
    if (e.dataset.name === "selectedServiceName" && e.dataset.value !== "") {
      let { bindService } = this.props;
      let { serviceList } = this.state;

      let selectedService = serviceList[e.dataset.index];
      bindService(selectedService);
    }
  }

  render() {
    let {
      // Base
      editIndex,
      // =========================
      //
      // State
      selectedServiceName,
      selectedServiceQuantity,
      selectedServiceUnit,
      selectedServicePrice,
      selectedServiceExpress,
      selectedServiceIsExpress,
      // =========================
      //
      // Func
      addService,
      clearSelectedService,
      handleChangeProps
    } = this.props;

    let { serviceList } = this.state;

    let serviceListName = serviceList.map(item => ({ name: item.name, value: item.name }));
    console.log(selectedServiceExpress);

    return (
      <React.Fragment>
        <div className="field is-horizontal">
          <div className="field-label is-normal">
            <label className="label">Layanan</label>
          </div>
          <div className="field-body">
            <div className="field">
              <DropdownSearch
                options={serviceListName}
                stateName={"selectedServiceName"}
                stateValue={selectedServiceName}
                handleChangeProps={this.handleSelect}
              />
            </div>
            <div className="field has-addons">
              <div className="control">
                <input
                  type="number"
                  className="input"
                  name="selectedServiceQuantity"
                  placeholder="Qty..."
                  onChange={handleChangeProps}
                  value={selectedServiceQuantity || ""}
                />
              </div>
              <div className="control">
                <span className="button is-static">{selectedServiceUnit || "?"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="field is-horizontal">
          <div className="field-label is-expanded" />
          <div className="field-body">
            <div className="field has-addons">
              <p className="control">
                <input
                  type="text"
                  className="input"
                  tabIndex="-1"
                  placeholder="Harga @..."
                  value={selectedServicePrice ? numeral(selectedServicePrice).format("0,0") : ""}
                  disabled
                  readOnly
                />
              </p>
              <p className="control">
                <span className="button is-static">@</span>
              </p>
            </div>
          </div>
        </div>

        {selectedServiceIsExpress ? (
          <div className="field is-horizontal">
            <div className="field-label is-expanded" />
            <div className="field-body">
              <div className="field has-addons">
                <p className="control">
                  <input
                    type="text"
                    className="input"
                    tabIndex="-1"
                    placeholder="Harga express..."
                    value={selectedServiceExpress ? numeral(selectedServiceExpress).format("0,0") : ""}
                    disabled
                    readOnly
                  />
                </p>
                <p className="control">
                  <span className="button is-static">Express</span>
                </p>
              </div>
            </div>
          </div>
        ) : (
          <React.Fragment />
        )}

        <div className="field is-horizontal">
          <div className="field-label is-normal">
            <label className="label">Total Harga</label>
          </div>
          <div className="field-body">
            <div className="field">
              <p className="control">
                <input
                  type="text"
                  className="input"
                  tabIndex="-1"
                  placeholder="Total harga..."
                  value={
                    selectedServiceQuantity === "" || selectedServiceQuantity === null
                      ? ""
                      : calculateService(
                          selectedServiceQuantity,
                          selectedServiceUnit,
                          selectedServicePrice,
                          selectedServiceIsExpress,
                          selectedServiceExpress
                        )
                  }
                  disabled
                  readOnly
                />
              </p>
            </div>
            <div className="field">
              <div className="control" />
            </div>
          </div>
        </div>

        {selectedServiceExpress !== -1 ? (
          <div className="field is-horizontal">
            <div className="field-label is-normal" />
            <div className="field-body">
              <div className="field">
                <p className="control">
                  <label className="checkbox">
                    <input
                      id="selectedServiceIsExpress"
                      name="selectedServiceIsExpress"
                      type="checkbox"
                      className="switch is-rounded"
                      onChange={handleChangeProps}
                      checked={selectedServiceIsExpress}
                    />
                    <label htmlFor="selectedServiceIsExpress">Express</label>
                  </label>
                </p>
              </div>
            </div>
          </div>
        ) : (
          <React.Fragment />
        )}

        <div className="field is-horizontal">
          <div className="field-label is-normal" />
          <div className="field-body">
            <div className="field is-grouped">
              <p className="control">
                <button className="button is-primary" onClick={e => addService(e)}>
                  {editIndex !== null ? "Update" : "Tambah"}
                </button>
              </p>
              <p className="control">
                <button className={editIndex === null ? "button" : "button is-danger"} onClick={e => clearSelectedService(e)}>
                  {editIndex === null ? "Clear" : "Cancel"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

DetailService.propTypes = {
  // Selected Service to edit state
  editIndex: PropTypes.number,
  // Selected Service details
  selectedServiceName: PropTypes.string,
  selectedServiceQuantity: PropTypes.number,
  selectedServiceUnit: PropTypes.string,
  selectedServicePrice: PropTypes.number,
  selectedServiceExpress: PropTypes.number,
  selectedServiceIsExpress: PropTypes.bool,
  selectedServicesList: PropTypes.array,
  // Bind service
  bindService: PropTypes.func.isRequired,
  // Add service
  addService: PropTypes.func.isRequired,
  // Clear Selected Service details and editIndex
  clearSelectedService: PropTypes.func.isRequired,
  // Form handle change and select
  handleChangeProps: PropTypes.func.isRequired
};

export default DetailService;
