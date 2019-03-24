import React from "react";
import PropTypes from "prop-types";

import Loading from "../common/Loading";

const ItemTable = props => {
  let { isLoading, itemList, deleteItem } = props;

  return (
    <div className={isLoading ? "" : "scrollable-table-div"}>
      <table className={isLoading ? "table has-actions is-scrollable-y m-t-2" : "table is-hoverable has-actions is-scrollable-y m-t-2"}>
        <thead>
          <tr>
            <th>Item</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {itemList.length === 0 ? (
            <tr>
              <td colSpan="2">{isLoading ? <Loading /> : "No data available"}</td>
            </tr>
          ) : (
            itemList.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td className="has-text-right">
                  <button className="button is-danger m-r-1" onClick={() => deleteItem(item)}>
                    <i className="fas fa-times" />
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

ItemTable.propTypes = {
  // Base
  isLoading: PropTypes.bool.isRequired,
  // =========================
  //
  // State
  itemList: PropTypes.array.isRequired,
  // =========================
  //
  // Func
  deleteItem: PropTypes.func.isRequired
};

export default ItemTable;
