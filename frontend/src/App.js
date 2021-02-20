import React from "react";
// import { useDispatch, useSelector } from "react-redux";
import { Router, Switch, Route, Link } from "react-router-dom";
import { Navbar, NavDropdown, Button, Nav } from 'react-bootstrap'
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { connect } from "react-redux";
import Login from "./components/login/login";
import Register from "./components/signup/signup";
import Profile from "./components/profile/profile"
import Home from "./components/homepage/landingpage";

import { logout } from "./actions/auth";
import { clearMessage } from "./actions/message";

import { history } from "./helpers/history";
import { Component } from "react";

class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      // showModeratorBoard: false,
      // showAdminBoard: false,
      currentUser: undefined
    };

    history.listen((location) => {
      props.dispatch(clearMessage()); // clear message when changing location
    });
  }

  componentDidMount() {
    const user = this.props.user;
    if (user) {
      this.setState({
        currentUser: user
      });
    }
  }

  logOut() {
    window.localStorage.clear();
    this.props.dispatch(logout());
  }

  render() {
    // const { currentUser } = this.state;
    const userObj = JSON.parse(localStorage.getItem("user"));
    console.log(userObj)
    let navbar = null;
    if(userObj){
      navbar = (
        <Navbar>
          <Navbar.Brand href="/home">Splitwise</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <NavDropdown title= {userObj.user_name} id="basic-nav-dropdown">
              <NavDropdown.Item href="#">Your Account</NavDropdown.Item>
              <NavDropdown.Item href="#">Create a group</NavDropdown.Item>
              <NavDropdown.Item href="/login" onClick={this.logOut}>Log out</NavDropdown.Item>
            </NavDropdown>
          </Navbar.Collapse>
        </Navbar>
      );
    } else {
      navbar = (
        <Navbar>
          <Navbar.Brand href="/home">Splitwise</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Nav.Link href="/login">Log in</Nav.Link>
            <Button href="/signup">Sign up</Button>
          </Navbar.Collapse>
        </Navbar>
      );
    }

    return (
      <Router history={history}>
        <div>
          {navbar}
          <div className="container mt-3">
            <Switch>
              <Route exact path={["/"]} component={Home} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/signup" component={Register} />
              <Route exact path="/profile" component={Profile} />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

function mapStateToProps(state) {
  const { user } = state.auth;
  return {
    user,
  };
}

export default connect(mapStateToProps)(App);