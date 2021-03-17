import React, { Component } from "react";
import { Row, Form, Col, Container, Card } from 'react-bootstrap';
import { Button, ListGroup } from 'react-bootstrap';
import axios from 'axios'
import localhost from "../../config.js"

export default class Invitation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            groupName : this.props.invitations.group_name,

        };
    }
    handleClick = () =>{
        const data = {
            userId: JSON.parse(localStorage.getItem('user')).userId,
            groupName: this.state.groupName,
        };
    axios.post(`${localhost}/myGroups`, data)
            .then((response) => {
                this.props.onAcceptInvite(this.props.invitations)
            }).catch((err) => {
                alert(err.response.data)
                // console.log(err);
            });
        }

    // rejectInvite = () => {
        
    // }    
    render(){
        const name = JSON.parse(localStorage.getItem('user')).user_name
        return (
            <Card style={{ width: '18rem' }}>
                <Card.Body>
                    <Card.Text>
                       {name}  invited you to join the group <b>{this.props.invitations.group_name}</b>
                    </Card.Text>
                    <Button onClick={this.handleClick}>Accept</Button>
                    <Button onClick={this.handleClick} >Reject</Button>
                </Card.Body>
            </Card>
        )
    }
}