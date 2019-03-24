import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import "../styles/home.css";
import { IconUsers, IconWashingMachine, IconWallet, IconPriceTag, IconFashion, IconReport } from "../images/HomeIcons";

const Home = props => {
  return (
    <div className="grid-home">
      <div className="card card-blue card-no-border">
        <div className="card-content has-text-centered">
          <Link className="title" to={"/customers"}>
            <IconUsers s="6rem" />
          </Link>
        </div>
        <footer className="card-footer">
          <div className="card-footer-item">
            <Link to={"/customers"}>Pelanggan</Link>
          </div>
          <div className="card-footer-item">
            <Link to={"/customers/add"}>Tambah baru</Link>
          </div>
        </footer>
      </div>

      <div className="card card-yellow card-no-border">
        <div className="card-content has-text-centered">
          <Link className="title" to={"/transactions"}>
            <IconWashingMachine s="5rem" />
          </Link>
        </div>
        <footer className="card-footer">
          <div className="card-footer-item">
            <Link to={"/transactions"}>Transaksi</Link>
          </div>
          <div className="card-footer-item">
            <Link to={"/transactions/add"}>Tambah Baru</Link>
          </div>
        </footer>
      </div>
      <div className="card card-green card-no-border">
        <div className="card-content has-text-centered">
          <Link className="title" to={"/services"}>
            <IconPriceTag s="5rem" />
          </Link>
        </div>
        <footer className="card-footer">
          <div className="card-footer-item">
            <Link to={"/services"}>Jenis layanan</Link>
          </div>
        </footer>
      </div>
      {props.login === 1 ? (
        <React.Fragment>
          <div className="card card-red card-no-border">
            <div className="card-content has-text-centered">
              <Link className="title" to={"/deposits"}>
                <IconWallet s="5rem" />
              </Link>
            </div>
            <footer className="card-footer">
              <div className="card-footer-item">
                <Link to={"/deposits"}>List Paket Deposit</Link>
              </div>
            </footer>
          </div>

          <div className="card card-turqoise card-no-border">
            <div className="card-content has-text-centered">
              <Link className="title" to={"/items"}>
                <IconFashion s="5rem" />
              </Link>
            </div>
            <footer className="card-footer">
              <div className="card-footer-item">
                <Link to={"/items"}>Items</Link>
              </div>
            </footer>
          </div>

          <div className="card card-violet card-no-border">
            <div className="card-content has-text-centered">
              <Link className="title" to={"/items"}>
                <IconReport s="5rem" />
              </Link>
            </div>
            <footer className="card-footer">
              <div className="card-footer-item">
                <Link to={"/report/transactions"}>Reports</Link>
              </div>
            </footer>
          </div>
        </React.Fragment>
      ) : (
        <React.Fragment />
      )}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    login: state.login.item
  };
};

export default connect(mapStateToProps)(Home);
