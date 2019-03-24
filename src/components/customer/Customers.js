import React from "react";
import { Link } from "react-router-dom";

import CustomerTable from "./CustomerTable";

const Customers = () => {
  return (
    <React.Fragment>
      <div className="columns">
        <div className="column is-narrow">
          <Link to={"/customers/add"} className="button is-primary">
            Tambah Customer
          </Link>
        </div>
      </div>
      <CustomerTable />
    </React.Fragment>
  );
};

export default Customers;
