import React, { Component } from "react";
import { Link } from "react-router-dom";

import TransactionTable from "./TransactionTable";

class Transactions extends Component {
  constructor() {
    super();

    this.state = {
      // Table mode
      // 0 = regular search and view details
      // 1 = edit isPaid and isComplete in batch
      tableMode: 0
    };

    this.toggleEditTable = this.toggleEditTable.bind(this);
  }

  toggleEditTable() {
    let { tableMode } = this.state;

    if (tableMode === 0) {
      this.setState({ tableMode: 1 });
    } else {
      this.setState({ tableMode: 0 });
    }
  }

  render() {
    let { tableMode } = this.state;

    return (
      <React.Fragment>
        <div className="flex flex-align-end m-b-2">
          <div className="flex flex-justify-self-start">
            <Link to={"/transactions/add"} className="button is-primary">
              Tambah Transaksi
            </Link>
          </div>
          <div>
            <button className={tableMode === 0 ? "button is-info" : "button is-danger"} onClick={this.toggleEditTable}>
              {tableMode === 0 ? "Edit in batch" : "Keluar Edit"}
            </button>
          </div>
        </div>
        <TransactionTable tableMode={tableMode} />
      </React.Fragment>
    );
  }
}

export default Transactions;
