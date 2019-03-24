import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";

import servicesUrl from "../../../config";
import SelectItemsTable from "./SelectItemsTable";

import DropdownSearch from "../../common/DropdownSearch";

class SelectItems extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      itemList: []
    };

    this.handleSelect = this.handleSelect.bind(this);
  }

  async componentDidMount() {
    this.setState({ isLoading: true });

    let itemList = await axios.get(`${servicesUrl}/items`).then(res => res.data);
    this.setState({ isLoading: false, itemList: [...itemList] });
  }

  handleSelect(e) {
    if (e.dataset.name === "selectedItemDetailName" && e.dataset.value !== "") {
      let { bindItemDetail } = this.props;
      let { itemList } = this.state;
      let selectedItem = itemList[e.dataset.index];
      bindItemDetail(selectedItem);
    }
  }

  render() {
    let {
      // Base
      selectedItemDetailList,
      // =========================
      //
      // State
      selectedItemDetailName,
      selectedItemDetailQuantity,
      // =========================
      //
      // Funct
      addItemDetail,
      deleteItemDetail,
      handleChangeProps
    } = this.props;

    let { itemList } = this.state;

    let itemListName = itemList.map(item => ({ name: item.name, value: item.name }));

    return (
      <React.Fragment>
        <div className="columns">
          <div className="column">
            <form className="form" onSubmit={addItemDetail} autoComplete="off">
              <div className="field is-horizontal">
                <div className="field-label is-normal">
                  <label className="label">Detail Item</label>
                </div>
                <div className="field-body">
                  <div className="field has-addons">
                    <div className="control">
                      <DropdownSearch
                        options={itemListName}
                        stateName={"selectedItemDetailName"}
                        stateValue={selectedItemDetailName}
                        handleChangeProps={this.handleSelect}
                      />
                      {/* <span className={isLoading ? "select is-loading" : "select"}>
                        <select id="ddlItemDetailName" name="selectedItemDetailId" value={selectedItemDetailId || ""} onChange={this.handleSelect}>
                          {itemList.map((item, index) => (
                            <option key={index} value={item.id} data-index={index}>
                              {item.name || "Pilih Layanan"}
                            </option>
                          ))}
                        </select>
                      </span> */}
                    </div>
                    <p className="control">
                      <input
                        type="number"
                        className="input"
                        name="selectedItemDetailQuantity"
                        placeholder="Jumlah..."
                        value={selectedItemDetailQuantity || ""}
                        onChange={handleChangeProps}
                      />
                    </p>
                    <p className="control">
                      <button className="button is-primary">Tambah</button>
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="columns">
          <div className="column">
            <SelectItemsTable selectedItemDetailList={selectedItemDetailList} deleteItemDetail={deleteItemDetail} />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

SelectItems.propTypes = {
  // State
  selectedItemDetailId: PropTypes.number,
  selectedItemDetailName: PropTypes.string,
  selectedItemDetailQuantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  // Selected Item Detail List
  selectedItemDetailList: PropTypes.array.isRequired,
  // Bind item detail
  bindItemDetail: PropTypes.func.isRequired,
  // Add new item detail
  addItemDetail: PropTypes.func.isRequired,
  // Delete item detail
  deleteItemDetail: PropTypes.func.isRequired,
  // Form handle change
  handleChangeProps: PropTypes.func.isRequired
};

export default SelectItems;
