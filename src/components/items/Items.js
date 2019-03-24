import React, { Component } from "react";
import axios from "axios";

import { CheckString } from "../common/Regex";
import { ValidationError } from "../common/Error";

import { ErrorMessage, toggleError, SuccessMessage, toggleSuccess } from "../common/Message";

import ItemForm from "./ItemForm";
import ItemTable from "./ItemTable";
import servicesUrl from "../../config";

class Items extends Component {
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
      itemName: null,
      itemList: []
    };

    this.handleChange = this.handleChange.bind(this);

    this.submitItem = this.submitItem.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.clearItem = this.clearItem.bind(this);
  }

  componentDidMount() {
    this.fetchItems();
  }

  // #region Base func
  handleChange(e) {
    if (e.target.type === "checkbox") {
      this.setState({ [e.target.name]: e.target.checked });
    } else if (e.target.type === "number") {
      this.setState({ [e.target.name]: parseInt(e.target.value) });
    } else {
      this.setState({ [e.target.name]: e.target.value });
    }
  }

  async fetchItems() {
    this.setState({ itemList: [], isLoading: true });
    try {
      const data = await axios.get(`${servicesUrl}/items`).then(res => res.data);
      this.setState({ itemList: data });
    } catch (err) {
      console.log(err);
    }
    this.setState({ isLoading: false });
  }

  async submitItem(e) {
    e.preventDefault();
    this.setState({ isRequesting: true });
    try {
      let { itemId, itemName } = this.state;

      let errorList = [];

      if (!CheckString.test(itemName || "")) errorList.push("Item harus diisi");

      if (errorList.length > 0) throw new ValidationError(errorList);

      let itemPost = {
        id: itemId,
        name: itemName
      };

      if (itemId !== null && itemId !== undefined) {
        await axios.put(`${servicesUrl}/items/${itemId}`, itemPost);
        toggleSuccess("Item berhasil diubah");
      } else {
        await axios.post(`${servicesUrl}/items`, itemPost);
        toggleSuccess("Item berhasil ditambahkan");
      }

      this.fetchItems();
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
    this.setState({ isRequesting: false });
  }

  async deleteItem(item) {
    this.setState({ isRequesting: true });
    try {
      if (window.confirm(`Anda yakin ingin menghapus ${item.name}?`)) {
        if (item.id !== undefined || item.id !== 0) {
          await axios.delete(`${servicesUrl}/items/${item.id}`);
          toggleSuccess("Item berhasil dihapus");
        } else {
          throw new ErrorMessage("Select item first");
        }
        this.fetchItems();
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

  clearItem() {
    this.setState({ itemName: "" });
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
      itemName,
      itemList
    } = this.state;

    return (
      <React.Fragment>
        <SuccessMessage />
        <ErrorMessage errorList={errorList} />
        <div className="columns is-desktop">
          <div className="column">
            <ItemForm
              // Base
              isRequesting={isRequesting}
              // =========================
              //
              // State
              itemName={itemName}
              // =========================
              //
              // Func
              handleChange={this.handleChange}
              submitItem={this.submitItem}
            />
          </div>
          <div className="column">
            <ItemTable isLoading={isLoading} itemList={itemList} deleteItem={this.deleteItem} />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Items;
