import React from "react";
import { Route, Redirect } from "react-router-dom";
import { isLogin } from "./components/Authentication/util";

class PublicRoute extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      isAuthenticated: true,
    };
  }

  async componentDidMount() {
    await isLogin().then(async (result) => {
      if (result) {
        // /alert("yep")
        await this.setState({
          isAuthenticated: true,
        });
      } else {
        this.setState({
          isAuthenticated: false,
        });
      }
    });

    await this.setState({
      loading: true,
    });
  }

  render() {
    const { component: Component, ...rest } = this.props;
    return (
      <Route
        {...rest}
        render={(props) =>
          this.state.loading ? (
            this.state.isAuthenticated ? (
              <Redirect to="/pos" />
            ) : (
              <Component {...props} />
            )
          ) : (
            <span>Redirecting.............</span>
          )
        }
      />
    );
  }
}
export default PublicRoute;
