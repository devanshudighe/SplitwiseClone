import React, { Component } from "react";
import { Row, Form, Col, Container, Card, Dropdown } from 'react-bootstrap';
import { Button, ListGroup } from 'react-bootstrap';
import axios from 'axios'
import {Link} from 'react-router-dom'
import localhost from "../../config.js"
import Invitation from "./acceptInvitation.jsx";
import SearchBars from "./searchBar.jsx";

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
                                allUserGroups: list,
                                res : list.map(l => 
                                    l.group_name
                                )
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
    onAcceptInvite = () => {
                this.setState({
                    allGroupInvitations : [],

                    allUserGroups : [],
                    ...this.getInvitations(),
                    // inviteAccepted: response.data,
                });
                console.log(this.state.allGroupInvitations)
            }
    leavegroup = (e) => {
        const data = {
            userId : JSON.parse(localStorage.getItem('user')).userId,
            groupName : e.target.id,
        }
        console.log(data)
        axios.post(`${localhost}/groupdetails`,data)
        .then((response) => {
            console.log(response)
            if(response.data[0].flag === "ALL_BALANCE_SETTLED"){
                this.onAcceptInvite()
            }
            else{
                alert("Settle up remaining balances")
            }
        })
    }
    onSearch = async (name) => {
        console.log(name)
        const list = this.state.allUserGroups.filter( (group) =>group.group_name.toLowerCase().includes(name.toLowerCase()))
        console.log(list)
        await this.setState({
            res : list.map(l => 
                l.group_name
            )
        })
        console.log(this.state.res)
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
                                <Link>
                                    <Button id = {groups.group_name} onClick = {this.leavegroup} variant = "danger">Leave group</Button>
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
                    <Col md = {{span : "6"}}>
                        <SearchBars groupNames={this.state.allUserGroups.map((group) => group.group_name)} onSearch={this.onSearch} />
                    </Col>
                    <Col>
                        <Link to={{ pathname: '/groupDetails', state: { group_name: this.state.res } }}>
                            <Button variant="primary">Visit Group</Button>
                        </Link>
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

