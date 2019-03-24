import React from "react";
import PropTypes from "prop-types";
import numeral from "numeral";

const DepositForm = props => {
  let {
    // State
    depositName,
    depositPrice,
    depositAmount,
    depositDuration,
    // =========================
    //
    // Func
    handleChange,
    submitDeposit
  } = props;

  return (
    <form onSubmit={submitDeposit}>
      <button className="hidden" onClick={submitDeposit} />
      <div className="field is-horizontal">
        <div className="field-label is-normal">
          <label className="label">Deposit</label>
        </div>
        <div className="field-body">
          <input type="text" className="input" name="depositName" placeholder="Nama deposit..." onChange={handleChange} value={depositName || ""} />
        </div>
      </div>
      <div className="field is-horizontal">
        <div className="field-label is-normal">
          <label className="label">Harga</label>
        </div>
        <div className="field-body">
          <div className="field has-addons">
            <p className="control">
              <span className="button is-static">Rp</span>
            </p>
            <p className="control is-expanded">
              <input
                type="text"
                className="input"
                name="depositPrice"
                placeholder="Jumlah yang dibayar..."
                onChange={handleChange}
                value={depositPrice ? numeral(depositPrice).format("0,0") : ""}
              />
            </p>
          </div>
        </div>
      </div>
      <div className="field is-horizontal">
        <div className="field-label is-normal">
          <label className="label">Nilai</label>
        </div>
        <div className="field-body">
          <div className="field has-addons">
            <p className="control">
              <span className="button is-static">+</span>
            </p>
            <p className="control is-expanded">
              <input
                type="text"
                className="input"
                name="depositAmount"
                placeholder="Jumlah yang diterima..."
                onChange={handleChange}
                value={depositAmount ? numeral(depositAmount).format("0,0") : ""}
              />
            </p>
          </div>
        </div>
      </div>
      <div className="field is-horizontal">
        <div className="field-label is-normal">
          <label className="label">Durasi</label>
        </div>
        <div className="field-body">
          <div className="field has-addons">
            <p className="control is-expanded">
              <input
                type="text"
                className="input"
                name="depositDuration"
                placeholder="Masa durasi deposit sebelum expire..."
                onChange={handleChange}
                value={depositDuration ? numeral(depositDuration).format("0") : ""}
              />
            </p>
            <p className="control">
              <span className="button is-static">hari</span>
            </p>
          </div>
        </div>
      </div>
    </form>
  );
};

DepositForm.propTypes = {
  // State
  depositName: PropTypes.string,
  depositPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  depositAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  depositDuration: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  // =========================
  //
  // Func
  handleChange: PropTypes.func.isRequired,
  submitDeposit: PropTypes.func.isRequired
};

export default DepositForm;
