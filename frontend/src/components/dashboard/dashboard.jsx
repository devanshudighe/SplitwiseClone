import React, { Component } from "react";
import { Row, Col, Container, Modal, Form } from 'react-bootstrap';
import { Button, ListGroup } from 'react-bootstrap';
import axios from 'axios'
import localhost from "../../config.js"
import DashboardCard from "./dashboardCard"
import Autosuggest from 'react-autosuggest';
import Autocomplete from '../autocomplete/autocomplete'
import LeftNavbar from '../navbar/navbarLeft';

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

  onAc = (value) => {
    this.setState({
      name : value,
    });
    
  }
  sendExpenses = () => {
    const userId = JSON.parse(localStorage.getItem('user')).userId;
    const data = {
      userId : userId,
      owedName : this.state.name,
      amount : this.state.amount,
    }
    console.log(data)
    axios.post(`${localhost}/dashboard/`,data)
    .then((response) => {
      console.log(response);
      this.setState({
        ...this.getDashboard()
      })
      this.handleClose();
    }).catch(err => console.log(err))
  }

  render() {

    const dashboardElements = []
    let totalBalances = 0;
    let collectBalance = [];
    let payBalance = [];
    let payNames = [];
    let leftNavbar = []

    if (this.state && this.state.dashboard && this.state.dashboard.length > 0) {
      // console.log(this.state.dashboard)
      this.state.dashboard.map((dash) => {
        if (dash.collect_or_pay === "COLLECT") {
          collectBalance.push(dash.net_amt);
          console.log(typeof (dash.net_amt))
        }
        else if (dash.collect_or_pay === "PAY") {
          payBalance.push(dash.net_amt);
          payNames.push(dash.user2_name);
        }
        // console.log(this.state.name)
        
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



    
    return (
      <Row>
        <Col md = "3">
          <Row className = "mt-4"></Row>
          <Row className = "mx-3">
            <LeftNavbar />
          </Row>

        </Col>
        <Col md = "6">
          <Row className = "mt-4">
            <Col md = "9" style = {{textAlign : "center"}}>
              <h2 >Dashboard</h2>
            </Col>
            <Col md = "3" style = {{textAlign : "right"}}>
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
                      <Autocomplete names={payNames} onAutocomplete={this.onAc} />

                    </Form.Group>
                  </Row>
                  <Row>
                    <Form.Group as={Col} md={{ span: '3', offset: '4' }}>
                      <Form.Control type="text" name="amount" onChange={this.onChangeFields} required />
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
          <Row className = "mt-2">
            <ListGroup horizontal style= {{ width: "100%" }}>
              <ListGroup.Item as = {Col}  >
                <Row style = {{justifyContent : "center"}}>
                  <div>
                    total balances
                  </div>
                </Row>
                <Row style = {{justifyContent : "center"}}>
                  <div>
                    {numeral(totalBalances).format('$0.00')}
                  </div>
                  
                </Row>
              </ListGroup.Item >
              <ListGroup.Item  as = {Col}>
                <Row style = {{justifyContent : "center"}}>
                  <div>
                    you owe
                  </div>
                  
                </Row>
                <Row style = {{justifyContent : "center"}}>
                  <div>
                    {numeral(Math.abs(payBalance)).format('$0.00')}
                  </div>
                  
                </Row>
              </ListGroup.Item>
              <ListGroup.Item  as = {Col} >
                <Row style = {{justifyContent : "center"}}>
                  <div>
                    you are owed
                  </div>
                  
                </Row>
                <Row style = {{justifyContent : "center"}}>
                  <div>
                    {numeral(collectBalance).format('$0.00')}
                  </div>
                  
                </Row>
              </ListGroup.Item>
            </ListGroup>
          </Row>
          <Row>
            <Col style = {{justifyContent : "left"}}>
              <h2 style={{
                position: "relative",
                fontSize: "14px",
                textTransform: "uppercase",
                color: "#999",
                padding: "5px 0",
              }}>
                you owe
            </h2>
            </Col>
            <Col style = {{justifyContent : "right"}}>
              <h2 style={{
                position: "relative",
                textAlign : "right",
                fontSize: "14px",
                textTransform: "uppercase",
                color: "#999",
                padding: "5px",
              }}>
                you are owed
            </h2>
            </Col>
            
          </Row>
          <Row>
            {dashboardElements}
          </Row>
        </Col>
        <Col md = "3">
        </Col>
        
          
        

      </Row>
    );
  }
}