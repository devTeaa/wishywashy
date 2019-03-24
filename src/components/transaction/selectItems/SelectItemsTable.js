import React from "react";
import PropTypes from "prop-types";

const SelectItemsTable = props => {
  let {
    // State
    selectedItemDetailList,
    // =========================
    //
    // Func
    deleteItemDetail
  } = props;

  return (
    <table className="table is-fullwidth is-striped has-actions">
      <thead>
        <tr>
          <th>Nama Item</th>
          <th>Jumlah</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        {selectedItemDetailList.map((item, index) => (
          <tr key={index}>
            <td>{item.itemDetailName}</td>
            <td>{item.itemDetailQuantity}</td>
            <td className="has-text-right">
              <button className="button is-danger" onClick={() => deleteItemDetail(item)}>
                <i className="fas fa-times" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

SelectItemsTable.propTypes = {
  // State
  selectedItemDetailList: PropTypes.array.isRequired,
  // =========================
  //
  // Func
  deleteItemDetail: PropTypes.func.isRequired
};

export default SelectItemsTable;
