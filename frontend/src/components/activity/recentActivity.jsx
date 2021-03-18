import React, { Component } from "react";
import { Row, Form, Col, Container, Card } from 'react-bootstrap';
import { Button, ListGroup } from 'react-bootstrap';
import axios from 'axios'
import localhost from "../../config.js"
import RecentActivityDetailCard from "./recentActivityDetails.jsx";

export default class RecentActivity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activity : []
        };
        this.getRecentActivity();
    }

    getRecentActivity = () => {
        const userId = JSON.parse(localStorage.getItem('user')).userId
        axios.get(`${localhost}/recent/${userId}`)
        .then((response) => {
            if(response.data[0]){
                this.setState({
                    activity : response.data,
                })
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    render() {
        const groupElements = []
        if (this.state && this.state.activity && this.state.activity.length > 0) {
            this.state.activity.map((recentActivity) => {
                console.log(recentActivity)
                const groupElement = (
                  <ListGroup.Item><RecentActivityDetailCard recentActivity = {recentActivity}/></ListGroup.Item>
                );
                groupElements.push(groupElement);
              });          
        }
        return (
            <Container className="mt-3" >
                <Row>
                    <Col md={{ offset: 3, span: 4 }}>
                        <h1>Recent Activity</h1>
                    </Col>
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