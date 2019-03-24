import React from "react";
import PropTypes from "prop-types";

import DetailService from "./DetailService";
import SelectServicesTable from "./SelectServicesTable";

const SelectServices = props => {
  let {
    // Base
    editIndex,
    viewMode,
    // =========================
    //
    // State
    serviceList,
    selectedServiceName,
    selectedServiceQuantity,
    selectedServiceUnit,
    selectedServicePrice,
    selectedServiceExpress,
    selectedServiceIsExpress,
    selectedServicesList,
    // =========================
    //
    // Func
    bindService,
    addService,
    editService,
    deleteService,
    clearSelectedService,
    handleChangeProps
  } = props;

  return (
    <div className="columns is-desktop">
      <div className={viewMode !== 0 ? "hidden" : "column"}>
        <form className="form" autoComplete="off">
          <DetailService
            editIndex={editIndex}
            serviceList={serviceList}
            // =========================
            //
            // Selected Service
            selectedServiceName={selectedServiceName}
            selectedServiceQuantity={selectedServiceQuantity}
            selectedServicePrice={selectedServicePrice}
            selectedServiceUnit={selectedServiceUnit}
            selectedServiceExpress={selectedServiceExpress}
            selectedServiceIsExpress={selectedServiceIsExpress}
            // =========================
            //
            // Funct
            bindService={bindService}
            addService={addService}
            clearSelectedService={clearSelectedService}
            handleChangeProps={handleChangeProps}
          />
        </form>
      </div>
      <div className="column">
        <SelectServicesTable
          selectedServicesList={selectedServicesList}
          editService={editService}
          deleteService={deleteService}
          viewMode={viewMode}
        />
      </div>
    </div>
  );
};

SelectServices.propTypes = {
  // Selected Service to edit state
  editIndex: PropTypes.number,
  // Form view viewMode
  // 0 = isFull
  // 1 = isEdit
  // 2 = isView
  viewMode: PropTypes.number.isRequired,
  // Selected Service details
  selectedServiceName: PropTypes.string,
  selectedServiceQuantity: PropTypes.number,
  selectedServiceUnit: PropTypes.string,
  selectedServicePrice: PropTypes.number,
  selectedServiceExpress: PropTypes.number,
  selectedServiceIsExpress: PropTypes.bool.isRequired,
  selectedServicesList: PropTypes.array.isRequired,
  // Bind service
  bindService: PropTypes.func.isRequired,
  // Add service
  addService: PropTypes.func.isRequired,
  // Edit service and set editIndex
  editService: PropTypes.func.isRequired,
  // Delete service base on editIndex,
  deleteService: PropTypes.func.isRequired,
  // Clear Selected Service details and editIndex
  clearSelectedService: PropTypes.func.isRequired,
  // Form handle change
  handleChangeProps: PropTypes.func.isRequired
};

export default SelectServices;
