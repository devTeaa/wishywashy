import React from "react";
import PropTypes from "prop-types";

const ItemForm = props => {
  let {
    // Base
    isRequesting,
    // =========================
    //
    // State
    itemName,
    // =========================
    //
    // Func
    handleChange,
    submitItem
  } = props;

  return (
    <form onSubmit={submitItem}>
      <div className="flex flex-justify-end m-b-2">
        <p className="control">
          <button
            className={isRequesting ? "button is-primary is-loading m-r-1" : "button is-primary m-r-1"}
            onClick={submitItem}
            disabled={isRequesting}>
            Tambah
          </button>
        </p>
      </div>
      <div className="field is-horizontal">
        <div className="field-label is-normal">
          <label className="label">Nama</label>
        </div>
        <div className="field-body">
          <input type="text" className="input" name="itemName" placeholder="Kemeja, celana..." onChange={handleChange} value={itemName || ""} />
        </div>
      </div>
    </form>
  );
};

ItemForm.propTypes = {
  // Base
  isRequesting: PropTypes.bool.isRequired,
  // =========================
  //
  // State
  itemName: PropTypes.string,
  // =========================
  //
  // Func
  handleChange: PropTypes.func.isRequired,
  submitItem: PropTypes.func.isRequired
};

export default ItemForm;
