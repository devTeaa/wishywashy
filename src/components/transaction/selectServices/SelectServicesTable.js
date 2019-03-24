import React from "react";
import PropTypes from "prop-types";

import { calculateService } from "../../../formula";

const SelectServicesTable = props => {
  let {
    // Base
    viewMode,
    // =========================
    // State
    selectedServicesList,
    // =========================
    //
    // Func
    editService,
    deleteService
  } = props;

  return (
    <table className="table is-hoverable is-fullwidth has-actions">
      <thead>
        <tr>
          <th>Layanan</th>
          <th>Qty</th>
          <th>Unit</th>
          <th>Total</th>
          <th>Express</th>
          {viewMode === 0 ? <th /> : <React.Fragment />}
        </tr>
      </thead>
      <tbody>
        {selectedServicesList.map((item, index) => (
          <tr key={index}>
            <td>{item.serviceName}</td>
            <td>{item.serviceQuantity}</td>
            <td>{item.serviceUnit}</td>
            <td>{calculateService(item.serviceQuantity, item.serviceUnit, item.servicePrice, item.serviceIsExpress, item.serviceExpress)}</td>
            <td>{item.serviceIsExpress ? <span className="tag is-primary">Express</span> : ""}</td>
            {viewMode === 0 ? (
              <td className="has-text-right">
                {item.serviceIsActive === true ? (
                  <button className="button is-info m-r-1" onClick={() => editService(index, item)}>
                    <i className="fas fa-pencil-alt" />
                  </button>
                ) : (
                  <React.Fragment />
                )}
                <button className="button is-danger" onClick={() => deleteService(item)}>
                  <i className="fas fa-times" />
                </button>
              </td>
            ) : (
              <React.Fragment />
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

SelectServicesTable.propTypes = {
  // Form view viewMode
  // 1 = isNew
  // 2 = isEdit
  // 3 = isView
  viewMode: PropTypes.number.isRequired,
  // Selected service list
  selectedServicesList: PropTypes.array.isRequired,
  // =========================
  //
  // Func
  editService: PropTypes.func.isRequired,
  deleteService: PropTypes.func.isRequired
};

export default SelectServicesTable;
