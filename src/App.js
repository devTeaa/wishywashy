import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";

// CSS
import "@fortawesome/fontawesome-free/css/all.css";
import "./styles/variables.css";
import "./sass/modified-bulma.scss";
import "./styles/base.css";

// Components
import Header from "./components/common/Header";

// Routes
import Login from "./components/Login";
import Home from "./components/Home";
import Customers from "./components/customer/Customers";
import CustomerForm from "./components/customer/CustomerForm";
import PrintDeposit from "./components/customer/PrintDeposit";
import Transactions from "./components/transaction/Transactions";
import TransactionForm from "./components/transaction/TransactionForm";
import PrintTransaction from "./components/transaction/PrintTransaction";
import ReportTransaction from "./components/reports/ReportTransaction";
import ReportChart from "./components/reports/ReportChart";
import Deposits from "./components/deposits/Deposits";
import Services from "./components/services/Services";
import Items from "./components/items/Items";

import NotFound from "./components/errors/NotFound";
import UserNotAuthenticated from "./components/errors/UserNotAuthenticated";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        {this.props.login === 0 ? (
          <Route path="/" component={Login} />
        ) : (
          <React.Fragment>
            <Header admin={this.props.login} />
            <div className="section">
              <div className="container">
                <Switch>
                  <Route path="/" exact component={Home} />
                  <Route path="/customers" exact component={Customers} />
                  <Route path="/customers/add" exact component={CustomerForm} />
                  <Route path="/customers/:id" component={CustomerForm} />
                  <Route path="/print/deposit/:id/:customer" component={PrintDeposit} />
                  <Route path="/transactions" exact component={Transactions} />
                  <Route path="/transactions/add" exact component={TransactionForm} />
                  <Route path="/transactions/:id" exact component={TransactionForm} />
                  <Route path="/print/invoice/:id" exact component={PrintTransaction} />
                  <Route path="/deposits" exact component={this.props.login === 1 ? Deposits : UserNotAuthenticated} />
                  <Route path="/services" exact component={Services} />
                  <Route path="/items" exact component={this.props.login === 1 ? Items : UserNotAuthenticated} />
                  <Route path="/report/transactions" exact component={this.props.login === 1 ? ReportTransaction : UserNotAuthenticated} />
                  <Route path="/charts" exact component={this.props.login === 1 ? ReportChart : UserNotAuthenticated} />
                  <Route component={NotFound} />
                </Switch>
              </div>
            </div>
          </React.Fragment>
        )}
      </BrowserRouter>
    );
  }
}

const mapStateToProps = state => {
  return {
    login: state.login.item
  };
};

export default connect(mapStateToProps)(App);
