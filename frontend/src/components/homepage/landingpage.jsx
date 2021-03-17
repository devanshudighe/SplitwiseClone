import React, { Component } from "react";
// import {Media,Image}  from 'react-bootstrap'
import homepage from "../../images/homepage.png"
import { Redirect } from 'react-router-dom';
import { connect } from "react-redux";
import { Container, Row } from "react-bootstrap";

class Home extends Component {
  render() {
    const { user: currentUser } = this.props;

    if (!currentUser) {
      return <Redirect to="/home" />;
    }
    return (
      <div>  
        <div
          style={{
            background: `url(${homepage})`,
            backgroundSize: "cover",
            height: "70vh",
            width: "100vw",
            backgroundRepeat: 'no-repeat',
            backgroundPosition : 'center'
            // backgroundAttachment : 'fixed'
            // zIndex : 

            // color: "#f5f5f5"
          }}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { user } = state.auth;
  return {
    user,
  };
}
export default connect(mapStateToProps)(Home)