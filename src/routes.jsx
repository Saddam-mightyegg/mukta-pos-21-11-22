import React from "react";
import { Route, Switch, useParams } from "react-router-dom";
import Login from "./components/Authentication/login";

import App from "./components/App";
import MainApp from "./components/Barcode/mainApp";

import PrivateRoute from "./privateRoute";

import PublicRoute from "./publicRoute";

import Reciept from "./components/Product/reciept";
import Pdfhtml from "./components/Product/pdfhtml";

import Test from "./Test";

const Routes = () => {
  return (
    <div>
      <Switch>
        <PublicRoute exact path="/" component={Login} />
        <Route exact path="/scan" component={MainApp} />
        <Route exact path="/pdf" component={Reciept} />
        <Route exact path="/test" component={Test} />

        <PrivateRoute exact key={"pos"} path="/pos" component={App} />
      </Switch>
    </div>
  );
};

// export default {AuthenticationRoutes, GameRoutes}
export default Routes;
