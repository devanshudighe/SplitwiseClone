import React, { Component } from "react";
import { Row, Form, Col, Container, Card } from 'react-bootstrap';
import { Button, ListGroup } from 'react-bootstrap';
import axios from 'axios'
import localhost from "../../config.js"
import GroupDetailCard from "./groupDetailCard.jsx";

export default class MyGroups extends Component {
    constructor(props) {
        super(props);
        this.state = {
            groupName : this.props.location.state.group_name,
            groupDetails : []
        };
        this.getGroupDetails();
    }

    

    getGroupDetails = () => {
        const userId = JSON.parse(localStorage.getItem('user')).userId
        console.log(userId)
        console.log(`${localhost}/groupdetails/user_id/${userId}/group_name/${this.props.location.state.group_name}`)
        axios.get(`${localhost}/groupdetails/user_id/${userId}/group_name/${this.props.location.state.group_name}`)
        .then((response) => {
            console.log(response)
            if(response.data[0]){
                this.setState({
                    groupDetails : response.data,
                })
            }
        }).catch((err) => {
            console.log(err)
        })
    }    
    render() {
        const groupElements = []
        if (this.state && this.state.groupDetails && this.state.groupDetails.length > 0) {
            this.state.groupDetails.map((groupDetail) => {
                const groupElement = (
                  <ListGroup.Item><GroupDetailCard groupDetail = {groupDetail}/></ListGroup.Item>
                );
                groupElements.push(groupElement);
              });          
        }
        return (
            <Container className="mt-3" >
                <Row>
                    <Col md={{ offset: 4, span: 4 }}>
                        <h1>{this.state.groupName}</h1>
                    </Col>
                </Row>
                <Row>
                    <Col md = {{
                            span : "2",
                            offset : "2"
                        }}>
                    </Col>
                    <Col md = {{
                        span : "6"
                    }}>
                        <ListGroup variant = 'flush' style = {{
                            width : "100%"
                        }}>
                            {groupElements}
                        </ListGroup>
                    </Col>
                    <Col md = {{
                            span : "4"
                        }}>
                    </Col>
                </Row>
            </Container>
        )
    }
}