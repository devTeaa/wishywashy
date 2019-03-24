import React, { Component } from "react";
import PropTypes from "prop-types";

import "../../styles/dropdown-search.css";

class DropdownSearch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filterText: null
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  toggleMenu(e) {
    if (e.target.dataset.componentid === "DropdownSearch") {
      if (document.querySelectorAll(".dropdown-menu").length !== 0) document.getElementById("dropdown-menu").classList.toggle("hidden");
      if (document.querySelectorAll("#dropdownInput").length !== 0) document.getElementById("dropdownInput").focus();
    } else if (e.target.dataset.componentid === "DropdownInput") {
    } else {
      if (document.querySelectorAll(".dropdown-menu").length !== 0) {
        document.getElementById("dropdown-menu").classList.remove("hidden");
        document.getElementById("dropdown-menu").classList.add("hidden");
      }
      if (document.querySelectorAll("#dropdownInput").length !== 0) document.getElementById("dropdownInput").focus();
    }
  }

  componentDidMount() {
    document.addEventListener("click", this.toggleMenu);

    let dropdownInput = document.getElementById("dropdownInput");

    dropdownInput.addEventListener(
      "keydown",
      e => {
        if (e.keyCode === 13) {
          e.preventDefault();

          try {
            let firstSpan = document.querySelectorAll(".dropdown-item")[0];
            this.props.handleChangeProps(firstSpan);
            document.getElementById("dropdown-menu").classList.toggle("hidden");
            this.setState({
              [firstSpan.dataset.state]: firstSpan.dataset.value
            });
          } catch {}
        }
      },
      false
    );
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.toggleMenu, true);
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleClick(e) {
    document.getElementById("dropdown-menu").classList.toggle("hidden");
    this.setState({ [e.target.dataset.state]: e.target.dataset.value });
  }

  render() {
    let { filterText } = this.state;
    let { options, stateName, stateValue, handleChangeProps } = this.props;

    let dropdownItems = [];

    options.forEach((item, index) => {
      dropdownItems.push({
        name: item.name,
        value: item.value,
        indexOf: index
      });
    });

    let filterRegex = new RegExp(`${filterText || ""}`, "i");
    dropdownItems = dropdownItems.filter(item => filterRegex.test(item.name));

    return (
      <div data-componentid="DropdownSearch" className="dropdown is-active">
        <div data-componentid="DropdownSearch" className="dropdown-trigger">
          <span data-componentid="DropdownSearch" className="button is-fullwidth has-text-left" aria-haspopup="false" aria-controls="dropdown-menu">
            <span data-componentid="DropdownSearch">{stateValue || "Silakan pilih"}</span>
            <span data-componentid="DropdownSearch" className="icon is-small">
              <i data-componentid="DropdownSearch" className="fas fa-angle-down" aria-hidden="true" />
            </span>
          </span>
        </div>
        <div data-componentid="DropdownSearch" className="dropdown-menu hidden" id="dropdown-menu" role="menu">
          <div data-componentid="DropdownSearch" className="dropdown-content">
            <input
              id="dropdownInput"
              data-componentid="DropdownInput"
              type="text"
              name="filterText"
              className="input dropdown-search"
              onChange={this.handleChange}
              value={filterText || ""}
            />
            <hr className="dropdown-divider" />
            {dropdownItems.map((item, index) => (
              <span
                className="dropdown-item"
                key={index}
                data-state="selectedValue"
                data-name={stateName}
                data-index={item.indexOf}
                data-value={item.value}
                onClick={e => {
                  handleChangeProps(e.target);
                  this.handleClick(e);
                }}>
                {item.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

DropdownSearch.propTypes = {
  options: PropTypes.array.isRequired,
  stateName: PropTypes.string.isRequired,
  stateValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  handleChangeProps: PropTypes.func.isRequired
};

export default DropdownSearch;
