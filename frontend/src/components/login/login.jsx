import React, { Component } from "react";
import { Redirect } from 'react-router-dom';

import { Container, Row, Col, Media } from 'react-bootstrap';
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";

import { connect } from "react-redux";
import { login } from "../../actions/auth";

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

class Login extends Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);

    this.state = {
      email: "",
      password: "",
      // loading: false,
    };
  }

  onChangeEmail(e) {
    this.setState({
      email: e.target.value,
    });
  }

  onChangePassword(e) {
    this.setState({ 
      password: e.target.value,
    });
  }

  handleLogin(e) {
    e.preventDefault();

    // this.setState({
    //   loading: true,
    // });

    this.form.validateAll();

    const { dispatch } = this.props;

    if (this.checkBtn.context._errors.length === 0) {
      dispatch(login(this.state.email, this.state.password))
        .then(() => {
          // eslint-disable-next-line no-restricted-globals
          history.push("/profile");
          window.location.reload();
        })
        .catch(() => {
          this.setState({
            loading: false

          });
        });
    } else {
      this.setState({
        loading: false,
      });
    }
  }

  render() {
    const { isLoggedIn, message } = this.props;
    console.log(this.props);
    let messages = "";
    if (isLoggedIn) {
      // localStorage.setItem('userId',);
      return <Redirect to="/dashboard" />;
    }
    else if( message === "NO_USER"){
      messages = "User does not exist"
    }
    else if( message === "Wrong Password"){
      messages = "Enter valid email or password";
    }
    return (
      <Container fluid 
      style= {{
        padding : 60
      }}>
        <Row className="justify-content-md-center">
          <Col xs lg="3">
            <Col>
              <img
                width={200}
                height={200}
                className="mr-2"
                src="https://assets.splitwise.com/assets/core/logo-square-65a6124237868b1d2ce2f5db2ab0b7c777e2348b797626816400534116ae22d7.svg"
                alt="Generic placeholder"
              />
            </Col>
            {/* <div className="container">
            </div> */}
          </Col>
          <Col md="auto">
            <Form
              onSubmit={this.handleLogin}
              ref={(c) => {
                this.form = c;
              }}>
              <h6>WELCOME TO SPLITWISE</h6>
              <div className="form-group">
                <div style={{ color: "#ff0000" }}>{messages}</div><br />
                <label>Email address</label>
                <input
                  type="email"
                  name="email"
                  value={this.state.email}
                  className="form-control"
                  onChange={this.onChangeEmail}
                  validations={[required]}
                  required
                  placeholder="Enter email" />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter password"
                  name="password"
                  value={this.state.password}
                  onChange={this.onChangePassword}
                  validations={[required]}
                  required />
              </div>
              <button type="submit" className="btn btn-dark btn-lg">Log in</button>
              <CheckButton
                style={{ display: "none" }}
                ref={(c) => {
                  this.checkBtn = c;
                }}
              />
            </Form>
          </Col>
        </Row>
      </Container>

    );
  }
}
// const mapStateToProps = state => {
//   return ({
//     user : state.login.user
//   }
//   )
// }
function mapStateToProps(state) {
  const { isLoggedIn } = state.auth;
  const { message } = state.message;
  return {
    isLoggedIn,
    message
  };
}
export default connect(mapStateToProps)(Login);