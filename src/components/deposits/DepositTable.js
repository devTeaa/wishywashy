import React from "react";
import PropTypes from "prop-types";
import numeral from "numeral";

import Loading from "../common/Loading";

const DepositTable = props => {
  let { isLoading, depositList, bindDeposit } = props;

  return (
    <div className={isLoading ? "" : "scrollable-table-div"}>
      <table className={isLoading ? "table has-actions" : "table is-hoverable has-actions"}>
        <thead>
          <tr>
            <th>Deposit</th>
            <th>Harga</th>
            <th>Nilai</th>
            <th>Durasi</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {depositList.length === 0 ? (
            <tr>
              <td colSpan="5">{isLoading ? <Loading /> : "No data available"}</td>
            </tr>
          ) : (
            depositList.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{numeral(item.price).format("0,0")}</td>
                <td>{numeral(item.amount).format("0,0")}</td>
                <td>{item.duration ? `${item.duration} hari` : "No duration"}</td>
                <td className="has-text-right">
                  <button className="button is-info m-r-1" onClick={() => bindDeposit(item)}>
                    <i className="fas fa-pencil-alt" />
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

DepositTable.propTypes = {
  // Base
  isLoading: PropTypes.bool.isRequired,
  // =========================
  //
  // State
  depositList: PropTypes.array.isRequired,
  // =========================
  //
  // Func
  bindDeposit: PropTypes.func.isRequired
};

export default DepositTable;
