import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { fetchLogout } from "../../actions/loginActions";

class Header extends Component {
  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentDidMount() {
    document.querySelector(".navbar-burger").addEventListener("click", e => {
      e.target.classList.toggle("is-active");
      document.querySelector(".navbar-menu").classList.toggle("is-active");
    });
    let links = document.querySelectorAll(".navbar-item");
    links.forEach(link =>
      link.addEventListener("click", () => {
        document.querySelector(".navbar-burger").classList.remove("is-active");
        document.querySelector(".navbar-menu").classList.remove("is-active");
      })
    );
  }

  async handleLogout() {
    document.cookie = "login_state=; expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/";
    window.location.reload();
  }

  render() {
    const { admin } = this.props;
    return (
      <nav className="navbar is-dark" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <Link className="navbar-item" to={"/"}>
            <img src="https://bulma.io/images/bulma-logo-white.png" alt="company logo" width="112" height="28" />
          </Link>

          <span
            id="menuButton"
            role="button"
            className="navbar-burger"
            aria-label="menu"
            aria-expanded="false"
            data-target="navMenu"
            onClick={this.toggleMenu}>
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </span>
        </div>

        <div id="navMenu" className="navbar-menu">
          <div className="navbar-start">
            <Link className="navbar-item" to={"/customers"}>
              Pelanggan
            </Link>
            <Link className="navbar-item" to={"/transactions"}>
              Transaksi
            </Link>
            <Link className="navbar-item" to={"/services"} onClick={this.toggleMenu}>
              Layanan
            </Link>
            {admin === 1 ? (
              <React.Fragment>
                <Link className="navbar-item" to={"/deposits"} onClick={this.toggleMenu}>
                  Paket Deposit
                </Link>
                <Link className="navbar-item" to={"/items"} onClick={this.toggleMenu}>
                  Items
                </Link>
                <Link className="navbar-item" to={"/report/transactions"} onClick={this.toggleMenu}>
                  Report
                </Link>
              </React.Fragment>
            ) : (
              <React.Fragment />
            )}
          </div>
          <div className="navbar-end">
            <div className="navbar-item">
              <span className="button is-danger" onClick={this.handleLogout}>
                Logout
              </span>
            </div>
          </div>
        </div>
      </nav>
    );
  }
}

Header.propTypes = {
  admin: PropTypes.number.isRequired
};

export default connect(
  null,
  { fetchLogout }
)(Header);
