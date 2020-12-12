import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SinglePost from "./pages/SinglePost";

import MenuBar from "./components/MenuBar";

import AuthRoute from "./util/AuthRoute";

import "semantic-ui-css/semantic.min.css";
import { Container } from "semantic-ui-react";

import "./App.css";

import { AuthProvider } from "./context/auth";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Container style={{ width: "70%" }}>
          <MenuBar />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/posts/:postId" component={SinglePost} />
            <AuthRoute path="/login" component={Login} />
            <AuthRoute path="/register" component={Register} />
          </Switch>
        </Container>
      </Router>
    </AuthProvider>
  );
};

export default App;
