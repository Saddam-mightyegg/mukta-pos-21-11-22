import React from "react";
import axios from "axios";

import Cookies from "universal-cookie";
import { Wordpress } from "../functions/Woocommerce";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

var cookies_element = {};

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username_error: true,
      error_message: "",
      loading: false,
    };
    this.submitSignInApiAsync = this.submitSignInApiAsync.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  async submitSignInApiAsync(event) {
    event.preventDefault();
    this.setState({
      loading: true,
    });
    const cookies = new Cookies();
    Wordpress.authenticate(cookies_element).then(
      (res) => {
        cookies.set("token", res.data.jwt.token);
        this.props.history.push("/pos");
      },
      (error) => {
        var response = "Check your network connection";
        if (error.message) {
          response = error.message;
        }
        if (error.response) {
          response = error.response.data.message;
        }

        this.setState({
          username_error: true,
          error_message: response,
          loading: false,
        });
      }
    );
  }

  handleChange(event) {
    //console.log("hello");
    //console.log(event.target.value);
    var name = event.target.name;
    const value = event.target.value;

    cookies_element[name] = value;
  }

  render() {
    return (
      <div>
        <div class="wrapper fadeInDown">
          <div id="formContent">
            <div class="fadeIn first">
              <img
                src="https://www.muktaofficial.com/wp-content/uploads/2020/07/MUKTA-logo.png"
                id="icon"
                alt="User Icon"
              />
            </div>
            <form>
              {this.state.username_error && (
                <div>
                  <div
                    className="text-danger"
                    dangerouslySetInnerHTML={{
                      __html: this.state.error_message,
                    }}
                  />
                </div>
              )}
              <input
                type="text"
                id="login"
                class="fadeIn second"
                name="username"
                placeholder="Login"
                onChange={this.handleChange}
              />

              <input
                type="password"
                id="password"
                class="fadeIn third"
                name="password"
                placeholder="Password"
                onChange={this.handleChange}
              />

              <Button
                variant="fadeIn fourth login"
                onClick={this.submitSignInApiAsync}
              >
                {this.state.loading ? (
                  <>
                    Signing ...
                    <Spinner
                      as="span"
                      animation="grow"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
              {
                // <button class="fadeIn fourth login" value="Log In" onClick = {this.submitSignInApiAsync}>
                //           Log In
                // </button>
              }
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
