import React from "react";
// import { useDispatch, useSelector } from "react-redux";
import { Router, Switch, Route, Link } from "react-router-dom";
import { Navbar, NavDropdown, Button, Nav, Container } from 'react-bootstrap'
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { connect } from "react-redux";
import Login from "./components/login/login";
import Register from "./components/signup/signup";
import Profile from "./components/profile/profile"
import Home from "./components/homepage/landingpage";
import Dashboard from "./components/dashboard/dashboard";
import CreateGroups from "./components/groups/createGroups"
import MyGroups from "./components/groups/mygroups"
import MyGroupsDashboard from "./components/groups/mygroupsdasboard"
// import Member from "./components/groups/addMembers"

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
    // console.log(userObj)
    // console.log(this.state.currentUser)
    let navbar = null;
    if (userObj) {
      navbar = (
        <Container style = {{
          height : "48px",
          width : 'auto',
          padding : '0 10px',
          margin : '0 auto',
          position : 'relative'
        }}  >
          <Navbar style={{
          position: 'fixed',
          width: '100%',
          top: '0',
          left: '0',
          backgroundColor: '#5bc5a7',
          zIndex: 99,
          borderBottom: '1px solid #48be9d',
          color: '#fff',
          textShadow: '0 -1px 0 #39a385',
          boxShadow: '0 0 3px rgb(0 0 0 / 50%)'


        }}>
            <Navbar.Brand href="/home" >
              <img
                position = "absolute"
                top = "0"
                left = "0"
                src="https://assets.splitwise.com/assets/core/logo-wordmark-horizontal-white-short-c309b91b96261a8a993563bdadcf22a89f00ebb260f4f04fd814c2249a6e05d4.svg"
                padding = "12px 10px"
                height="24"
                maxWidth = "100%"
                vertical-align = "middle"
                border = "0"
                alt="Splitwise Logo"
              />
            </Navbar.Brand>
            <Navbar.Toggle />
            
            <Navbar.Collapse className="justify-content-end">
              <NavDropdown title={userObj.user_name} id="basic-nav-dropdown">
                <NavDropdown.Item href = "/myGroups">My groups</NavDropdown.Item>
                <NavDropdown.Item href="/profile">Your Account</NavDropdown.Item>
                <NavDropdown.Item href="/groups">Create a group</NavDropdown.Item>
                <NavDropdown.Item href="/login" onClick={this.logOut}>Log out</NavDropdown.Item>
              </NavDropdown>
            </Navbar.Collapse>
          </Navbar>
        </Container>
      );
    } else {
      navbar = (
        <Container style = {{
          width : '940px',
          padding : '0 10px',
          margin : '0 auto',
          position : 'relative'


        }}>
          <Navbar style = {{
            position : 'fixed',
            width : '100%',
            top : '0',
            left : '0',
            backgroundColor : '#5bc5a7',
            zIndex : 99,
            borderBottom : '1px solid #48be9d',
            color : '#fff',
            textShadow : '0 0 black',
            boxShadow : '0 0 3px rgb(0 0 0 / 50%)'
          }}>
            <Navbar.Brand href="/home">
              <img
                src="https://assets.splitwise.com/assets/core/logo-wordmark-horizontal-white-short-c309b91b96261a8a993563bdadcf22a89f00ebb260f4f04fd814c2249a6e05d4.svg"
                width="118"
                height="24"
                className="d-inline-block align-top"
                alt="Splitwise Logo"
              />
          </Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
              <Nav.Link href="/login">Log in</Nav.Link>
              <Button href="/signup">Sign up</Button>
            </Navbar.Collapse>
          </Navbar>
        </Container>

      );
    }

    return (
      <Router history={history}>
        <div>
          {navbar}
          <Switch>
            <Route exact path={["/","/home"]} component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={Register} />
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/dashboard" component={Dashboard} />
            <Route exact path="/groups" component={CreateGroups} />
            <Route exact path="/groupdetails" component={MyGroups} />
            <Route exact path="/myGroups" component={MyGroupsDashboard} />
          </Switch>
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