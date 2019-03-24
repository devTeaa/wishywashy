import React from "react";
import PropTypes from "prop-types";
import numeral from "numeral";

import Loading from "../../common/Loading";

const SelectCustomerTable = props => {
  let {
    // Base
    isLoading,
    // =========================
    //
    // State
    customerList,
    // =========================
    //
    // Func
    bindCustomer
  } = props;

  return (
    <div className="scrollable-table-div">
      <table className={isLoading ? "table is-fullwidth m-t-1" : "table is-fullwidth is-hoverable m-t-1"}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nama</th>
            <th>Alamat</th>
            <th>No HP</th>
            <th>Balance</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan="5">
                <Loading />
              </td>
            </tr>
          ) : customerList.length === 0 ? (
            <tr>
              <td colSpan="5">No data available</td>
            </tr>
          ) : (
            customerList.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.address}</td>
                <td>{item.mobile}</td>
                <td>{numeral(item.balance).format("0,0")}</td>
                <td>
                  <button
                    className="button is-primary"
                    onClick={() => {
                      bindCustomer(item);
                    }}>
                    Pilih
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

SelectCustomerTable.propTypes = {
  // Base
  isLoading: PropTypes.bool.isRequired,
  // Customer list
  customerList: PropTypes.array.isRequired,
  // Bind customer
  bindCustomer: PropTypes.func.isRequired
};

export default SelectCustomerTable;
