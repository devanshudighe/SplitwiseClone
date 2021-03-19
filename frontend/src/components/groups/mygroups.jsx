import React, { Component, useState } from "react";
import { Row, Form, Col, Container, Card } from 'react-bootstrap';
import { Button, ListGroup, Modal } from 'react-bootstrap';
import axios from 'axios'
import localhost from "../../config.js"
import GroupDetailCard from "./groupDetailCard.jsx";
import NavRight from "../navbar/navbarRight";

export default class MyGroups extends Component {
    constructor(props) {
        super(props);
        this.state = {
            groupName: this.props.location.state.group_name,
            groupDetails: [],
            show: false,
            setShow: false,
        };

        this.getGroupDetails();
    }



    getGroupDetails = () => {
        const userId = JSON.parse(localStorage.getItem('user')).userId
        // console.log(userId)
        // console.log(`${localhost}/groupdetails/user_id/${userId}/group_name/${this.props.location.state.group_name}`)
        axios.get(`${localhost}/groupdetails/user_id/${userId}/group_name/${this.props.location.state.group_name}`)
            .then((response) => {
                console.log(response)
                if (response.data[0]) {
                    this.setState({
                        groupDetails: response.data,
                    })
                }
            }).catch((err) => {
                console.log(err)
            })
    }
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
            [e.target.name]: e.target.value
        });
    }

    sendExpenses = () => {
        const userId = JSON.parse(localStorage.getItem('user')).userId
        const data = {
            groupName: this.state.groupName,
            billName: this.state.billName,
            billPaidBy: userId,
            billAmount: this.state.billAmount,
        }
        axios.post(`${localhost}/bill`, data)
            .then((response) => {
                console.log(response)
                this.setState({
                    message: response.data,
                    setShow: false,
                    show: false,
                    ...this.getGroupDetails(),
                });
            }).catch(err => console.log(err))
    }

    render() {
        // if(this.state.message === "BILL_ADDED") 
        const groupElements = []
        if (this.state && this.state.groupDetails && this.state.groupDetails.length > 0) {
            this.state.groupDetails.map((groupDetail) => {
                const groupElement = (
                    <ListGroup.Item><GroupDetailCard groupDetail={groupDetail} /></ListGroup.Item>
                );
                groupElements.push(groupElement);
            });
        }
        return (
            <div className="mt-4">
                <Row>
                    <Col md={{ span: 9 }}>
                        <Row>
                            <Col md={{ offset: 3, span: 4 }}>
                                <h2>{this.state.groupName}</h2>
                            </Col>
                            <Col>
                                <Button variant="warning" onClick={this.handleShow}>Add Expense</Button>{' '}
                                <Modal show={this.state.show} onHide={this.handleClose}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Add an expense</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <ListGroup variant="flush">
                                            <ListGroup.Item>With you and <b>{this.state.groupName}</b></ListGroup.Item>
                                            <ListGroup.Item>
                                                <Row md="pt-2">
                                                    <Col md={{ span: "2", offset: "1" }}>
                                                        <img alt="Default" src="https://s3.amazonaws.com/splitwise/uploads/category/icon/square_v2/uncategorized/general@2x.png" />
                                                    </Col>
                                                    <Col md={{ span: "2", offset: "3" }}>
                                                        <Row>
                                                            <input type="text" class="description" placeholder="Enter a description" name="billName" onChange={this.onChangeFields} />
                                                        </Row>
                                                        <Row>
                                                            <input type="text" class="cost" placeholder="0.00" name="billAmount" onChange={this.onChangeFields} />
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                        </ListGroup>
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
                            <Row>
                                <Row className="mt-1">
                                    <Col md={{
                                        span: "2",
                                        offset: "1"
                                    }}>
                                    </Col>
                                    <Col md={{
                                        span: "6"
                                    }}>
                                        <ListGroup variant='flush' style={{
                                            width: "100%"
                                        }}>
                                            {groupElements}
                                        </ListGroup>
                                    </Col>
                                    <Col md={{
                                        span: "4"
                                    }}>
                                    </Col>
                                </Row>
                            </Row>
                        </Row>
                    </Col>
                    <Col>
                        <NavRight groupName={this.state.groupName} />
                    </Col>
                </Row>
            </div>
        )
    }
}