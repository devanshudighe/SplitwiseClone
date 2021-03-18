import React, { Component } from "react";
import { Row, Form, Col, Container, Card } from 'react-bootstrap';
import { Button, ListGroup } from 'react-bootstrap';
import axios from 'axios'
import localhost from "../../config.js"

export default class DashboardCard extends Component {

    render() {
        return (
            <Row>
                <Col>
                    YOU OWE
                </Col>
                <Col>
                    YOU ARE OWED
                </Col>
            </Row>
        )
    }
}