import React, { Component } from "react";
import { Row, Col, Container, Modal, Form } from 'react-bootstrap';
import { Button, ListGroup } from 'react-bootstrap';
import axios from 'axios'
import localhost from "../../config.js"
import DashboardCard from "./dashboardCard"
import Autosuggest from 'react-autosuggest';
import Autocomplete from '../autocomplete/autocomplete'

var numeral = require('numeral');

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      setShow: false,
    };
    this.getDashboard();
  }
  getDashboard = () => {
    const userId = JSON.parse(localStorage.getItem('user')).userId
    axios.get(`${localhost}/dashboard/${userId}`)
      .then((response) => {
        console.log(response)
        this.setState({
          dashboard: response.data.message,
        })
      }).catch(err => console.log(err))
  }
  
  /*
  Autosuggest code
   */





  /*
  Autosuggest code end
   */
  handleClose = () => {
    this.setState({
      show: false,
      setShow: false,
    })
  }
  handleShow = () => {
    this.setState({
      show: true,
      setShow: true
    })
  }
  onChangeFields = (e) => {
    this.setState({
      [e.target.name] : e.target.value
    });
  }
  render() {
    const dashboardElements = []
    let totalBalances = 0;
    let collectBalance = [];
    let payBalance = [];
    let payNames = [];

    if (this.state && this.state.dashboard && this.state.dashboard.length > 0) {
      this.state.dashboard.map((dash) => {
        if (dash.collect_or_pay === "COLLECT") {
          collectBalance.push(dash.net_amt);
          console.log(typeof (dash.net_amt))
        }
        else if (dash.collect_or_pay === "PAY") {
          payBalance.push(dash.net_amt);
          payNames.push(dash.user2_name);
        }
        const dashboard = (
          <DashboardCard dashboard={dash} />
        );
        dashboardElements.push(dashboard);
      });
    }
    totalBalances += collectBalance.reduce((a, b) => a + b, 0);
    totalBalances -= payBalance.reduce((a, b) => a + b, 0);
    payBalance = payBalance.reduce((a, b) => a + b, 0);
    collectBalance = collectBalance.reduce((a, b) => a + b, 0);
    console.log(payNames)


    
    return (
      <Container className="mt-3" >
        <Row>
          <Col md={{ offset: 3, span: 4 }}>
            <h2>Dashboard</h2>
          </Col>
          <Col>
            <Button variant="warning" onClick={this.handleShow}>Settle up</Button>{' '}
            <Modal show={this.state.show} onHide={this.handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Settle up</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Row>
                  <Form.Group as={Col} md={4} className="p-0">
                    <Form.Label style={{ display: 'flex', justifyContent: 'flex-end' }}>You Paid: </Form.Label>
                  </Form.Group>
                  <Form.Group as={Col} md={4}>
                      <Autocomplete names = {payNames}/>
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group as={Col} md={{ span: '3', offset: '4'}}>
                    <Form.Control type="text" />
                  </Form.Group>
                </Row>
                
                
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={this.handleClose}>
                  Close
                </Button>
                <Button variant="primary" onClick={this.sendExpenses}>
                  Save Changes
                </Button>
              </Modal.Footer>
            </Modal>
          </Col>
        </Row>
        <Row>
          <ListGroup horizontal>
            <ListGroup.Item style={{ minWidth: "100%" }} >
              <Row>
                total balances
              </Row>
              <Row>
                {numeral(totalBalances).format('$0.00')}
              </Row>
            </ListGroup.Item >
            <ListGroup.Item style={{ minWidth: "100%" }}>
              <Row>
                you owe
                      </Row>
              <Row>
                {numeral(Math.abs(payBalance)).format('$0.00')}
              </Row>
            </ListGroup.Item>
            <ListGroup.Item style={{ minWidth: "100%" }}>
              <Row>
                you are owed
              </Row>
              <Row>
                {numeral(collectBalance).format('$0.00')}
              </Row>
            </ListGroup.Item>
          </ListGroup>
        </Row>
        {dashboardElements}

      </Container>
    );
  }
}