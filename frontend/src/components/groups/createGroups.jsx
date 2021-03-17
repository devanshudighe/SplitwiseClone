import { Link } from 'react-router-dom';
import React, { Component } from "react";
import { Container, Row, Form, Col } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import Members from "./addMembers"
import axios from 'axios'
import localhost from "../../config.js"
// import Form from "react-validation/build/form";



export default class CreateGroups extends Component {
    constructor(props) {
        super(props);
        this.state = {
            invitationListSize: 1,
        };
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    onCreate = (e) => {
        e.preventDefault();
        // const user_id = localStorage.getItem('user_id');
        // const group_name = { ...this.state };
        const data = {
            userId: JSON.parse(localStorage.getItem('user')).userId,
            groupName: this.state.groupName,
        };
        console.log(data)
        axios.post(`${localhost}/groups`, data)
            .then((response) => {
                // console.log(res)
                this.setState({
                    groupCreated: response.data,
                });
            }).catch((err) => {
                alert(err.response.data)
                // console.log(err);
            });
    }

    onAddInvitationForm = () => {
        // invitationListSize;
        this.setState((prevState) => ({ invitationListSize: prevState.invitationListSize + 1 }));
    }
    render() {
        let loggedUser = null;
        const invitationForms = [];
        if (this.state.groupCreated === 'New Group Created') {
            loggedUser = (
                <Form.Row>
                    <Form.Group as={Col} md="6">
                        <Form.Control type="text" name="invite_name" placeholder={JSON.parse(localStorage.getItem('user')).user_name} onChange={this.onAddPersonName} disabled />
                    </Form.Group>
                    <Form.Group as={Col} md="6">
                        <Form.Control type="email" name="invite_email" placeholder={JSON.parse(localStorage.getItem('user')).email} onChange={this.onAddPersonEmail} disabled />
                    </Form.Group>
                </Form.Row>
            );
        }
        

        for (let i = 1; i <= this.state.invitationListSize; i += 1) {
            invitationForms.push(<Members groupName={this.state.groupName} />);
        }
        return (
            <Container className="mt-5">
                <Row>
                    <Col md={{ offset: 2, span: 3 }}>
                        <img
                            className="img-fluid rounded float-right"
                            // max-width="100%"
                            // vertical-align="middle"
                            // border="0"
                            width={200}
                            height={200}
                            // className="mr-2"
                            src="https://assets.splitwise.com/assets/core/logo-square-65a6124237868b1d2ce2f5db2ab0b7c777e2348b797626816400534116ae22d7.svg"
                            alt="Generic placeholder"
                        />
                    </Col>
                    <Col md={{ span: 4 }} >
                        <h2 style={{
                            textTransform: "uppercase",
                            fontSize: "16px",
                            color: "#999",
                            fontWeight: "bold",
                            lineHeight: "20px"
                        }}>
                            Start a new group
                        </h2>
                        <Form className="form" style={{
                            margin: "0 0 18px"
                        }}>
                            <Form.Group controlId="formCategory2">
                                <Form.Label style={{
                                    fontSize: "20px",
                                    margin: "16px 0 5px",
                                    lineHeight: "140%"
                                }}>My group shall be called...</Form.Label>
                                <Form.Control name="groupName" type="text" 
                                    value={this.state.groupName}
                                    onChange={this.onChange} 
                                    style={{
                                    fontSize: "24px",
                                    height: "42px",
                                    width: "95%",
                                    lineHeight: "140%",
                                    marginBottom: "17px"
                                }} />
                                <Button type="submit" className="btn btn-primary btn-md" onClick = {this.onCreate}>Create</Button>
                            </Form.Group>
                        </Form>
                        <h2 style={{
                            textTransform: "uppercase",
                            fontSize: "16px",
                            color: "#999",
                            fontWeight: "bold",
                            lineHeight: "20px"
                        }}>
                            Group members
                        </h2>
                        <Form>
                            {loggedUser}
                        </Form>
                        {invitationForms}
                        <Form.Row>
                            <Form.Group>
                                <Button type="submit" className="btn btn-primary btn-md" onClick = {this.onAddInvitationForm}>Add Member</Button>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Link to="/dashboard" className="btn btn-primary btn-md">Save</Link>
                        </Form.Row>
                    </Col>
                </Row>
            </Container>

        );
    }
}


