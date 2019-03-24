import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchLogin, setLogin } from "../actions/loginActions";

class Login extends Component {
  constructor() {
    super();

    this.state = {
      isLoading: false,
      username: null,
      password: null,
      error: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  componentDidMount() {
    this.props.setLogin();
  }

  componentWillMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  async submitForm(e) {
    e.preventDefault();
    this.setState({ isLoading: true, error: false });

    let { username, password } = this.state;

    const loginData = {
      username,
      password
    };

    await this.props.fetchLogin(loginData);
    if (!this.props.login !== 0 && this.mounted) this.setState({ isLoading: false, error: true });
  }

  render() {
    let { isLoading, username, password, error } = this.state;
    return (
      <section className="hero is-dark has-text-white is-fullheight">
        <div className="hero-body">
          <div className="container has-text-centered">
            <div className="column is-4-widescreen is-offset-4-widescreen is-6-desktop is-offset-3-desktop is-8-tablet is-offset-2-tablet">
              <h3 className="title">Login</h3>
              <div className="box">
                <form onSubmit={this.submitForm}>
                  <div className="field">
                    <div className="control">
                      <input
                        className="input"
                        name="username"
                        type="text"
                        placeholder="Username..."
                        autoFocus
                        value={username || ""}
                        onChange={this.handleChange}
                        autoComplete="off"
                      />
                    </div>
                  </div>

                  <div className="field">
                    <div className="control">
                      <input
                        className="input"
                        name="password"
                        type="password"
                        placeholder="Password..."
                        value={password || ""}
                        onChange={this.handleChange}
                      />
                    </div>
                    <p className={error ? "help is-danger" : "hidden"}>Wrong username or password</p>
                  </div>
                  <button
                    className={isLoading ? "button is-block is-primary is-fullwidth is-loading" : "button is-block is-primary is-fullwidth"}
                    disabled={isLoading}>
                    Login
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

const mapStateToProps = state => {
  return {
    login: state.login.item
  };
};

export default connect(
  mapStateToProps,
  { fetchLogin, setLogin }
)(Login);
