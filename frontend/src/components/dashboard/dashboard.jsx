import React, { Component } from "react";
import { Row, Form, Col, Container, Card } from 'react-bootstrap';
import { Button, ListGroup } from 'react-bootstrap';
import axios from 'axios'
import localhost from "../../config.js"
import DashboardCard from "./dashboardCard"
var numeral = require('numeral');

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.getDashboard();
}
getDashboard = () => {
  const userId = JSON.parse(localStorage.getItem('user')).userId
  axios.get(`${localhost}/dashboard/${userId}`)
  .then((response) => {
    console.log(response)
      this.setState({
        dashboard : response.data.message,
      })
  }).catch(err => console.log(err))
}
  render() {
    const dashboardElements = []
    let totalBalances = 0;
    let collectBalance = [];
    let payBalance = [];

        if (this.state && this.state.dashboard && this.state.dashboard.length > 0) {
            this.state.dashboard.map((dash) => {
              if(dash.collect_or_pay === "COLLECT"){
                collectBalance.push(dash.net_amt);
                console.log(typeof(dash.net_amt))
              }
              else if(dash.collect_or_pay === "PAY"){
                payBalance.push(dash.net_amt);
              }
              const dashboard = (
                <DashboardCard dashboard = {dash}/>
              );
              dashboardElements.push(dashboard);
              });          
        }
    totalBalances += collectBalance.reduce((a, b) => a + b, 0);
    totalBalances -= payBalance.reduce((a, b) => a + b, 0);
    payBalance = payBalance.reduce((a, b) => a + b, 0);
    collectBalance = collectBalance.reduce((a, b) => a + b, 0);
    console.log(collectBalance)

    // console.log(this.state.dashboard);
    return (
      <Container className="mt-3" >
                <Row>
                    <Col md={{ offset: 3, span: 4 }}>
                        <h2>Dashboard</h2>
                    </Col>
                    <Col>
                        <Button variant="warning" onClick = {this.handleShow}>Settle up</Button>{' '}
                    </Col>
                </Row>
                <Row>
                  <ListGroup horizontal>
                    <ListGroup.Item style = {{minWidth : "100%"}} >
                      <Row>
                        total balances
                      </Row>
                      <Row>
                        {numeral(totalBalances).format('$0.00')}
                      </Row>
                    </ListGroup.Item >
                    <ListGroup.Item style = {{minWidth : "100%"}}>
                      <Row>
                        you owe
                      </Row>
                      <Row>
                        {numeral(payBalance).format('$0.00')}
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item style = {{minWidth : "100%"}}>
                      <Row>
                        you are owed
                      </Row>
                      <Row>
                        {numeral(collectBalance).format('$0.00')}
                      </Row>
                    </ListGroup.Item>
                  </ListGroup>
                </Row>
                <Row>
                    <Col md = {{
                            span : "2",
                            offset : "1"
                        }}>
                    </Col>
                    <Col md = {{
                        span : "6"
                    }}>
                      {dashboardElements}
                    </Col>
                    <Col md = {{
                            span : "4"
                        }}>
                    </Col>
                </Row>
            </Container>
    );
  }
}