import React, { Component } from "react";
import { Row, Form, Col, Container, Card } from 'react-bootstrap';
import { Button, ListGroup } from 'react-bootstrap';
import axios from 'axios'
import {Link} from 'react-router-dom'
import localhost from "../../config.js"
import Invitation from "./acceptInvitation.jsx";

class MyGroupsDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allGroupInvitations: [],
            allUserGroups: [],
        };
        this.getInvitations();
    }
    getInvitations = () => {
        const userId = JSON.parse(localStorage.getItem('user')).userId
        axios.get(`${localhost}/myGroups/${userId}`)
            .then(response => {
                if (response.data[0]) {
                    console.log(response.data)
                    response.data.map(invitations => {
                        console.log(invitations)
                        if (invitations.is_member === "N") {
                            const list = [...this.state.allGroupInvitations, invitations]
                            this.setState({
                                allGroupInvitations: list
                            });
                        }
                        else if (invitations.is_member === "Y") {
                            const list = [...this.state.allUserGroups, invitations]
                            // console.log(list)
                            this.setState({
                                allUserGroups: list
                            });
                        }
                    }
                    )
                }
            })
            .catch(err => {
                if (err.response && err.response.data) {
                    console.log(err.response.data);
                }
            });
    };
    onAcceptInvite = (in_invitations) => {
        let acceptedInvites = this.state.allGroupInvitations;
                console.log(acceptedInvites)
                acceptedInvites = acceptedInvites.filter((acc) => acc.group_name !== in_invitations.group_name )
                // console.log(acceptedInvites)
                in_invitations.is_member = 'Y'
                 
                const acceptedGroups = [...this.state.allUserGroups,in_invitations]
                this.setState({
                    allGroupInvitations : acceptedInvites,

                    allUserGroups : acceptedGroups
                    // inviteAccepted: response.data,
                });
                console.log(this.state.allGroupInvitations)
    }
    render() {
        // console.log(JSON.parse(name).user_name);
        let invitations = null;
        let groups = null;
        if (this.state && this.state.allGroupInvitations.length > 0) {
            invitations = this.state.allGroupInvitations.map(invitations => {
                // if (invitations.is_member === "N") {
                    console.log("inside invitation map")
                    return (
                        <Invitation 
                        invitations = {invitations}
                        onAcceptInvite = {this.onAcceptInvite} />
                    );
                // }
            });
        }
        if (this.state && this.state.allUserGroups.length > 0){
            groups = this.state.allUserGroups.map(groups => {
                if (groups.is_member === "Y") {
                    return (
                        <Card style={{ width: '18rem' }}>
                            <Card.Body>
                                <Card.Title><b>{groups.group_name}</b></Card.Title>
                                <Link to={{ pathname: '/groupDetails', state: { group_name: groups.group_name } }}>
                                    <Button variant="link">Visit Group</Button>
                                </Link>
                            </Card.Body>
                        </Card>
                    )
                }
            });
        }
        return (
            <Container className="mt-3" >
                <Row>
                    <Col md={{ offset: 4, span: 4 }}>
                        <h1>My Groups</h1>
                    </Col>
                </Row>
                <Row>
                    <Col md={{ span: 3 }}>
                        <h3>Group Invitations</h3>
                        <Card style={{
                            marginTop: "20px",
                            width: '18rem'
                        }}>
                            {invitations}
                        </Card>
                    </Col>
                    <Col md={{ offset: 5, span: 3 }}>
                        <h3>My Groups</h3>
                        <Card style={{
                            marginTop: "20px",
                            width: '18rem'
                        }}>
                            {groups}
                        </Card>
                    </Col>

                </Row>

            </Container>
        );
    }
}
export default MyGroupsDashboard;

